<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller;

use App\Application\UseCase\ConsultarSaldoItem;
use App\Application\UseCase\ListarItensAbaixoEstoqueMinimo;

class ItemController
{
    public function __construct(
        private ConsultarSaldoItem $consultarSaldoUseCase,
        private ListarItensAbaixoEstoqueMinimo $listarAbaixoMinimoUseCase
    ) {}

    public function consultarSaldo(string $codigo): void
    {
        try {
            $resultado = $this->consultarSaldoUseCase->executar($codigo);
            
            http_response_code(200);
            echo json_encode($resultado);
        } catch (\InvalidArgumentException $e) {
            http_response_code(404);
            echo json_encode(['erro' => $e->getMessage()]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno no servidor.']);
        }
    }

    public function listarAlertaEstoque(): void
    {
        try {
            $resultado = $this->listarAbaixoMinimoUseCase->executar();
            
            http_response_code(200);
            echo json_encode($resultado);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno no servidor.']);
        }
    }
}
