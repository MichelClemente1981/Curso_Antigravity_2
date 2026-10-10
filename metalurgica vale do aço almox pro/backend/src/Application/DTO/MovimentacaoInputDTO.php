<?php

declare(strict_types=1);

namespace App\Application\DTO;

class MovimentacaoInputDTO
{
    public function __construct(
        public string $itemCodigo,
        public string $tipo,
        public int $quantidade,
        public ?string $tecnicoMatricula,
        public ?string $turno,
        public string $dataHora
    ) {}
}
