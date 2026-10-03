import React, { useState } from 'react';
import { criarUsuario } from '../services/api';
import { consultarCepViaCep, formatarApenasDigitos } from '../services/cep';

// Valida os campos obrigatórios do novo usuário
function validarDadosUsuario(form) {
  if (!form.nome.trim()) return 'Informe o nome completo do usuário.';
  if (!form.cargo.trim()) return 'Selecione ou informe o cargo do usuário.';
  if (!form.cidade.trim()) return 'Informe a cidade de atuação.';
  if (!form.pais.trim()) return 'Informe o país de atuação.';
  if (!form.endereco.trim()) return 'Informe o endereço residencial ou base.';
  return null;
}

// Dispara a consulta na API do ViaCEP e preenche os campos de localização
async function carregarEnderecoPorCep(cep, setForm, setAvisoCep, setBuscando) {
  const digitos = formatarApenasDigitos(cep);
  if (digitos.length !== 8) return;

  try {
    setBuscando(true);
    setAvisoCep(null);
    const dados = await consultarCepViaCep(digitos);
    setForm((antigo) => ({
      ...antigo,
      endereco: dados.endereco || antigo.endereco,
      cidade: dados.cidade || antigo.cidade,
      pais: 'Brasil',
    }));
  } catch (erro) {
    setAvisoCep(erro.message || 'Falha ao buscar CEP.');
  } finally {
    setBuscando(false);
  }
}

export function FormularioUsuario({ onSucesso, onCancelar }) {
  const [form, setForm] = useState({
    nome: '',
    cargo: 'Operador',
    cep: '',
    endereco: '',
    cidade: '',
    pais: 'Brasil',
  });
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [avisoCep, setAvisoCep] = useState(null);
  const [status, setStatus] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // Trata mudanças no campo de CEP e busca automaticamente ao completar 8 dígitos
  function handleCepChange(e) {
    const valor = e.target.value;
    setForm((antigo) => ({ ...antigo, cep: valor }));
    if (formatarApenasDigitos(valor).length === 8) {
      carregarEnderecoPorCep(valor, setForm, setAvisoCep, setBuscandoCep);
    }
  }

  // Envia os dados validados do novo usuário para persistência na API
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const erroValidacao = validarDadosUsuario(form);
    if (erroValidacao) return setStatus({ tipo: 'erro', texto: erroValidacao });

    try {
      setSalvando(true);
      const novoUsuario = await criarUsuario(form);
      setStatus({ tipo: 'sucesso', texto: `Usuário ${novoUsuario.nome} cadastrado com sucesso!` });
      if (onSucesso) onSucesso(novoUsuario);
    } catch (erro) {
      setStatus({ tipo: 'erro', texto: erro.message || 'Falha ao salvar usuário.' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="canvas-card card-formulario">
      <div className="card-cabecalho-canvas">
        <div className="badge-icone-flutuante">👤</div>
        <div>
          <h2 className="card-titulo-canvas">Cadastrar Operador</h2>
          <p className="card-subtitulo-canvas">Novo perfil com preenchimento via CEP</p>
        </div>
      </div>

      {status && (
        <div className={`alerta-canvas ${status.tipo === 'erro' ? 'alerta-erro' : 'alerta-sucesso'}`}>
          <span>{status.tipo === 'erro' ? '⚠️' : '✅'}</span>
          <span>{status.texto}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="formulario-canvas">
        <div className="campo-canvas">
          <label htmlFor="usr-nome">Nome Completo</label>
          <input
            id="usr-nome"
            type="text"
            placeholder="Ex: João da Silva"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="campo-canvas">
          <label htmlFor="usr-cargo">Cargo / Função</label>
          <select
            id="usr-cargo"
            value={form.cargo}
            onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            required
          >
            <option value="Operador">Operador</option>
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor de Almoxarifado</option>
            <option value="Conferente">Conferente / Estoquista</option>
          </select>
        </div>

        {/* Campo de CEP com indicador de busca automática */}
        <div className="campo-canvas">
          <div className="label-com-status">
            <label htmlFor="usr-cep">CEP (Brasil)</label>
            {buscandoCep && <span className="status-cep-carregando">🔍 Buscando ViaCEP...</span>}
          </div>
          <div className="grupo-input-cep">
            <input
              id="usr-cep"
              type="text"
              maxLength="9"
              placeholder="00000-000"
              value={form.cep}
              onChange={handleCepChange}
              onBlur={() => carregarEnderecoPorCep(form.cep, setForm, setAvisoCep, setBuscandoCep)}
              required
            />
            <button
              type="button"
              className="btn-buscar-cep"
              onClick={() => carregarEnderecoPorCep(form.cep, setForm, setAvisoCep, setBuscandoCep)}
              disabled={buscandoCep}
            >
              Buscar
            </button>
          </div>
          {avisoCep && <span className="aviso-erro-cep">⚠️ {avisoCep}</span>}
        </div>

        <div className="campo-canvas">
          <label htmlFor="usr-endereco">Endereço (Rua, Bairro)</label>
          <input
            id="usr-endereco"
            type="text"
            placeholder="Preenchido automaticamente pelo CEP"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            required
          />
        </div>

        <div className="grid-2-col">
          <div className="campo-canvas">
            <label htmlFor="usr-cidade">Cidade</label>
            <input
              id="usr-cidade"
              type="text"
              placeholder="Ex: São Paulo"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              required
            />
          </div>

          <div className="campo-canvas">
            <label htmlFor="usr-pais">País</label>
            <input
              id="usr-pais"
              type="text"
              value={form.pais}
              onChange={(e) => setForm({ ...form, pais: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grupo-botoes-form">
          <button
            type="submit"
            className="btn-acao-canvas btn-canvas-entrada"
            disabled={salvando || buscandoCep}
          >
            {salvando ? 'Cadastrando...' : 'Confirmar Cadastro ➔'}
          </button>
          {onCancelar && (
            <button
              type="button"
              className="btn-cancelar-canvas"
              onClick={onCancelar}
            >
              Voltar para Movimentação
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
