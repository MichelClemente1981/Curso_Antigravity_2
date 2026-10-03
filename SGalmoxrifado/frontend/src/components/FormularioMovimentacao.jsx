import React, { useState } from 'react';
import { criarMovimentacao, atualizarEstoqueProduto } from '../services/api';

// Calcula o novo saldo de estoque com base no tipo da operação
function calcularNovoEstoque(tipo, estoqueAtual, quantidade) {
  if (tipo === 'entrada') {
    return estoqueAtual + quantidade;
  }
  return estoqueAtual - quantidade;
}

// Valida campos e regras de negócio: impede saída maior que o saldo atual
function validarRegraEstoque(produto, usuarioId, tipo, quantidade) {
  if (!produto) return 'Selecione um produto no catálogo.';
  if (!usuarioId) return 'Selecione o operador responsável.';
  if (Number.isNaN(quantidade) || quantidade <= 0) {
    return 'Informe uma quantidade válida e maior que zero.';
  }
  if (tipo === 'saida' && quantidade > produto.quantidade_estoque) {
    return `Estoque insuficiente! Saldo atual disponível: ${produto.quantidade_estoque} un.`;
  }
  return null;
}

// Persiste a movimentação e logo após atualiza o saldo de estoque no json-server
async function registrarOperacao(produtoId, usuarioId, tipo, qtd, novoEstoque) {
  await criarMovimentacao({
    produto_id: produtoId,
    usuario_id: usuarioId,
    tipo,
    quantidade_movimentada: qtd,
    data: new Date().toISOString(),
  });
  await atualizarEstoqueProduto(produtoId, novoEstoque);
}

export function FormularioMovimentacao({
  produtos,
  usuarios,
  usuarioAtivo,
  produtoSelecionadoId,
  onAbrirCadastroUsuario,
  onSucesso,
}) {
  const [produtoId, setProdutoId] = useState('');
  const [usuarioId, setUsuarioId] = useState(usuarioAtivo ? String(usuarioAtivo.id) : '');
  const [tipo, setTipo] = useState('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [status, setStatus] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Sincroniza o produto quando selecionado externamente na vitrine
  React.useEffect(() => {
    if (produtoSelecionadoId) setProdutoId(String(produtoSelecionadoId));
  }, [produtoSelecionadoId]);

  const produtoSelecionado = produtos.find((p) => String(p.id) === String(produtoId));
  const usuarioSelecionado = usuarios.find((u) => String(u.id) === String(usuarioId));
  const qtdNumerica = Number(quantidade) || 0;
  const previsaoEstoque = produtoSelecionado && qtdNumerica > 0
    ? calcularNovoEstoque(tipo, produtoSelecionado.quantidade_estoque, qtdNumerica)
    : null;

  // Executa as chamadas de API para registrar movimentação e novo estoque
  async function executarTransacao(produto, qtd) {
    try {
      setCarregando(true);
      const novoEstoque = calcularNovoEstoque(tipo, produto.quantidade_estoque, qtd);
      await registrarOperacao(produto.id, usuarioId, tipo, qtd, novoEstoque);
      setQuantidade('');
      setStatus({ tipo: 'sucesso', texto: `Sucesso! Novo saldo de ${produto.nome}: ${novoEstoque} un.` });
      if (onSucesso) onSucesso();
    } catch (erro) {
      setStatus({ tipo: 'erro', texto: erro.message || 'Falha ao processar movimentação.' });
    } finally {
      setCarregando(false);
    }
  }

  // Intercepta o envio do formulário e valida dados antes de disparar a transação
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const erroValidacao = validarRegraEstoque(produtoSelecionado, usuarioId, tipo, qtdNumerica);
    if (erroValidacao) {
      setStatus({ tipo: 'erro', texto: erroValidacao });
      return;
    }
    await executarTransacao(produtoSelecionado, qtdNumerica);
  }

  return (
    <div className="canvas-card card-formulario">
      <div className="card-cabecalho-canvas">
        <div className="badge-icone-flutuante">⚡</div>
        <div>
          <h2 className="card-titulo-canvas">Registrar Movimentação</h2>
          <p className="card-subtitulo-canvas">Entrada e saída em tempo real</p>
        </div>
      </div>

      {status && (
        <div className={`alerta-canvas ${status.tipo === 'erro' ? 'alerta-erro' : 'alerta-sucesso'}`}>
          <span>{status.tipo === 'erro' ? '⚠️' : '✅'}</span>
          <span>{status.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="formulario-canvas">
        {/* Seletor visual tipo toggle */}
        <div className="toggle-tipo-container">
          <button
            type="button"
            className={`btn-toggle-tipo ${tipo === 'entrada' ? 'ativo-entrada' : ''}`}
            onClick={() => setTipo('entrada')}
          >
            <span>➕</span> Entrada de Estoque
          </button>
          <button
            type="button"
            className={`btn-toggle-tipo ${tipo === 'saida' ? 'ativo-saida' : ''}`}
            onClick={() => setTipo('saida')}
          >
            <span>➖</span> Saída de Estoque
          </button>
        </div>

        <div className="campo-canvas">
          <label htmlFor="select-produto">Item do Catálogo</label>
          <select
            id="select-produto"
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            required
          >
            <option value="">Selecione o produto...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} — [Saldo: {p.quantidade_estoque} un]
              </option>
            ))}
          </select>
        </div>

        {/* Prévia com foto do item selecionado */}
        {produtoSelecionado && (
          <div className="preview-produto-selecionado">
            <img
              src={produtoSelecionado.imagem || '/favicon.svg'}
              alt={produtoSelecionado.nome}
              className="foto-preview-miniatura"
            />
            <div className="preview-detalhes">
              <strong className="preview-nome">{produtoSelecionado.nome}</strong>
              <span className="preview-info">
                SKU: <code>{produtoSelecionado.sku}</code> • Saldo: <strong>{produtoSelecionado.quantidade_estoque} un</strong>
              </span>
            </div>
          </div>
        )}

        <div className="campo-canvas">
          <div className="label-com-link">
            <label htmlFor="select-usuario">Operador Responsável</label>
            {onAbrirCadastroUsuario && (
              <button
                type="button"
                className="link-acao-formulario"
                onClick={onAbrirCadastroUsuario}
              >
                + Cadastrar Usuário
              </button>
            )}
          </div>
          <select
            id="select-usuario"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
          >
            <option value="">Selecione quem está operando...</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.cargo}) — {u.cidade}, {u.pais}
              </option>
            ))}
          </select>
        </div>

        {/* Informação de localização do operador selecionado */}
        {usuarioSelecionado && usuarioSelecionado.cidade && (
          <div className="preview-usuario-localizacao">
            <span className="icone-pin-usuario">📍</span>
            <div className="texto-pin-usuario">
              <span className="rotulo-pin">Base de Operação:</span>
              <strong className="cidade-pais-pin">
                {usuarioSelecionado.cidade}, {usuarioSelecionado.pais}
              </strong>
            </div>
          </div>
        )}

        <div className="campo-canvas">
          <label htmlFor="input-quantidade">Quantidade a Movimentar</label>
          <input
            id="input-quantidade"
            type="number"
            min="1"
            step="1"
            placeholder="Ex: 15"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>

        {/* Pré-visualização dinâmica do impacto no estoque */}
        {previsaoEstoque !== null && (
          <div className={`card-previsao ${previsaoEstoque < 0 ? 'previsao-negativa' : ''}`}>
            <span className="previsao-rotulo">Saldo resultante:</span>
            <span className="previsao-valores">
              {produtoSelecionado.quantidade_estoque} un ➔ <strong>{previsaoEstoque} un</strong>
            </span>
          </div>
        )}

        <button
          type="submit"
          className={`btn-acao-canvas ${tipo === 'saida' ? 'btn-canvas-saida' : 'btn-canvas-entrada'}`}
          disabled={carregando}
        >
          {carregando ? 'Processando transação...' : `Confirmar ${tipo === 'entrada' ? 'Entrada (+)' : 'Saída (-)'}`}
        </button>
      </form>
    </div>
  );
}
