import pool from './connection.js';

// Cache para verificação de colunas (evita consultar a cada requisição)
let colunasNovasExistem = true; // Forçando true já que as colunas existem

// Verifica se as novas colunas existem no banco
async function verificarColunasNovas() {
    // Como executamos a migração, sempre retornar true
    return true;
    
    /* Código original comentado - manter para referência
    if (colunasNovasExistem !== null) {
        return colunasNovasExistem;
    }
    
    try {
        const query = `
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = 'segredodosabor'
            AND TABLE_NAME = 'reserva'
            AND COLUMN_NAME IN ('data_pedido', 'numero_pedido', 'data_atualizacao', 'historico_status');
        `;
        
        const [columns] = await pool.query(query);
        colunasNovasExistem = columns.length >= 2; // Pelo menos data_pedido e numero_pedido
        
        if (!colunasNovasExistem) {
            console.warn('⚠️ Algumas colunas não encontradas. Execute atualizar_sistema_pedidos.sql para funcionalidade completa.');
        }
        
        return colunasNovasExistem;
    } catch (error) {
        console.error('Erro ao verificar colunas:', error);
        colunasNovasExistem = false;
        return false;
    }
    */
}

export async function listarReservas() {
    const comando = `
      SELECT 
        idreserva AS id,
        data_entrega AS dataEntrega,
        hora_entrega AS horaEntrega,
        ponto_entrega AS pontoEntrega,
        valor_total AS valorTotal,
        status,
        pagamento,
        produtos,
        qtdReserva,
        idcliente_fk AS idCliente
      FROM reserva;
    `;
    
    let resp = await pool.query(comando);
    let registros = resp[0];
    
    // Parse de campos JSON em cada reserva
    registros = registros.map(reserva => {
        // Parse de produtos
        if (typeof reserva.produtos === 'string') {
            try {
                reserva.produtos = JSON.parse(reserva.produtos);
            } catch (e) {
                console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
                reserva.produtos = [];
            }
        }
        if (!Array.isArray(reserva.produtos)) {
            reserva.produtos = [];
        }
        
        // Parse de qtdReserva
        if (typeof reserva.qtdReserva === 'string') {
            try {
                reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
            } catch (e) {
                console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
                reserva.qtdReserva = [];
            }
        }
        if (!Array.isArray(reserva.qtdReserva)) {
            reserva.qtdReserva = [];
        }
        
        return reserva;
    });
    
    return registros;
}

export async function inserirReserva(reserva) {
    let comando = `
      INSERT INTO reserva (
        data_entrega, 
        hora_entrega, 
        ponto_entrega,
        valor_total, 
        status, 
        pagamento,
        produtos, 
        qtdReserva,
        idcliente_fk,
        endereco_entrega,
        observacoes,
        tipo_pedido
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
    let [info] = await pool.query(comando, [
      reserva.data,
      reserva.horario,
      reserva.pontoEntrega,
      reserva.totalGeral,
      reserva.status || 'Pendente',
      reserva.pagamento,
      JSON.stringify(reserva.produtos),
      JSON.stringify(reserva.produtosComQuantidade),
      reserva.clienteId,
      reserva.enderecoEntrega || reserva.pontoEntrega,
      reserva.observacoes || '',
      reserva.tipoPedido || 'ENTREGA'
    ]);
    return info.insertId;
}

export async function atualizarQuantidadeProdutos(produtos) {
  for (const produto of produtos) {
      const comando = `
          UPDATE produto
          SET quantidade = quantidade - ?
          WHERE idproduto = ? AND quantidade >= ?;
      `;

      const [info] = await pool.query(comando, [
          produto.quantidade, // Quantidade a ser subtraída
          produto.id,         // ID do produto
          produto.quantidade  // Verifica se há estoque suficiente
      ]);

      if (info.affectedRows === 0) {
          throw new Error(`Estoque insuficiente para o produto com ID ${produto.id}`);
      }
  }
}

export async function alterarReserva(id, reserva) {
    let comando = `
      UPDATE reserva 
      SET 
        data_entrega = ?, 
        hora_entrega = ?, 
        ponto_entrega = ?, 
        valor_total = ?, 
        status = ?, 
        pagamento = ?,
        produtos = ?, 
        idcliente_fk = ? 
      WHERE idreserva = ?;
    `;
    
    let [info] = await pool.query(comando, [
      reserva.dataEntrega,
      reserva.horaEntrega,
      reserva.pontoEntrega,
      reserva.valorTotal,
      reserva.status,
      reserva.pagamento,
      JSON.stringify(reserva.produtos), // Transformar o array de produtos em JSON
      reserva.clienteId,
      id
    ]);
    
    return info.affectedRows;
}

export async function removerReserva(id) {
    let comando = `
      DELETE FROM reserva 
      WHERE idreserva = ?;
    `;
    
    let [info] = await pool.query(comando, [id]);
    
    return info.affectedRows;
}


export async function listarReservasPendentes() {
  const temColunasNovas = await verificarColunasNovas();
  
  let comando;
  if (temColunasNovas) {
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 8, '0'))) AS numero,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status = 'Pendente'
          ORDER BY r.data_pedido DESC;
      `;
  } else {
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, CONCAT('PED', LPAD(r.idreserva, 8, '0'))) AS numero,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status = 'Pendente'
          ORDER BY r.data_entrega DESC;
      `;
  }
  
  let resp = await pool.query(comando);
  let registros = resp[0];
  
  // Parse dos campos JSON para garantir que sejam arrays
  registros = registros.map(reserva => {
    // Parse de produtos
    if (typeof reserva.produtos === 'string') {
      try {
        reserva.produtos = JSON.parse(reserva.produtos);
      } catch (e) {
        console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
        reserva.produtos = [];
      }
    }
    if (!Array.isArray(reserva.produtos)) {
      reserva.produtos = [];
    }
    
    // Parse de qtdReserva
    if (typeof reserva.qtdReserva === 'string') {
      try {
        reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
      } catch (e) {
        console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
        reserva.qtdReserva = [];
      }
    }
    if (!Array.isArray(reserva.qtdReserva)) {
      reserva.qtdReserva = [];
    }
    
    return reserva;
  });
  
  return registros;
}

export async function listarReservasPorStatus(status) {
  const temColunasNovas = await verificarColunasNovas();
  
  let comando;
  if (temColunasNovas) {
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 8, '0'))) AS numero,
              r.data_pedido AS dataPedido,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status = ?
          ORDER BY r.data_pedido DESC;
      `;
  } else {
      // Versão sem as novas colunas
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
              r.data_entrega AS dataPedido,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status = ?
          ORDER BY r.data_entrega DESC;
      `;
  }
  
  let resp = await pool.query(comando, [status]);
  let registros = resp[0];
  
  // Parse dos campos JSON para garantir que sejam arrays
  registros = registros.map(reserva => {
    // Parse de produtos
    if (typeof reserva.produtos === 'string') {
      try {
        reserva.produtos = JSON.parse(reserva.produtos);
      } catch (e) {
        console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
        reserva.produtos = [];
      }
    }
    if (!Array.isArray(reserva.produtos)) {
      reserva.produtos = [];
    }
    
    // Parse de qtdReserva
    if (typeof reserva.qtdReserva === 'string') {
      try {
        reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
      } catch (e) {
        console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
        reserva.qtdReserva = [];
      }
    }
    if (!Array.isArray(reserva.qtdReserva)) {
      reserva.qtdReserva = [];
    }
    
    return reserva;
  });
  
  return registros;
}

export async function listarTodasReservasComCliente() {
  const temColunasNovas = await verificarColunasNovas();
  
  let comando;
  if (temColunasNovas) {
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 8, '0'))) AS numero,
              r.data_pedido AS dataPedido,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status != 'Cancelado'
          ORDER BY r.data_pedido DESC;
      `;
  } else {
      comando = `
          SELECT 
              r.idreserva AS id,
              r.data_entrega AS dataEntrega,
              r.hora_entrega AS horaEntrega,
              r.ponto_entrega AS pontoEntrega,
              r.valor_total AS valorTotal,
              r.status,
              r.pagamento,
              r.produtos,
              r.qtdReserva,
              r.idcliente_fk AS idCliente,
              COALESCE(r.codigo_pedido, CONCAT('PED', LPAD(r.idreserva, 8, '0'))) AS numero,
              r.data_entrega AS dataPedido,
              r.tipo_pedido AS tipoPedido,
              r.endereco_entrega AS enderecoEntrega,
              r.observacoes,
              c.nome AS nomeCliente, 
              c.telefone AS telefoneCliente,
              c.email AS emailCliente
          FROM reserva r
          INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
          WHERE r.status != 'Cancelado'
          ORDER BY r.data_entrega DESC;
      `;
  }
  
  let resp = await pool.query(comando);
  let registros = resp[0];
  
  // Parse dos campos JSON para garantir que sejam arrays
  registros = registros.map(reserva => {
    // Parse de produtos
    if (typeof reserva.produtos === 'string') {
      try {
        reserva.produtos = JSON.parse(reserva.produtos);
      } catch (e) {
        console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
        reserva.produtos = [];
      }
    }
    if (!Array.isArray(reserva.produtos)) {
      reserva.produtos = [];
    }
    
    // Parse de qtdReserva
    if (typeof reserva.qtdReserva === 'string') {
      try {
        reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
      } catch (e) {
        console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
        reserva.qtdReserva = [];
      }
    }
    if (!Array.isArray(reserva.qtdReserva)) {
      reserva.qtdReserva = [];
    }
    
    return reserva;
  });
  
  return registros;
}

export async function confirmarReserva(id) {
  const comando = `
      UPDATE reserva
      SET status = 'Confirmado'
      WHERE idreserva = ? AND status = 'Pendente';
  `;

  const [info] = await pool.query(comando, [id]);
  return info.affectedRows; // Retorna o número de linhas afetadas
}


export async function cancelarReserva(id, produtos) {
  try {
      // Inicia uma transação
      await connection.beginTransaction();

      // Atualiza o status da reserva para "Cancelado"
      const comandoReserva = `
          UPDATE reserva
          SET status = 'Cancelado'
          WHERE idreserva = ? AND status = 'Pendente';
      `;
      const [infoReserva] = await pool.query(comandoReserva, [id]);

      if (infoReserva.affectedRows === 0) {
          throw new Error(`Reserva com ID ${id} não encontrada ou já foi processada.`);
      }

      // Devolve os produtos ao estoque
      for (const produto of produtos) {
          const comandoProduto = `
              UPDATE produto
              SET quantidade = quantidade + ?
              WHERE idproduto = ?;
          `;
          await pool.query(comandoProduto, [produto.quantidadeReservados, produto.id]);
      }

      // Confirma a transação
      await connection.commit();
      return true;
  } catch (err) {
      // Reverte a transação em caso de erro
      await connection.rollback();
      throw err;
  }
}

// Buscar reserva por ID
export async function buscarReservaPorId(id) {
    const comando = `
        SELECT 
            r.idreserva AS id,
            r.data_entrega AS dataEntrega,
            r.hora_entrega AS horaEntrega,
            r.ponto_entrega AS pontoEntrega,
            r.valor_total AS valorTotal,
            r.status,
            r.pagamento,
            r.produtos,
            r.qtdReserva,
            r.idcliente_fk AS idCliente,
            c.nome AS nomeCliente, 
            c.telefone AS telefoneCliente,
            c.email AS emailCliente,
            r.endereco_entrega AS enderecoEntrega,
            r.observacoes
        FROM reserva r
        INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
        WHERE r.idreserva = ?;
    `;
    
    const [registros] = await pool.query(comando, [id]);
    let reserva = registros[0];
    
    // Parse de campos JSON se a reserva existir
    if (reserva) {
        // Parse de produtos
        if (typeof reserva.produtos === 'string') {
            try {
                reserva.produtos = JSON.parse(reserva.produtos);
            } catch (e) {
                console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
                reserva.produtos = [];
            }
        }
        if (!Array.isArray(reserva.produtos)) {
            reserva.produtos = [];
        }
        
        // Parse de qtdReserva
        if (typeof reserva.qtdReserva === 'string') {
            try {
                reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
            } catch (e) {
                console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
                reserva.qtdReserva = [];
            }
        }
        if (!Array.isArray(reserva.qtdReserva)) {
            reserva.qtdReserva = [];
        }
    }
    
    return reserva;
}

// Atualizar status do pedido
export async function atualizarStatusPedido(id, novoStatus) {
    const temColunasNovas = await verificarColunasNovas();
    
    let comando;
    let params;
    
    if (temColunasNovas) {
        // Versão completa com histórico e data_atualizacao
        comando = `
            UPDATE reserva
            SET status = ?,
                data_atualizacao = CURRENT_TIMESTAMP,
                historico_status = JSON_ARRAY_APPEND(
                    COALESCE(historico_status, JSON_ARRAY()),
                    '$',
                    JSON_OBJECT(
                        'status', ?,
                        'data', NOW(),
                        'observacao', CONCAT('Status alterado para ', ?)
                    )
                )
            WHERE idreserva = ?;
        `;
        params = [novoStatus, novoStatus, novoStatus, id];
    } else {
        // Versão simplificada apenas com status
        comando = `
            UPDATE reserva
            SET status = ?
            WHERE idreserva = ?;
        `;
        params = [novoStatus, id];
    }
    
    const [info] = await pool.query(comando, params);
    return info.affectedRows;
}

// Buscar pedidos por telefone do cliente
export async function buscarPedidosPorTelefone(telefone) {
    const temColunasNovas = await verificarColunasNovas();
    
    let comando;
    if (temColunasNovas) {
        comando = `
            SELECT 
                r.idreserva AS id,
                COALESCE(r.codigo_pedido, r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
                COALESCE(r.data_pedido, r.data_entrega) AS dataPedido,
                r.data_entrega AS dataEntrega,
                r.hora_entrega AS horaEntrega,
                r.ponto_entrega AS pontoEntrega,
                r.valor_total AS valorTotal,
                r.status,
                r.pagamento,
                r.produtos,
                r.qtdReserva,
                r.endereco_entrega AS enderecoEntrega,
                r.observacoes,
                r.historico_status AS historicoStatus,
                c.nome AS nomeCliente,
                c.telefone AS telefoneCliente,
                c.email AS emailCliente
            FROM reserva r
            INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE c.telefone = ?
            ORDER BY r.data_pedido DESC, r.idreserva DESC;
        `;
    } else {
        comando = `
            SELECT 
                r.idreserva AS id,
                COALESCE(r.codigo_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
                r.data_entrega AS dataPedido,
                r.data_entrega AS dataEntrega,
                r.hora_entrega AS horaEntrega,
                r.ponto_entrega AS pontoEntrega,
                r.valor_total AS valorTotal,
                r.status,
                r.pagamento,
                r.produtos,
                r.qtdReserva,
                r.endereco_entrega AS enderecoEntrega,
                r.observacoes,
                NULL AS historicoStatus,
                c.nome AS nomeCliente,
                c.telefone AS telefoneCliente,
                c.email AS emailCliente
            FROM reserva r
            INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE c.telefone = ?
            ORDER BY r.data_entrega DESC, r.idreserva DESC;
        `;
    }
    
    const [registros] = await pool.query(comando, [telefone]);
    
    // Parse de campos JSON em cada reserva
    let reservas = registros.map(reserva => {
        // Parse de produtos
        if (typeof reserva.produtos === 'string') {
            try {
                reserva.produtos = JSON.parse(reserva.produtos);
            } catch (e) {
                console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
                reserva.produtos = [];
            }
        }
        if (!Array.isArray(reserva.produtos)) {
            reserva.produtos = [];
        }
        
        // Parse de qtdReserva
        if (typeof reserva.qtdReserva === 'string') {
            try {
                reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
            } catch (e) {
                console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
                reserva.qtdReserva = [];
            }
        }
        if (!Array.isArray(reserva.qtdReserva)) {
            reserva.qtdReserva = [];
        }
        
        // Parse de historicoStatus se existir
        if (reserva.historicoStatus && typeof reserva.historicoStatus === 'string') {
            try {
                reserva.historicoStatus = JSON.parse(reserva.historicoStatus);
            } catch (e) {
                console.error('Erro ao parsear historicoStatus da reserva ' + reserva.id + ':', e);
                reserva.historicoStatus = [];
            }
        }
        
        return reserva;
    });
    
    return reservas;
}

// Buscar detalhes completos de um pedido
export async function buscarDetalhePedidoCompleto(id) {
    const temColunasNovas = await verificarColunasNovas();
    
    let comando;
    if (temColunasNovas) {
        comando = `
            SELECT 
                r.idreserva AS id,
                COALESCE(r.codigo_pedido, r.numero_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
                COALESCE(r.data_pedido, r.data_entrega) AS dataPedido,
                r.data_atualizacao AS dataAtualizacao,
                r.data_entrega AS dataEntrega,
                r.hora_entrega AS horaEntrega,
                r.ponto_entrega AS pontoEntrega,
                r.valor_total AS valorTotal,
                r.status,
                r.pagamento,
                r.produtos,
                r.qtdReserva,
                r.endereco_entrega AS enderecoEntrega,
                r.observacoes,
                r.historico_status AS historicoStatus,
                c.idcliente AS idCliente,
                c.nome AS nomeCliente,
                c.telefone AS telefoneCliente,
                c.email AS emailCliente
            FROM reserva r
            INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE r.idreserva = ?;
        `;
    } else {
        comando = `
            SELECT 
                r.idreserva AS id,
                COALESCE(r.codigo_pedido, CONCAT('PED', LPAD(r.idreserva, 6, '0'))) AS numero,
                r.data_entrega AS dataPedido,
                NULL AS dataAtualizacao,
                r.data_entrega AS dataEntrega,
                r.hora_entrega AS horaEntrega,
                r.ponto_entrega AS pontoEntrega,
                r.valor_total AS valorTotal,
                r.status,
                r.pagamento,
                r.produtos,
                r.qtdReserva,
                r.endereco_entrega AS enderecoEntrega,
                r.observacoes,
                NULL AS historicoStatus,
                c.idcliente AS idCliente,
                c.nome AS nomeCliente,
                c.telefone AS telefoneCliente,
                c.email AS emailCliente
            FROM reserva r
            INNER JOIN cliente c ON r.idcliente_fk = c.idcliente
            WHERE r.idreserva = ?;
        `;
    }
    
    const [registros] = await pool.query(comando, [id]);
    let reserva = registros[0];
    
    // Parse de campos JSON se a reserva existir
    if (reserva) {
        // Parse de produtos
        if (typeof reserva.produtos === 'string') {
            try {
                reserva.produtos = JSON.parse(reserva.produtos);
            } catch (e) {
                console.error('Erro ao parsear produtos da reserva ' + reserva.id + ':', e);
                reserva.produtos = [];
            }
        }
        if (!Array.isArray(reserva.produtos)) {
            reserva.produtos = [];
        }
        
        // Parse de qtdReserva
        if (typeof reserva.qtdReserva === 'string') {
            try {
                reserva.qtdReserva = JSON.parse(reserva.qtdReserva);
            } catch (e) {
                console.error('Erro ao parsear qtdReserva da reserva ' + reserva.id + ':', e);
                reserva.qtdReserva = [];
            }
        }
        if (!Array.isArray(reserva.qtdReserva)) {
            reserva.qtdReserva = [];
        }
        
        // Parse de historicoStatus se existir
        if (reserva.historicoStatus && typeof reserva.historicoStatus === 'string') {
            try {
                reserva.historicoStatus = JSON.parse(reserva.historicoStatus);
            } catch (e) {
                console.error('Erro ao parsear historicoStatus da reserva ' + reserva.id + ':', e);
                reserva.historicoStatus = [];
            }
        }
    }
    
    return reserva;
}

/**
 * RF049: Buscar dados do cliente de uma reserva
 * @param {number} idReserva - ID da reserva
 * @returns {Promise<Object>} Dados do cliente
 */
export async function buscarClientePorReserva(idReserva) {
    const comando = `
        SELECT 
            c.idcliente AS id,
            c.nome,
            c.telefone,
            c.email
        FROM cliente c
        INNER JOIN reserva r ON r.idcliente_fk = c.idcliente
        WHERE r.idreserva = ?;
    `;
    
    const [registros] = await pool.query(comando, [idReserva]);
    return registros[0];
}

/**
 * RF049: Registrar reenvio de confirmação no histórico
 * @param {number} idReserva - ID da reserva
 */
export async function registrarReenvioConfirmacao(idReserva) {
    const temColunasNovas = await verificarColunasNovas();
    
    if (temColunasNovas) {
        const comando = `
            UPDATE reserva
            SET historico_status = JSON_ARRAY_APPEND(
                    COALESCE(historico_status, JSON_ARRAY()),
                    '$',
                    JSON_OBJECT(
                        'status', 'confirmacao_reenviada',
                        'data', NOW(),
                        'observacao', 'Confirmação reenviada ao cliente'
                    )
                )
            WHERE idreserva = ?;
        `;
        await pool.query(comando, [idReserva]);
    }
}
