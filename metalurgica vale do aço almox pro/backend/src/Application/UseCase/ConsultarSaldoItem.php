<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ItemRepositoryInterface;

class ConsultarSaldoItem
{
    public function __construct(private ItemRepositoryInterface $itemRepository) {}

    public function executar(string $codigo): array
    {
        $item = $this->itemRepository->buscarPorCodigo($codigo);
        
        if (!$item) {
            throw new \InvalidArgumentException("Item não encontrado.");
        }

        return [
            'codigo' => $item->getCodigo(),
            'nome' => $item->getNome(),
            'estoque_atual' => $item->getEstoqueAtual(),
            'estoque_minimo' => $item->getEstoqueMinimo(),
            'status' => $item->getEstoqueAtual() <= $item->getEstoqueMinimo() ? 'alerta' : 'ok'
        ];
    }
}
