const fs = require('fs');

const file = 'src/repository/reservaRepository.js';

console.log('📝 Corrigindo reservaRepository.js...');

let content = fs.readFileSync(file, 'utf8');

// Substituir connection.query por pool.query (exceto em transações)
content = content.replace(/await connection\.query/g, 'await pool.query');
content = content.replace(/await connection\.execute/g, 'await pool.execute');

// Corrigir a função cancelarReserva para usar conexão individual
const oldCancelarReserva = `export async function cancelarReserva(id, produtos) {
  try {
      // Inicia uma transação
      await pool.beginTransaction();

      // Atualiza o status da reserva para "Cancelado"
      const comandoReserva = \`
          UPDATE reserva
          SET status = 'Cancelado'
          WHERE idreserva = ? AND status = 'Pendente';
      \`;
      const [infoReserva] = await pool.query(comandoReserva, [id]);

      if (infoReserva.affectedRows === 0) {
          throw new Error(\`Reserva com ID \${id} não encontrada ou já foi processada.\`);
      }

      // Devolve os produtos ao estoque
      for (const produto of produtos) {
          const comandoProduto = \`
              UPDATE produto
              SET quantidade = quantidade + ?
              WHERE idproduto = ?;
          \`;
          await pool.query(comandoProduto, [produto.quantidadeReservados, produto.id]);
      }

      // Confirma a transação
      await pool.commit();
      return true;
  } catch (err) {
      // Reverte a transação em caso de erro
      await pool.rollback();
      throw err;
  }
}`;

const newCancelarReserva = `export async function cancelarReserva(id, produtos) {
  const connection = await pool.getConnection();
  try {
      // Inicia uma transação
      await connection.beginTransaction();

      // Atualiza o status da reserva para "Cancelado"
      const comandoReserva = \`
          UPDATE reserva
          SET status = 'Cancelado'
          WHERE idreserva = ? AND status = 'Pendente';
      \`;
      const [infoReserva] = await connection.query(comandoReserva, [id]);

      if (infoReserva.affectedRows === 0) {
          throw new Error(\`Reserva com ID \${id} não encontrada ou já foi processada.\`);
      }

      // Devolve os produtos ao estoque
      for (const produto of produtos) {
          const comandoProduto = \`
              UPDATE produto
              SET quantidade = quantidade + ?
              WHERE idproduto = ?;
          \`;
          await connection.query(comandoProduto, [produto.quantidadeReservados, produto.id]);
      }

      // Confirma a transação
      await connection.commit();
      return true;
  } catch (err) {
      // Reverte a transação em caso de erro
      await connection.rollback();
      throw err;
  } finally {
      connection.release();
  }
}`;

content = content.replace(oldCancelarReserva, newCancelarReserva);

fs.writeFileSync(file, content);

console.log('✅ Arquivo corrigido com sucesso!');
console.log('   - Substituído connection por pool em queries simples');
console.log('   - Corrigido função cancelarReserva com transação');
