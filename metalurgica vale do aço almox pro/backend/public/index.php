<?php

declare(strict_types=1);

use App\Application\UseCase\ConsultarHistoricoMovimentacoes;
use App\Application\UseCase\ConsultarSaldoItem;
use App\Application\UseCase\ListarItensAbaixoEstoqueMinimo;
use App\Application\UseCase\RegistrarMovimentacao;
use App\Infrastructure\Http\Controller\ItemController;
use App\Infrastructure\Http\Controller\MovimentacaoController;
use App\Infrastructure\Persistence\ItemRepositoryPDO;
use App\Infrastructure\Persistence\MovimentacaoRepositoryPDO;
use App\Infrastructure\Persistence\PDOConnection;

// Carrega variáveis do .env manualmente (sem biblioteca externa)
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
    }
}

require_once __DIR__ . '/../vendor/autoload.php';

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';

// Container de Dependências Manual (Inversão de Controle)
$pdoConnection = new PDOConnection();
$itemRepo = new ItemRepositoryPDO($pdoConnection->getPDO());
$movimentacaoRepo = new MovimentacaoRepositoryPDO($pdoConnection->getPDO());

$registrarMovimentacao = new RegistrarMovimentacao($itemRepo, $movimentacaoRepo, $pdoConnection);
$consultarHistorico = new ConsultarHistoricoMovimentacoes($movimentacaoRepo);
$movimentacaoController = new MovimentacaoController($registrarMovimentacao, $consultarHistorico);

$consultarSaldo = new ConsultarSaldoItem($itemRepo);
$listarAbaixoMinimo = new ListarItensAbaixoEstoqueMinimo($itemRepo);
$itemController = new ItemController($consultarSaldo, $listarAbaixoMinimo);

// Router simplificado
if ($method === 'POST' && $path === '/api/movimentacoes') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $movimentacaoController->registrar($input);
    exit;
}

if ($method === 'GET' && $path === '/api/movimentacoes/historico') {
    $movimentacaoController->listarHistorico($_GET);
    exit;
}

if ($method === 'GET' && preg_match('#^/api/itens/([^/]+)/saldo$#', $path, $matches)) {
    $itemController->consultarSaldo($matches[1]);
    exit;
}

if ($method === 'GET' && $path === '/api/itens/alertas-estoque') {
    $itemController->listarAlertaEstoque();
    exit;
}

http_response_code(404);
echo json_encode(['erro' => 'Rota não encontrada.']);
