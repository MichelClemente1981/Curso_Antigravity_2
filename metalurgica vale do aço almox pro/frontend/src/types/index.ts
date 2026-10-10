// O backend retorna formatos de sucesso/erro que mapeamos aqui
export interface WithdrawalPayload {
  item_codigo: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  tecnico_matricula?: string;
  turno?: string;
}

export interface ItemBalance {
  codigo: string;
  nome: string;
  estoque_atual: number; // campo real retornado pela API
  estoque_minimo: number;
  status: 'ok' | 'alerta';
}

export interface ApiError {
  erro: string;
}
