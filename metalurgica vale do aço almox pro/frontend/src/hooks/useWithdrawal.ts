import { useState } from "react";
import { api } from "../services/api";
import type { WithdrawalPayload } from "../types";

export function useWithdrawal() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitWithdrawal = async (payload: WithdrawalPayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.registerWithdrawal(payload);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao registrar movimentação");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isSubmitting,
    error,
    success,
    submitWithdrawal,
    resetStatus,
  };
}
