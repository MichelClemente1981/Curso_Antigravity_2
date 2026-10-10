<?php

declare(strict_types=1);

namespace App\Domain\Enum;

enum TipoMovimentacao: string
{
    case SAIDA   = 'SAIDA';
    case ENTRADA = 'ENTRADA';
}
