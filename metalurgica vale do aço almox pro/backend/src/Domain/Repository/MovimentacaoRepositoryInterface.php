<?php

declare(strict_types=1);

namespace App\Domain\Repository;

use App\Domain\Entity\Movimentacao;

interface MovimentacaoRepositoryInterface
{
    public function salvar(Movimentacao $movimentacao): void;
    /** @return Movimentacao[] */
    public function buscarPorFiltros(?string $tecnicoMatricula, ?string $turno): array;
}
