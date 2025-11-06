import connection from './connection.js';

/**
 * Adiciona ingredientes à receita de um produto
 */
export async function adicionarIngredientesReceita(idproduto, ingredientes) {
    try {
        await connection.beginTransaction();

        // Remover ingredientes antigos da receita (se houver)
        await connection.query(`
            DELETE FROM produto_ingrediente 
            WHERE idproduto = ?
        `, [idproduto]);

        // Inserir novos ingredientes
        for (const ing of ingredientes) {
            await connection.query(`
                INSERT INTO produto_ingrediente (
                    idproduto, 
                    idingrediente, 
                    quantidade, 
                    unidade_medida,
                    custo
                ) VALUES (?, ?, ?, ?, ?)
            `, [
                idproduto,
                ing.idingrediente,
                ing.quantidade,
                ing.unidadeMedida,
                ing.custo || 0
            ]);
        }

        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}

/**
 * Lista ingredientes de uma receita de produto
 */
export async function listarIngredientesReceita(idproduto) {
    const comando = `
        SELECT 
            pi.idproduto_ingrediente AS id,
            pi.idproduto,
            pi.idingrediente,
            i.nome AS nomeIngrediente,
            pi.quantidade,
            pi.unidade_medida AS unidadeMedida,
            pi.custo,
            i.preco_unitario AS precoUnitario,
            i.quantidade_estoque AS quantidadeEstoque
        FROM produto_ingrediente pi
        INNER JOIN ingrediente i ON pi.idingrediente = i.idingrediente
        WHERE pi.idproduto = ?
        ORDER BY i.nome;
    `;

    const [registros] = await connection.query(comando, [idproduto]);
    return registros;
}

/**
 * Dar baixa no estoque de ingredientes ao produzir um produto
 */
export async function darBaixaIngredientes(idproduto, quantidadeProduzida = 1) {
    try {
        await connection.beginTransaction();

        // Buscar ingredientes da receita
        const [ingredientes] = await connection.query(`
            SELECT 
                pi.idingrediente,
                pi.quantidade,
                i.nome AS nomeIngrediente,
                i.quantidade_estoque AS quantidadeEstoque
            FROM produto_ingrediente pi
            INNER JOIN ingrediente i ON pi.idingrediente = i.idingrediente
            WHERE pi.idproduto = ?
        `, [idproduto]);

        if (ingredientes.length === 0) {
            await connection.rollback();
            return {
                sucesso: false,
                mensagem: 'Este produto não possui receita cadastrada'
            };
        }

        // Verificar se há estoque suficiente
        const faltaEstoque = [];
        for (const ing of ingredientes) {
            const quantidadeNecessaria = parseFloat(ing.quantidade) * quantidadeProduzida;
            const estoqueAtual = parseFloat(ing.quantidadeEstoque || 0);
            
            if (estoqueAtual < quantidadeNecessaria) {
                faltaEstoque.push({
                    nome: ing.nomeIngrediente,
                    necessario: quantidadeNecessaria,
                    disponivel: estoqueAtual,
                    faltando: quantidadeNecessaria - estoqueAtual
                });
            }
        }

        if (faltaEstoque.length > 0) {
            await connection.rollback();
            return {
                sucesso: false,
                mensagem: 'Estoque insuficiente de ingredientes',
                faltaEstoque
            };
        }

        // Dar baixa no estoque de cada ingrediente
        for (const ing of ingredientes) {
            const quantidadeNecessaria = parseFloat(ing.quantidade) * quantidadeProduzida;
            
            await connection.query(`
                UPDATE ingrediente 
                SET quantidade_estoque = quantidade_estoque - ?
                WHERE idingrediente = ?
            `, [quantidadeNecessaria, ing.idingrediente]);
        }

        await connection.commit();
        return {
            sucesso: true,
            mensagem: 'Baixa realizada com sucesso',
            ingredientesAtualizados: ingredientes.length
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}

/**
 * Calcular custo de produção de um produto
 */
export async function calcularCustoProducao(idproduto) {
    const comando = `
        SELECT 
            COALESCE(SUM(pi.quantidade * i.preco_unitario), 0) AS custoTotal
        FROM produto_ingrediente pi
        INNER JOIN ingrediente i ON pi.idingrediente = i.idingrediente
        WHERE pi.idproduto = ?
    `;

    const [resultado] = await connection.query(comando, [idproduto]);
    return parseFloat(resultado[0].custoTotal || 0);
}

/**
 * Verificar se há estoque suficiente de ingredientes
 */
export async function verificarEstoqueIngredientes(idproduto, quantidadeProduzir = 1) {
    const comando = `
        SELECT 
            i.nome AS nomeIngrediente,
            pi.quantidade AS quantidadeNecessaria,
            i.quantidade_estoque AS quantidadeEstoque,
            (pi.quantidade * ?) AS quantidadeTotal,
            CASE 
                WHEN i.quantidade_estoque >= (pi.quantidade * ?) THEN 'OK'
                ELSE 'INSUFICIENTE'
            END AS status
        FROM produto_ingrediente pi
        INNER JOIN ingrediente i ON pi.idingrediente = i.idingrediente
        WHERE pi.idproduto = ?
    `;

    const [registros] = await connection.query(comando, [
        quantidadeProduzir,
        quantidadeProduzir,
        idproduto
    ]);

    const temEstoque = registros.every(r => r.status === 'OK');
    
    return {
        temEstoque,
        ingredientes: registros
    };
}

export default {
    adicionarIngredientesReceita,
    listarIngredientesReceita,
    darBaixaIngredientes,
    calcularCustoProducao,
    verificarEstoqueIngredientes
};
