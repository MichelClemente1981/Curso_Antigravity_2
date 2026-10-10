<?php

declare(strict_types=1);

namespace App\Application\UseCase;

use App\Domain\Repository\MovimentacaoRepositoryInterface;

class ConsultarHistoricoMovimentacoes
{
    public function __construct(private MovimentacaoRepositoryInterface $movimentacaoRepository) {}

    public function executar(?string $tecnicoMatricula = null, ?string $turno = null): array
    {
        $movimentacoes = $this->movimentacaoRepository->buscarPorFiltros($tecnicoMatricula, $turno);
        
        $resultado = [];
        foreach ($movimentacoes as $movimentacao) {
            $resultado[] = [
                'id' => $movimentacao->getId(),
                'item_id' => $movimentacao->getItemId(),
                'tipo' => $movimentacao->getTipo()->value,
                'quantidade' => $movimentacao->getQuantidade(),
                'tecnico_matricula' => $movimentacao->getTecnicoMatricula(),
                'turno' => $movimentacao->getTurno(),
                'data_hora' => $movimentacao->getDataHora()->format('Y-m-d\TH:i:sP')
            ];
        }
        
        return $resultado;
    }
}
