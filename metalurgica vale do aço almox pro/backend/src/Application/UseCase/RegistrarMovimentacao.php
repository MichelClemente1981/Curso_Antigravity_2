<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Application\DTO\MovimentacaoInputDTO;
use App\Domain\Entity\Movimentacao;
use App\Domain\Enum\TipoMovimentacao;
use App\Domain\Repository\ItemRepositoryInterface;
use App\Domain\Repository\MovimentacaoRepositoryInterface;
use App\Domain\Repository\TransactionManagerInterface;
use DateTimeImmutable;

class RegistrarMovimentacao
{
    public function __construct(
        private ItemRepositoryInterface $itemRepository,
        private MovimentacaoRepositoryInterface $movimentacaoRepository,
        private TransactionManagerInterface $transactionManager
    ) {}

    public function executar(MovimentacaoInputDTO $input): void
    {
        $this->transactionManager->beginTransaction();

        try {
            $item = $this->itemRepository->buscarPorCodigo($input->itemCodigo);
            
            if (!$item) {
                throw new \InvalidArgumentException("Item não encontrado.");
            }

            $tipo = TipoMovimentacao::tryFrom($input->tipo);
            if (!$tipo) {
                throw new \InvalidArgumentException("Tipo de movimentação inválido.");
            }

            if ($tipo === TipoMovimentacao::SAIDA) {
                $item->removerEstoque($input->quantidade);
            } else {
                $item->adicionarEstoque($input->quantidade);
            }

            $this->itemRepository->salvar($item);

            $dataHora = new DateTimeImmutable($input->dataHora);
            
            $movimentacao = new Movimentacao(
                null,
                $item->getId(),
                $tipo,
                $input->quantidade,
                $input->tecnicoMatricula,
                $input->turno,
                $dataHora
            );

            $this->movimentacaoRepository->salvar($movimentacao);

            $this->transactionManager->commit();
        } catch (\Throwable $e) {
            $this->transactionManager->rollBack();
            throw $e;
        }
    }
}
