# Modelagem de Banco Relacional

Este repositório contém a modelagem e o script de criação de um banco de dados relacional para um sistema de gestão.

## Diagrama Entidade-Relacionamento

Abaixo está o diagrama ER (Entidade-Relacionamento) criado com Mermaid, representando as tabelas, colunas, chaves primárias/estrangeiras e os relacionamentos do schema definido em `schema.sql`.

```mermaid
erDiagram
    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR full_name
        user_role role
        BOOLEAN is_active
        JSONB preferences
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    categories {
        BIGINT id PK
        VARCHAR name UK
        TEXT description
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    products {
        UUID id PK
        BIGINT category_id FK
        VARCHAR sku UK
        VARCHAR name
        TEXT description
        NUMERIC price
        INTEGER stock_quantity
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    orders {
        UUID id PK
        UUID user_id FK
        order_status status
        NUMERIC total_amount
        JSONB shipping_address
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    order_items {
        BIGINT id PK
        UUID order_id FK
        UUID product_id FK
        INTEGER quantity
        NUMERIC unit_price
        TIMESTAMPTZ created_at
    }
    
    users ||--o{ orders : "faz"
    categories ||--o{ products : "possui"
    orders ||--|{ order_items : "contém"
    products ||--o{ order_items : "é adicionado em"
```
