<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence;

use App\Domain\Entity\Movimentacao;
use App\Domain\Enum\TipoMovimentacao;
use App\Domain\Repository\MovimentacaoRepositoryInterface;
use PDO;

class MovimentacaoRepositoryPDO implements MovimentacaoRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function salvar(Movimentacao $movimentacao): void
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO movimentacoes (item_id, tipo, quantidade, tecnico_matricula, turno, data_hora) 
            VALUES (:item_id, :tipo, :quantidade, :tecnico_matricula, :turno, :data_hora)
        ");
        
        $stmt->execute([
            'item_id' => $movimentacao->getItemId(),
            'tipo' => $movimentacao->getTipo()->value,
            'quantidade' => $movimentacao->getQuantidade(),
            'tecnico_matricula' => $movimentacao->getTecnicoMatricula(),
            'turno' => $movimentacao->getTurno(),
            'data_hora' => $movimentacao->getDataHora()->format('Y-m-d H:i:s')
        ]);
    }

    public function buscarPorFiltros(?string $tecnicoMatricula, ?string $turno): array
    {
        $sql = "SELECT * FROM movimentacoes WHERE 1=1";
        $params = [];

        if ($tecnicoMatricula) {
            $sql .= " AND tecnico_matricula = :tecnico";
            $params['tecnico'] = $tecnicoMatricula;
        }

        if ($turno) {
            $sql .= " AND turno = :turno";
            $params['turno'] = $turno;
        }
        
        $sql .= " ORDER BY data_hora DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        $movimentacoes = [];
        while ($row = $stmt->fetch()) {
            $movimentacoes[] = new Movimentacao(
                (int) $row['id'],
                (int) $row['item_id'],
                TipoMovimentacao::from($row['tipo']),
                (int) $row['quantidade'],
                $row['tecnico_matricula'],
                $row['turno'],
                new \DateTimeImmutable($row['data_hora'])
            );
        }
        
        return $movimentacoes;
    }
}
