<?php

declare(strict_types=1);

namespace App\Domain\Entity;

use App\Domain\Enum\TipoMovimentacao;
use DateTimeImmutable;

class Movimentacao
{
    public function __construct(
        private ?int $id,
        private int $itemId,
        private TipoMovimentacao $tipo,
        private int $quantidade,
        private ?string $tecnicoMatricula,
        private ?string $turno,
        private DateTimeImmutable $dataHora
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getItemId(): int
    {
        return $this->itemId;
    }

    public function getTipo(): TipoMovimentacao
    {
        return $this->tipo;
    }

    public function getQuantidade(): int
    {
        return $this->quantidade;
    }

    public function getTecnicoMatricula(): ?string
    {
        return $this->tecnicoMatricula;
    }

    public function getTurno(): ?string
    {
        return $this->turno;
    }

    public function getDataHora(): DateTimeImmutable
    {
        return $this->dataHora;
    }
}
