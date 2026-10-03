import React, { useState, useEffect } from 'react';
import { obterProdutos, obterUsuarios, obterMovimentacoes } from './services/api';
import { FormularioMovimentacao } from './components/FormularioMovimentacao';
import { FormularioUsuario } from './components/FormularioUsuario';
import { ListaProdutos } from './components/ListaProdutos';
import { HistoricoMovimentacoes } from './components/HistoricoMovimentacoes';
import { Login } from './components/Login';
import './App.css';

// Calcula os totais e alertas quantitativos de estoque
function calcularMetricas(produtos) {
  const totalUnidades = produtos.reduce((acc, p) => acc + (p.quantidade_estoque || 0), 0);
  const itensCriticos = produtos.filter((p) => p.quantidade_estoque <= 15).length;
  return { totalItens: produtos.length, totalUnidades, itensCriticos };
}

// Recupera a sessão ativa do usuário no armazenamento da sessão
function recuperarSessao() {
  try {
    const dados = sessionStorage.getItem('sga_usuario');
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

// Executa o carregamento assíncrono dos recursos da API em paralelo
async function carregarDados(setters, setCarregando, setErro) {
  try {
    setCarregando(true);
    setErro(null);
    const [prods, users, movs] = await Promise.all([
      obterProdutos(),
      obterUsuarios(),
      obterMovimentacoes(),
    ]);
    setters.setProdutos(prods);
    setters.setUsuarios(users);
    setters.setMovimentacoes(movs);
  } catch (err) {
    setErro(err.message || 'Falha na conexão com o servidor local.');
  } finally {
    setCarregando(false);
  }
}

export default function App() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(recuperarSessao);
  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState('');
  const [abaLateral, setAbaLateral] = useState('movimentacao');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Sincroniza dados com a API
  function sincronizar() {
    carregarDados({ setProdutos, setUsuarios, setMovimentacoes }, setCarregando, setErro);
  }

  // Trata o cadastro de um novo usuário e retorna para a movimentação
  function handleUsuarioCadastrado(novoUsuario) {
    setUsuarios((antigos) => [...antigos, novoUsuario]);
    setAbaLateral('movimentacao');
    sincronizar();
  }

  // Seleciona um produto a partir do clique no painel de fotos
  function handleSelecionarProduto(produto) {
    setProdutoSelecionadoId(produto.id);
  }

  // Registra a sessão autenticada do usuário
  function handleLogin(usuario) {
    setUsuarioAutenticado(usuario);
    sessionStorage.setItem('sga_usuario', JSON.stringify(usuario));
  }

  // Encerra a sessão atual e retorna para o login
  function handleLogout() {
    setUsuarioAutenticado(null);
    sessionStorage.removeItem('sga_usuario');
  }

  useEffect(() => {
    sincronizar();
  }, []);

  const metricas = calcularMetricas(produtos);

  // Exibe a tela de login antes de acessar o sistema principal
  if (!usuarioAutenticado) {
    return <Login usuarios={usuarios} onLogin={handleLogin} carregando={carregando} />;
  }

  return (
    <div className="canvas-viewport">
      <header className="canvas-dock-header">
        <div className="dock-marca">
          <div className="dock-logo-box">📦</div>
          <div>
            <h1 className="dock-titulo">SGA Canvas Workspace</h1>
            <p className="dock-subtitulo">Gerenciamento Dinâmico de Almoxarifado</p>
          </div>
        </div>

        <div className="dock-status-container">
          <div className="perfil-usuario-badge">
            <span className="avatar-circulo">{usuarioAutenticado.nome[0]}</span>
            <div className="perfil-info">
              <span className="perfil-nome">{usuarioAutenticado.nome}</span>
              <span className="perfil-cargo">
                {usuarioAutenticado.cargo} {usuarioAutenticado.cidade ? `• 📍 ${usuarioAutenticado.cidade}, ${usuarioAutenticado.pais}` : ''}
              </span>
            </div>
          </div>
          <button onClick={sincronizar} className="btn-dock-sync" title="Recarregar dados">
            🔄 Sincronizar
          </button>
          <button onClick={handleLogout} className="btn-dock-logout" title="Sair da sessão">
            🚪 Sair
          </button>
        </div>
      </header>

      <main className="canvas-board">
        {erro && (
          <div className="canvas-banner-erro">
            <span>⚠️ {erro}</span>
            <small>Verifique se o comando 'npm run server' está ativo no terminal.</small>
          </div>
        )}

        <section className="canvas-kpi-bar">
          <div className="kpi-widget">
            <span className="kpi-icone">🏷️</span>
            <div>
              <span className="kpi-label">SKUs Cadastrados</span>
              <strong className="kpi-valor">{metricas.totalItens}</strong>
            </div>
          </div>

          <div className="kpi-widget">
            <span className="kpi-icone">📊</span>
            <div>
              <span className="kpi-label">Volume Total de Itens</span>
              <strong className="kpi-valor">{metricas.totalUnidades} <span className="kpi-unidade">un</span></strong>
            </div>
          </div>

          <div className="kpi-widget kpi-alerta">
            <span className="kpi-icone">⚠️</span>
            <div>
              <span className="kpi-label">Estoque Crítico (≤ 15 un)</span>
              <strong className="kpi-valor valor-destaque-alerta">{metricas.itensCriticos}</strong>
            </div>
          </div>
        </section>

        <div className="canvas-layout-grid">
          <aside className="canvas-coluna-lateral">
            <div className="seletor-aba-lateral">
              <button
                type="button"
                className={`btn-aba-lateral ${abaLateral === 'movimentacao' ? 'aba-ativa' : ''}`}
                onClick={() => setAbaLateral('movimentacao')}
              >
                ⚡ Movimentação
              </button>
              <button
                type="button"
                className={`btn-aba-lateral ${abaLateral === 'cadastro_usuario' ? 'aba-ativa' : ''}`}
                onClick={() => setAbaLateral('cadastro_usuario')}
              >
                👤 Novo Usuário
              </button>
            </div>

            {abaLateral === 'cadastro_usuario' ? (
              <FormularioUsuario
                onSucesso={handleUsuarioCadastrado}
                onCancelar={() => setAbaLateral('movimentacao')}
              />
            ) : (
              <FormularioMovimentacao
                produtos={produtos}
                usuarios={usuarios}
                usuarioAtivo={usuarioAutenticado}
                produtoSelecionadoId={produtoSelecionadoId}
                onAbrirCadastroUsuario={() => setAbaLateral('cadastro_usuario')}
                onSucesso={sincronizar}
              />
            )}
          </aside>

          <section className="canvas-coluna-central">
            <ListaProdutos
              produtos={produtos}
              carregando={carregando}
              onSelecionarProduto={handleSelecionarProduto}
            />
            <HistoricoMovimentacoes
              movimentacoes={movimentacoes}
              produtos={produtos}
              usuarios={usuarios}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
