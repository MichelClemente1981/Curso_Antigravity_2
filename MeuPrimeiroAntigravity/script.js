/**
 * Aplicativo: Meu Dia - Lista de Tarefas
 * Descrição: Gerenciamento de tarefas simples com persistência em LocalStorage
 */

// Chave utilizada para salvar no LocalStorage
const STORAGE_KEY = 'meu_dia_tarefas';

// Seleção de elementos do DOM
const formTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const emptyState = document.getElementById('empty-state');
const dataAtualElement = document.getElementById('data-atual');

/**
 * Exibe a data formatada no cabeçalho (ex: Segunda-feira, 19 de Setembro)
 */
function exibirDataAtual() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', day: 'numeric', month: 'long' };
    dataAtualElement.textContent = hoje.toLocaleDateString('pt-BR', opcoes);
}

/**
 * Recupera a lista de tarefas salvas no LocalStorage
 * @returns {Array<{id: number, texto: string}>}
 */
function obterTarefasDoStorage() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

/**
 * Salva o array de tarefas atualizado no LocalStorage
 * @param {Array<{id: number, texto: string}>} tarefas 
 */
function salvarTarefasNoStorage(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

/**
 * Atualiza a interface da lista de tarefas e o estado vazio
 */
function renderizarTarefas() {
    const tarefas = obterTarefasDoStorage();

    // Limpa a lista antes de renderizar
    listaTarefas.innerHTML = '';

    // Alterna a mensagem de lista vazia
    if (tarefas.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Cria os elementos de cada tarefa
    tarefas.forEach(tarefa => {
        const itemLi = document.createElement('li');
        itemLi.className = 'task-item';

        const spanTexto = document.createElement('span');
        spanTexto.className = 'task-text';
        spanTexto.textContent = tarefa.texto;

        const btnExcluir = document.createElement('button');
        btnExcluir.className = 'btn-excluir';
        btnExcluir.textContent = 'Excluir';
        btnExcluir.setAttribute('aria-label', `Excluir tarefa ${tarefa.texto}`);
        
        // Evento de clique para remover a tarefa
        btnExcluir.addEventListener('click', () => {
            removerTarefa(tarefa.id);
        });

        itemLi.appendChild(spanTexto);
        itemLi.appendChild(btnExcluir);

        listaTarefas.appendChild(itemLi);
    });
}

/**
 * Adiciona uma nova tarefa
 * @param {Event} event 
 */
function adicionarTarefa(event) {
    event.preventDefault(); // Evita recarregar a página ao enviar o formulário

    const textoTarefa = inputTarefa.value.trim();

    // Validação: campo não pode estar vazio
    if (textoTarefa === '') {
        alert('Por favor, digite uma tarefa antes de adicionar!');
        inputTarefa.focus();
        return;
    }

    const novaTarefa = {
        id: Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
        texto: textoTarefa
    };

    const tarefas = obterTarefasDoStorage();
    tarefas.push(novaTarefa);

    salvarTarefasNoStorage(tarefas);
    renderizarTarefas();

    // Limpa o campo e foca novamente nele
    inputTarefa.value = '';
    inputTarefa.focus();
}

/**
 * Remove uma tarefa pelo seu identificador único (ID)
 * @param {number} idTarefa 
 */
function removerTarefa(idTarefa) {
    const tarefas = obterTarefasDoStorage();
    const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== idTarefa);

    salvarTarefasNoStorage(tarefasAtualizadas);
    renderizarTarefas();
}

// ===================================================
// Inicialização de Eventos
// ===================================================
formTarefa.addEventListener('submit', adicionarTarefa);

// Carrega as tarefas e a data ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    exibirDataAtual();
    renderizarTarefas();
});

