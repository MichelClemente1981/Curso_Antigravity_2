<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\ItemRepositoryInterface;

class ListarItensAbaixoEstoqueMinimo
{
    public function __construct(private ItemRepositoryInterface $itemRepository) {}

    public function executar(): array
    {
        $itens = $this->itemRepository->listarAbaixoEstoqueMinimo();
        
        $resultado = [];
        foreach ($itens as $item) {
            $resultado[] = [
                'codigo' => $item->getCodigo(),
                'nome' => $item->getNome(),
                'estoque_atual' => $item->getEstoqueAtual(),
                'estoque_minimo' => $item->getEstoqueMinimo()
            ];
        }
        
        return $resultado;
    }
}
