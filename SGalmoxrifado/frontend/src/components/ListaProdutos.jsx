import React, { useState } from 'react';

// Retorna a etiqueta e status visual baseado no nível de estoque
function classificarStatusEstoque(quantidade) {
  if (quantidade <= 0) {
    return { classe: 'tag-zerado', texto: 'Sem Estoque', corBarra: '#ef4444' };
  }
  if (quantidade <= 15) {
    return { classe: 'tag-critico', texto: 'Alerta Baixo', corBarra: '#f59e0b' };
  }
  return { classe: 'tag-ok', texto: 'Disponível', corBarra: '#10b981' };
}

// Filtra a lista de produtos com base no nome ou código SKU
function filtrarProdutos(produtos, termo) {
  if (!termo.trim()) return produtos;
  const busca = termo.toLowerCase();
  return produtos.filter(
    (p) => p.nome.toLowerCase().includes(busca) || p.sku.toLowerCase().includes(busca)
  );
}

// Renderiza o card individual com foto em alta qualidade e indicadores
function CardProdutoFoto({ item, onSelecionar }) {
  const status = classificarStatusEstoque(item.quantidade_estoque);
  const percentual = Math.min(100, Math.max(8, (item.quantidade_estoque / 100) * 100));

  return (
    <div className="card-item-canvas card-com-foto">
      <div className="container-foto-produto">
        <img
          src={item.imagem || '/favicon.svg'}
          alt={item.nome}
          className="foto-produto-canvas"
          loading="lazy"
        />
        <span className={`tag-status tag-sobreposta ${status.classe}`}>{status.texto}</span>
      </div>

      <div className="corpo-card-foto">
        <div className="card-item-topo">
          <span className="chip-sku">{item.sku}</span>
          {onSelecionar && (
            <button
              type="button"
              className="btn-selecionar-rapido"
              onClick={() => onSelecionar(item)}
              title="Selecionar este produto para movimentação"
            >
              Movimentar ➔
            </button>
          )}
        </div>

        <h3 className="nome-item-canvas">{item.nome}</h3>

        <div className="metrica-item-canvas">
          <span className="numero-saldo">{item.quantidade_estoque}</span>
          <span className="unidade-rotulo">unidades</span>
        </div>

        <div className="trilha-barra-estoque">
          <div
            className="barra-progresso-estoque"
            style={{ width: `${percentual}%`, backgroundColor: status.corBarra }}
          />
        </div>
      </div>
    </div>
  );
}

// Renderiza a grade de vitrine visual com fotos
function GradeCards({ itens, onSelecionar }) {
  return (
    <div className="canvas-grid-produtos">
      {itens.map((item) => (
        <CardProdutoFoto key={item.id} item={item} onSelecionar={onSelecionar} />
      ))}
    </div>
  );
}

// Renderiza a tabela analítica com miniaturas de fotos dos produtos
function TabelaProdutos({ itens }) {
  return (
    <div className="tabela-container">
      <table className="tabela-sga">
        <thead>
          <tr>
            <th>Foto</th>
            <th>SKU</th>
            <th>Nome do Produto</th>
            <th>Saldo Atual</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => {
            const status = classificarStatusEstoque(item.quantidade_estoque);
            return (
              <tr key={item.id}>
                <td className="celula-foto">
                  <img
                    src={item.imagem || '/favicon.svg'}
                    alt={item.nome}
                    className="miniatura-tabela"
                  />
                </td>
                <td className="celula-sku"><code>{item.sku}</code></td>
                <td className="celula-nome">{item.nome}</td>
                <td className="celula-qtd"><strong>{item.quantidade_estoque}</strong> un</td>
                <td><span className={`tag-status ${status.classe}`}>{status.texto}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ListaProdutos({ produtos, carregando, onSelecionarProduto }) {
  const [busca, setBusca] = useState('');
  const [modoExibicao, setModoExibicao] = useState('cards');
  const listaFiltrada = filtrarProdutos(produtos, busca);

  return (
    <div className="canvas-card">
      <div className="card-header-flex">
        <div>
          <h2 className="card-titulo-canvas">Painel e Vitrine de Produtos</h2>
          <p className="card-subtitulo-canvas">{produtos.length} produtos catalogados com fotos reais</p>
        </div>

        <div className="acoes-cabecalho-lista">
          <input
            type="text"
            placeholder="🔍 Filtrar produto ou SKU..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca-canvas"
          />
          <div className="seletor-modo-exibicao">
            <button
              type="button"
              className={`btn-modo ${modoExibicao === 'cards' ? 'modo-ativo' : ''}`}
              onClick={() => setModoExibicao('cards')}
              title="Visualização com fotos em cards"
            >
              🖼️ Fotos
            </button>
            <button
              type="button"
              className={`btn-modo ${modoExibicao === 'tabela' ? 'modo-ativo' : ''}`}
              onClick={() => setModoExibicao('tabela')}
              title="Visualização em tabela"
            >
              ≡ Tabela
            </button>
          </div>
        </div>
      </div>

      {carregando ? (
        <p className="carregando-texto">Carregando painel de produtos...</p>
      ) : listaFiltrada.length === 0 ? (
        <div className="texto-vazio">Nenhum produto corresponde à busca informada.</div>
      ) : modoExibicao === 'cards' ? (
        <GradeCards itens={listaFiltrada} onSelecionar={onSelecionarProduto} />
      ) : (
        <TabelaProdutos itens={listaFiltrada} />
      )}
    </div>
  );
}
