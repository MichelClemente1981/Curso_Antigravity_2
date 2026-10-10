import React, { useState, useEffect, useRef } from "react";
import { useItemBalance } from "../../hooks/useItemBalance";
import { useWithdrawal } from "../../hooks/useWithdrawal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import type { WithdrawalPayload } from "../../types";

// Matrícula especial com permissão para repor estoque (ENTRADA)
const MATRICULA_ALMOXARIFE = "T-124";

export function WithdrawalForm() {
  const { balance, isLoading: isLoadingBalance, error: balanceError, fetchBalance, clearBalance } = useItemBalance();
  const { submitWithdrawal, isSubmitting, error: withdrawalError, success, resetStatus } = useWithdrawal();

  const [formData, setFormData] = useState({
    itemCode: "",
    quantity: "",
    technicianId: "",
    shift: "MANHA",
  });

  // Tipo de movimentação: só T-124 pode alternar para ENTRADA
  const [tipo, setTipo] = useState<"SAIDA" | "ENTRADA">("SAIDA");

  const isAlmoxarife = formData.technicianId.trim().toUpperCase() === MATRICULA_ALMOXARIFE;

  const itemCodeRef = useRef<HTMLInputElement>(null);

  // Reseta para SAIDA quando a matrícula muda e não é mais almoxarife
  useEffect(() => {
    if (!isAlmoxarife) {
      setTipo("SAIDA");
    }
  }, [isAlmoxarife]);

  // Consulta saldo com debounce ao digitar o código do item
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.itemCode.length >= 3) {
        fetchBalance(formData.itemCode);
      } else {
        clearBalance();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.itemCode, fetchBalance, clearBalance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (success || withdrawalError) {
      resetStatus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetStatus();

    const payload: WithdrawalPayload = {
      item_codigo: formData.itemCode,
      tipo,
      quantidade: parseInt(formData.quantity, 10),
      tecnico_matricula: formData.technicianId,
      turno: formData.shift,
    };

    const isSuccess = await submitWithdrawal(payload);

    if (isSuccess) {
      // Atualiza o saldo após operação e limpa apenas a quantidade
      fetchBalance(formData.itemCode);
      setFormData((prev) => ({ ...prev, quantity: "" }));
      itemCodeRef.current?.focus();
    }
  };

  const isFormValid =
    formData.itemCode.trim() !== "" &&
    parseInt(formData.quantity, 10) > 0 &&
    formData.technicianId.trim() !== "" &&
    !isLoadingBalance;

  const labelBotao = tipo === "ENTRADA" ? "Confirmar Reposição" : "Confirmar Retirada";
  const mensagemSucesso = tipo === "ENTRADA"
    ? "Reposição de estoque registrada com sucesso."
    : "Retirada registrada com sucesso.";

  return (
    <section
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-100"
      aria-labelledby="form-heading"
    >
      <h2 id="form-heading" className="text-2xl font-bold text-gray-800 mb-6">
        {tipo === "ENTRADA" ? "Repor Estoque" : "Registrar Retirada de Material"}
      </h2>

      {success && <Alert type="success" message={mensagemSucesso} />}
      {withdrawalError && <Alert type="error" message={withdrawalError} />}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* Seção: Código do item e saldo */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <Input
            ref={itemCodeRef}
            label="Código do Item"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            placeholder="Ex: FERR-001"
            required
            autoComplete="off"
          />

          <div aria-live="polite" className="min-h-[2.5rem]">
            {isLoadingBalance ? (
              <span className="text-sm text-gray-500">Consultando saldo...</span>
            ) : balanceError ? (
              <span className="text-sm text-red-600 font-medium">⚠ Item não encontrado: {balanceError}</span>
            ) : balance ? (
              <div
                className={`text-sm font-semibold px-3 py-2 rounded-md ${
                  balance.status === "alerta"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                <span className="font-bold">{balance.nome}</span>
                <span className="mx-2">—</span>
                Saldo atual:
                <span className="font-bold ml-1">{balance.estoque_atual} unidades</span>
                {balance.status === "alerta" && (
                  <span className="ml-2 text-xs text-red-600">
                    (⚠ abaixo do mínimo de {balance.estoque_minimo})
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Seção: Dados da movimentação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            min="1"
            label="Quantidade"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            required
          />

          <Input
            label="Matrícula do Técnico"
            name="technicianId"
            value={formData.technicianId}
            onChange={handleChange}
            placeholder="Ex: T-123"
            required
          />
        </div>

        {/* Seletor de tipo: visível apenas para T-124 */}
        {isAlmoxarife && (
          <div
            className="p-4 bg-amber-50 border border-amber-300 rounded-md"
            role="group"
            aria-labelledby="tipo-label"
          >
            <p id="tipo-label" className="text-sm font-bold text-amber-800 mb-3">
              🔑 Permissão de Almoxarife — Tipo de Movimentação
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="SAIDA"
                  checked={tipo === "SAIDA"}
                  onChange={() => setTipo("SAIDA")}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  📤 Retirada (SAÍDA)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="ENTRADA"
                  checked={tipo === "ENTRADA"}
                  onChange={() => setTipo("ENTRADA")}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  📥 Reposição (ENTRADA)
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="shift-select" className="text-sm font-semibold text-gray-700">
            Turno
          </label>
          <select
            id="shift-select"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="NOITE">Noite</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            type="submit"
            className={`w-full md:w-auto md:min-w-[200px] ${
              tipo === "ENTRADA" ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : ""
            }`}
            isLoading={isSubmitting}
            disabled={!isFormValid}
          >
            {labelBotao}
          </Button>
        </div>
      </form>
    </section>
  );
}
