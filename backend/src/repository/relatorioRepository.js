import connection from './connection.js';

export async function obterReceitaTotal() {
    const comando = `
        SELECT COALESCE(SUM(valor_total), 0) AS receitaTotal
        FROM reserva
        WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue');
    `;
    const [resultado] = await connection.query(comando);
    return resultado[0].receitaTotal || 0;
}

export async function obterCustoTotal() {
    const comando = `
        SELECT COALESCE(SUM(
            (SELECT SUM(quantidade) 
             FROM JSON_TABLE(
                 r.qtdReserva,
                 '$[*]' COLUMNS (
                     quantidade INT PATH '$.quantidade'
                 )
             ) AS jt
            ) * 4
        ), 0) AS custoTotal
        FROM reserva r
        WHERE r.status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue');
    `;
    const [resultado] = await connection.query(comando);
    return resultado[0].custoTotal || 0;
}


export async function obterLucroLiquido() {
    const receitaTotal = await obterReceitaTotal();
    const custoTotal = await obterCustoTotal();
    return receitaTotal - custoTotal;
}


export async function obterTotalPedidos() {
    const comando = `
        SELECT COALESCE(COUNT(*), 0) AS totalPedidos
        FROM reserva
        WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue');
    `;
    const [resultado] = await connection.query(comando);
    return resultado[0].totalPedidos || 0;
}


export async function obterVendasPorPeriodo() {
    const comando = `
        SELECT 
            DATE(data_entrega) AS periodo,
            COUNT(*) AS totalVendas,
            SUM(valor_total) AS receita
        FROM reserva
        WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue')
        GROUP BY DATE(data_entrega)
        ORDER BY periodo DESC
        LIMIT 7;
    `;
    const [resultado] = await connection.query(comando);
    return resultado;
}


export async function obterProdutosMaisVendidos() {
    const comando = `
        SELECT 
            p.nome AS produto,
            SUM(j.quantidade) AS quantidadeVendida
        FROM reserva r,
        JSON_TABLE(
            r.qtdReserva,
            '$[*]' COLUMNS (
                id INT PATH '$.id',
                quantidade INT PATH '$.quantidade'
            )
        ) AS j
        JOIN produto p ON p.idproduto = j.id
        WHERE r.status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue')
        GROUP BY p.nome
        ORDER BY quantidadeVendida DESC
        LIMIT 3;
    `;
    const [resultado] = await connection.query(comando);
    return resultado;
}

export async function obterTiposPagamento() {
    const comando = `
        SELECT 
            pagamento,
            COUNT(*) AS quantidade,
            COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reserva WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue')) AS porcentagem
        FROM reserva
        WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue')
        GROUP BY pagamento
        ORDER BY porcentagem DESC;
    `;
    const [resultado] = await connection.query(comando);
    return resultado;
}

export async function obterTotalProdutosVendidos() {
    const comando = `
        SELECT 
            SUM(j.quantidade) AS totalProdutosVendidos
        FROM reserva r,
        JSON_TABLE(
            r.qtdReserva,
            '$[*]' COLUMNS (
                id INT PATH '$.id',
                quantidade INT PATH '$.quantidade'
            )
        ) AS j
        WHERE r.status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue');
    `;
    const [resultado] = await connection.query(comando);
    return resultado[0].totalProdutosVendidos || 0;
}
export async function obterVendasDiarias() {
    const comando = `
        SELECT 
            DATE(data_entrega) AS data,
            COALESCE(COUNT(*), 0) AS totalVendas,
            COALESCE(SUM(valor_total), 0) AS receita
        FROM reserva
        WHERE status IN ('Confirmado', 'Preparando', 'Pronto', 'Entregue') AND data_entrega IS NOT NULL
        GROUP BY DATE(data_entrega)
        ORDER BY DATE(data_entrega) DESC
        LIMIT 7;
    `;
    const [resultado] = await connection.query(comando);
    return resultado;
}

export async function obterDadosRelatorio(dataInicio, dataFim) {
    const comando = `SELECT 
            r.idreserva AS id,
            DATE_FORMAT(r.data_entrega, '%d/%m/%Y') AS data,
            DATE_FORMAT(r.hora_entrega, '%H:%i') AS hora,
            c.nome AS cliente,
            c.email,
            c.telefone,
            r.valor_total,
            r.pagamento,
            r.status,
            r.qtdReserva AS produtos
        FROM reserva r
        LEFT JOIN cliente c ON r.idcliente_fk = c.idcliente
        WHERE DATE(r.data_entrega) BETWEEN ? AND ?
        ORDER BY r.data_entrega DESC;`;
    const [resultado] = await connection.query(comando, [dataInicio, dataFim]);
    return resultado;
}

export async function obterResumoRelatorio(dataInicio, dataFim) {
    const comando = `SELECT 
            COALESCE(COUNT(*), 0) AS totalPedidos,
            COALESCE(SUM(valor_total), 0) AS receitaTotal,
            COALESCE(AVG(valor_total), 0) AS ticketMedio,
            SUM(CASE WHEN status = 'Confirmado' THEN 1 ELSE 0 END) AS pedidosConfirmados,
            SUM(CASE WHEN status = 'Cancelado' THEN 1 ELSE 0 END) AS pedidosCancelados
        FROM reserva
        WHERE DATE(data_entrega) BETWEEN ? AND ?;`;
    const [resultado] = await connection.query(comando, [dataInicio, dataFim]);
    return resultado[0];
}
