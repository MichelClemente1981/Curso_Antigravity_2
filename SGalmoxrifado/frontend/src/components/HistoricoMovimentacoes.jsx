import React from 'react';

// Converte a data ISO em formato amigável para exibição em pt-BR
function formatarData(dataIso) {
  if (!dataIso) return '-';
  const data = new Date(dataIso);
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Obtém o nome descritivo do item ou retorna o identificador de fallback
function resolverNome(lista, id, campo) {
  const item = lista.find((elem) => String(elem.id) === String(id));
  return item ? item[campo] : `ID #${id}`;
}

export function HistoricoMovimentacoes({ movimentacoes, produtos, usuarios }) {
  return (
    <div className="canvas-card">
      <div className="card-cabecalho-canvas">
        <div className="badge-icone-flutuante">📋</div>
        <div>
          <h2 className="card-titulo-canvas">Linha do Tempo de Movimentações</h2>
          <p className="card-subtitulo-canvas">Auditoria das últimas operações efetuadas</p>
        </div>
      </div>

      <div className="canvas-timeline">
        {movimentacoes.length === 0 ? (
          <div className="texto-vazio">Nenhum evento registrado no histórico.</div>
        ) : (
          movimentacoes.slice(0, 8).map((mov) => {
            const ehEntrada = mov.tipo === 'entrada';
            return (
              <div key={mov.id} className="timeline-item">
                <div className={`timeline-marcador ${ehEntrada ? 'marcador-entrada' : 'marcador-saida'}`}>
                  {ehEntrada ? '▲' : '▼'}
                </div>
                <div className="timeline-conteudo">
                  <div className="timeline-cabecalho">
                    <span className="timeline-produto">{resolverNome(produtos, mov.produto_id, 'nome')}</span>
                    <span className={`badge-diff ${ehEntrada ? 'diff-positivo' : 'diff-negativo'}`}>
                      {ehEntrada ? `+${mov.quantidade_movimentada}` : `-${mov.quantidade_movimentada}`} un
                    </span>
                  </div>
                  <div className="timeline-rodape">
                    <span className="timeline-operador">👤 {resolverNome(usuarios, mov.usuario_id, 'nome')}</span>
                    <span className="timeline-data">🕒 {formatarData(mov.data)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
