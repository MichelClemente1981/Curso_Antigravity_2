import React, { useState } from 'react';

// Localiza o usuário correspondente pelo identificador informado
function localizarUsuario(usuarios, identificador) {
  const busca = identificador.trim().toLowerCase();
  return usuarios.find(
    (u) => String(u.id) === busca || u.nome.toLowerCase() === busca
  );
}

// Valida as credenciais digitadas no formulário
function validarCredenciais(usuario, senha) {
  if (!usuario) {
    return 'Usuário não encontrado. Selecione ou digite um usuário válido.';
  }
  if (!senha || senha.trim().length < 3) {
    return 'Informe uma senha válida com pelo menos 3 caracteres.';
  }
  return null;
}

export function Login({ usuarios, onLogin, carregando }) {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);

  // Seleciona rapidamente um operador existente pelo card de perfil
  function preencherAcessoRapido(usuario) {
    setUsuarioSelecionado(usuario.nome);
    setSenha('123');
    setErro(null);
  }

  // Processa a validação e autentica a sessão
  function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    const usuario = localizarUsuario(usuarios, usuarioSelecionado);
    const mensagemErro = validarCredenciais(usuario, senha);

    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    onLogin(usuario);
  }

  return (
    <div className="login-container-canvas">
      <div className="canvas-card card-login">
        <div className="login-cabecalho">
          <div className="dock-logo-box login-logo">📦</div>
          <h1 className="login-titulo">SGA Almoxarifado</h1>
          <p className="login-subtitulo">Autenticação de Acesso ao Sistema</p>
        </div>

        {erro && (
          <div className="alerta-canvas alerta-erro">
            <span>⚠️</span>
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="formulario-canvas">
          <div className="campo-canvas">
            <label htmlFor="login-usuario">Operador / Usuário</label>
            <select
              id="login-usuario"
              value={usuarioSelecionado}
              onChange={(e) => setUsuarioSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione seu perfil...</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.nome}>
                  {u.nome} ({u.cargo}) — {u.cidade}, {u.pais}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-canvas">
            <label htmlFor="login-senha">Senha de Acesso</label>
            <input
              id="login-senha"
              type="password"
              placeholder="Digite sua senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-acao-canvas btn-canvas-entrada"
            disabled={carregando}
          >
            {carregando ? 'Verificando...' : 'Entrar no Almoxarifado ➔'}
          </button>
        </form>

        {/* Atalho para acesso rápido durante testes */}
        <div className="acesso-rapido-secao">
          <span className="acesso-rapido-rotulo">Acesso rápido para demonstração:</span>
          <div className="acesso-rapido-chips">
            {usuarios.map((u) => (
              <button
                key={u.id}
                type="button"
                className="chip-usuario-demo"
                onClick={() => preencherAcessoRapido(u)}
              >
                👤 {u.nome} ({u.cargo}) • 📍 {u.cidade}, {u.pais}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
