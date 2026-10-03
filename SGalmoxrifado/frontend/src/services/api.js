// Configuração da URL base obtida do ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Busca lista completa de produtos
export async function obterProdutos() {
  const resposta = await fetch(`${API_URL}/produtos`);
  if (!resposta.ok) throw new Error('Falha ao consultar produtos na base.');
  return resposta.json();
}

// Busca lista de usuários cadastrados
export async function obterUsuarios() {
  const resposta = await fetch(`${API_URL}/usuarios`);
  if (!resposta.ok) throw new Error('Falha ao consultar usuários na base.');
  return resposta.json();
}

// Busca o histórico de movimentações ordenadas por data
export async function obterMovimentacoes() {
  const resposta = await fetch(`${API_URL}/movimentacoes?_sort=data&_order=desc`);
  if (!resposta.ok) throw new Error('Falha ao consultar histórico de movimentações.');
  return resposta.json();
}

// Registra um novo item no histórico de movimentações
export async function criarMovimentacao(movimentacao) {
  const resposta = await fetch(`${API_URL}/movimentacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movimentacao),
  });
  if (!resposta.ok) throw new Error('Falha ao registrar movimentação.');
  return resposta.json();
}

// Atualiza a quantidade disponível em estoque de um produto
export async function atualizarEstoqueProduto(id, novoEstoque) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade_estoque: novoEstoque }),
  });
  if (!resposta.ok) throw new Error('Falha ao atualizar quantidade em estoque.');
  return resposta.json();
}

// Registra um novo usuário no banco de dados
export async function criarUsuario(usuario) {
  const resposta = await fetch(`${API_URL}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });
  if (!resposta.ok) throw new Error('Falha ao cadastrar novo usuário.');
  return resposta.json();
}
