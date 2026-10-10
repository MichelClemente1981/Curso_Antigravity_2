<?php

declare(strict_types=1);

namespace App\Infrastructure\Http\Controller;

use App\Application\DTO\MovimentacaoInputDTO;
use App\Application\UseCase\ConsultarHistoricoMovimentacoes;
use App\Application\UseCase\RegistrarMovimentacao;

class MovimentacaoController
{
    public function __construct(
        private RegistrarMovimentacao $registrarMovimentacaoUseCase,
        private ConsultarHistoricoMovimentacoes $consultarHistoricoUseCase
    ) {}

    public function registrar(array $requestData): void
    {
        try {
            $this->validarEntrada($requestData);
            
            $dto = new MovimentacaoInputDTO(
                $requestData['item_codigo'],
                $requestData['tipo'],
                (int) $requestData['quantidade'],
                $requestData['tecnico_matricula'] ?? null,
                $requestData['turno'] ?? null,
                $requestData['data_hora'] ?? (new \DateTimeImmutable())->format('c')
            );

            $this->registrarMovimentacaoUseCase->executar($dto);

            http_response_code(201);
            echo json_encode(['mensagem' => 'Movimentação registrada com sucesso.']);
        } catch (\DomainException $e) {
            http_response_code(422);
            echo json_encode(['erro' => $e->getMessage()]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(404);
            echo json_encode(['erro' => $e->getMessage()]);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno no servidor.']);
        }
    }

    public function listarHistorico(array $queryParams): void
    {
        try {
            $tecnico = $queryParams['tecnico_matricula'] ?? null;
            $turno = $queryParams['turno'] ?? null;
            
            $resultado = $this->consultarHistoricoUseCase->executar($tecnico, $turno);
            
            http_response_code(200);
            echo json_encode($resultado);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno no servidor.']);
        }
    }

    private function validarEntrada(array $data): void
    {
        if (empty($data['item_codigo']) || empty($data['tipo']) || empty($data['quantidade'])) {
            throw new \InvalidArgumentException("Campos obrigatórios ausentes: item_codigo, tipo, quantidade.");
        }
        
        if (!is_numeric($data['quantidade']) || $data['quantidade'] <= 0) {
            throw new \InvalidArgumentException("A quantidade deve ser um número maior que zero.");
        }
    }
}
