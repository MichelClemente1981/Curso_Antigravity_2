import type { WithdrawalPayload, ItemBalance, ApiError } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchWithError(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(errorData.erro || "Ocorreu um erro inesperado.");
  }

  return response;
}

export const api = {
  async getBalance(itemCode: string): Promise<ItemBalance> {
    const response = await fetchWithError(`${API_BASE_URL}/itens/${encodeURIComponent(itemCode)}/saldo`);
    return response.json();
  },

  async registerWithdrawal(payload: WithdrawalPayload): Promise<void> {
    await fetchWithError(`${API_BASE_URL}/movimentacoes`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
