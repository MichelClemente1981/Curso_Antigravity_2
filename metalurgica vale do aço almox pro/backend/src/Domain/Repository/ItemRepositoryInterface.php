<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Item;

interface ItemRepositoryInterface
{
    public function buscarPorCodigo(string $codigo): ?Item;
    public function salvar(Item $item): void;
    /** @return Item[] */
    public function listarAbaixoEstoqueMinimo(): array;
}
