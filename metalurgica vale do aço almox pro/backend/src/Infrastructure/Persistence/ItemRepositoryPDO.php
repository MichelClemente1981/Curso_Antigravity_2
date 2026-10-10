<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Item;
use App\Domain\Repository\ItemRepositoryInterface;
use PDO;

class ItemRepositoryPDO implements ItemRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function buscarPorCodigo(string $codigo): ?Item
    {
        $stmt = $this->pdo->prepare("SELECT * FROM itens WHERE codigo = :codigo LIMIT 1");
        $stmt->execute(['codigo' => $codigo]);
        $row = $stmt->fetch();

        if (!$row) {
            return null;
        }

        return new Item(
            (int) $row['id'],
            $row['codigo'],
            $row['nome'],
            (int) $row['estoque_atual'],
            (int) $row['estoque_minimo']
        );
    }

    public function salvar(Item $item): void
    {
        if ($item->getId() === null) {
            $stmt = $this->pdo->prepare("
                INSERT INTO itens (codigo, nome, estoque_atual, estoque_minimo) 
                VALUES (:codigo, :nome, :estoque, :minimo)
            ");
            $stmt->execute([
                'codigo' => $item->getCodigo(),
                'nome' => $item->getNome(),
                'estoque' => $item->getEstoqueAtual(),
                'minimo' => $item->getEstoqueMinimo()
            ]);
        } else {
            $stmt = $this->pdo->prepare("
                UPDATE itens 
                SET estoque_atual = :estoque, nome = :nome, estoque_minimo = :minimo 
                WHERE id = :id
            ");
            $stmt->execute([
                'estoque' => $item->getEstoqueAtual(),
                'nome' => $item->getNome(),
                'minimo' => $item->getEstoqueMinimo(),
                'id' => $item->getId()
            ]);
        }
    }

    public function listarAbaixoEstoqueMinimo(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM itens WHERE estoque_atual <= estoque_minimo");
        $itens = [];
        while ($row = $stmt->fetch()) {
            $itens[] = new Item(
                (int) $row['id'],
                $row['codigo'],
                $row['nome'],
                (int) $row['estoque_atual'],
                (int) $row['estoque_minimo']
            );
        }
        return $itens;
    }
}
