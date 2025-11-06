import connection from './connection.js'


export async function listar() {
    const comando = `
      SELECT 
        idcliente AS id,
        nome AS nome,
        email AS email,
        telefone AS telefone
      FROM cliente;
    `;
    
    let resp = await connection.query(comando);
    let registros = resp[0];
    
    return registros;
  }


  export async function inserir(cliente) {
    let comando = `
      INSERT INTO cliente (nome, email, telefone) 
      VALUES (?, ?, ?);
    `;
    let [info] = await connection.query(comando, [cliente.nome, cliente.email, cliente.telefone]);
    return info.insertId;
  }
 
  export async function alterar(id, cliente) {
    let comando = `
      UPDATE cliente 
      SET nome = ?, email = ?, telefone = ? 
      WHERE idcliente = ?;
    `;
    let [info] = await connection.query(comando, [cliente.nome, cliente.email, cliente.telefone, id]);
    return info.affectedRows;
  }
 
  export async function remover(id) {
    let comando = `
      DELETE FROM cliente 
      WHERE idcliente = ?;
    `;
    let [info] = await connection.query(comando, [id]);
    return info.affectedRows;
  }

  export async function buscarPorEmailTelefone(email, telefone) {
      const comando = `
        SELECT 
          idcliente AS id, 
          nome, 
          email, 
          telefone 
        FROM cliente 
        WHERE email = ? OR telefone = ?;
      `;
      
      let resp = await connection.query(comando, [email, telefone]);
      let registros = resp[0];
      
      return registros.length ? registros[0] : null;
  }
  
  export async function inserirCliente(nome, email, telefone) {
      const comando = `
        INSERT INTO cliente (nome, email, telefone) 
        VALUES (?, ?, ?);
      `;
      
      let resp = await connection.query(comando, [nome, email, telefone]);
      return resp[0].insertId;
  }