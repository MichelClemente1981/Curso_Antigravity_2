import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { ItemBalance } from "../types";

export function useItemBalance() {
  const [balance, setBalance] = useState<ItemBalance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async (itemCode: string) => {
    if (!itemCode.trim()) {
      setBalance(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getBalance(itemCode);
      setBalance(data);
    } catch (err) {
      setBalance(null);
      setError(err instanceof Error ? err.message : "Falha ao consultar saldo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearBalance = useCallback(() => {
    setBalance(null);
    setError(null);
  }, []);

  return {
    balance,
    isLoading,
    error,
    fetchBalance,
    clearBalance,
  };
}
