<?php

declare(strict_types=1);

namespace App\Domain\Entity;

class Item
{
    public function __construct(
        private ?int $id,
        private string $codigo,
        private string $nome,
        private int $estoqueAtual,
        private int $estoqueMinimo
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodigo(): string
    {
        return $this->codigo;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getEstoqueAtual(): int
    {
        return $this->estoqueAtual;
    }

    public function getEstoqueMinimo(): int
    {
        return $this->estoqueMinimo;
    }

    public function adicionarEstoque(int $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new \InvalidArgumentException("Quantidade deve ser maior que zero.");
        }
        $this->estoqueAtual += $quantidade;
    }

    public function removerEstoque(int $quantidade): void
    {
        if ($quantidade <= 0) {
            throw new \InvalidArgumentException("Quantidade deve ser maior que zero.");
        }
        if ($this->estoqueAtual < $quantidade) {
            throw new \DomainException("Estoque insuficiente para a retirada.");
        }
        $this->estoqueAtual -= $quantidade;
    }
}
