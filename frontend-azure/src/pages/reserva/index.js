import React from "react";
import "./index.scss";
import { Link } from 'react-router-dom'
import Logo from '../../components/logo'
import ProdutoCard from "../../components/cardProdutoReserva";
import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function Reserva({ produtosReservados, excluirProduto }) {
  const [totaisProdutos, setTotaisProdutos] = useState({});
  const [pontoEntrega, setPontoEntrega] = useState("P - Alimentação 1");
  const [pagamento, setPagamento] = useState("Crédito");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [turno, setTurno] = useState("manha");
  const [status, setStatus] = useState("Pendente");
  const [produtos, setProduto] = useState({ produtosReservados });
  const navigate = useNavigate(); // Inicializa o hook useNavigate
  const [quantidadesUnitario, setQuantidadesUnitarios] = useState({});
  const [produtosComQuantidade, setProdutosComQuantidade] = useState({});


  const atualizarQuantidadeProduto = (id, quantidade) => {
    setQuantidadesUnitarios((prevQuantidades) => {
      const novoEstado = {
        ...prevQuantidades,
        [id]: quantidade, // Atualiza a quantidade do produto pelo ID
      };

      // Transforma o estado no formato desejado
      const produtosAtualizados = Object.entries(novoEstado).map(([id, quantidade]) => ({
        id: parseInt(id, 10), // Converte o ID para número inteiro
        quantidade,
      }));

      console.log("Estado atualizado:", novoEstado);
      console.log("Produtos com quantidade:", produtosAtualizados);

      // Atualiza o estado de produtosComQuantidade
      setProdutosComQuantidade(produtosAtualizados);

      return novoEstado;
    });
  };

  const excluirProdutoLocal = (id) => {
    // Chama a função global para atualizar a lista de produtos reservados
    excluirProduto(id);

    // Remove o total do produto excluído do estado 'totaisProdutos'
    setTotaisProdutos((prevTotais) => {
      const novosTotais = { ...prevTotais };
      delete novosTotais[id]; // Remove o total do produto pelo ID
      return novosTotais;
    });
  };


  // Atualiza o total de um produto específico (usando useCallback)
  const atualizarTotalProduto = useCallback((id, total) => {
    setTotaisProdutos((prevTotais) => ({
      ...prevTotais,
      [id]: total,
    }));
  }, []);

  // Calcula o total geral
  const totalGeral = Object.values(totaisProdutos).reduce((acc, total) => acc + total, 0);

  const validarCampos = () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !data.trim() || !horario.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios antes de finalizar a reserva.");
      return false; // Campos inválidos
    }
    return true; // Campos válidos
  };


  const finalizarReserva = async () => {

    const cliente = { nome, email, telefone };
    const reserva = { data, horario, pontoEntrega,turno, totalGeral, status, pagamento, produtos, produtosComQuantidade };
    console.log("produtos com quantidade", produtosComQuantidade);
    try {
      // Verifica se o cliente já está cadastrado ou cadastra
      const clienteResponse = await axios.post(`http://localhost:5015/cliente/verificar`, cliente);

      let clienteId;

      if (!clienteResponse.data) {
        throw new Error("Erro ao verificar/cadastrar cliente.");
      }

      clienteId = clienteResponse.data.id;

      // Cria a reserva com o ID do cliente
      const reservaResponse = await axios.post('http://localhost:5015/reserva/inserir', {
        ...reserva,
        clienteId, // Use a variável clienteId diretamente
      });

      if (!reservaResponse.data) {
        throw new Error('Erro ao criar reserva.');
      }

      alert('Reserva criada com sucesso!');

      // Redireciona para a página de reserva finalizada
      navigate('/reservaFinalizada');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const manipularFinalizacaoReserva = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão do botão/link

    if (validarCampos()) {
      // Se os campos forem válidos, chama a função finalizarReserva
      await finalizarReserva();
    }
  };

  return (
    <div className="pagina-reserva">
      <header>
        <Logo />
      </header>

      <main>

        <span className="minha-reserva">Minha Reserva</span>
        <span className="produtos-escolhidos">Produtos Escolhidos</span>


        <div className="rectangle0">
          <span className="imagem">imagem </span>
          <span className="produto">Produto </span>
          <span className="quantidade">Quantidade</span>
          <span className="preco">Preço</span>
          <span className="total">Total</span>
        </div>

        {produtosReservados.map((produto, index) => (
          console.log("produtosReservados"),
          console.log(produto),
          <ProdutoCard
            key={index}
            id={produto.id}
            imagem={`http://localhost:5015/storage/${produto.caminhoImagem}`}
            nomeProduto={produto.nome}
            quantidadeUsuario={1}
            preco={produto.preco}
            qtdEstoque={produto.quantidade}
            onExcluir={excluirProdutoLocal}
            onAtualizarTotal={atualizarTotalProduto}
            onAtualizarQuantidade={atualizarQuantidadeProduto}
          />
        ))}

        <div className="rectangle-5">

          <div className="flex-row-a">

            <div className="conjunto" >
              <div className="delivery-truck-speed-outline" />
              <span className="entrega">Entrega</span>
            </div>

            <div className="conjunto" >
              <div className="mdi-calendar" />
              <span className="data">Data</span>
            </div>

            <div className="conjunto" >
              <div className="tabler-sun-moon" />
              <span className="periodo">Período</span>
            </div>
            <div className="conjunto" >
              <div className="tabler-clock-hour" />
              <span className="horario">Horário</span>
            </div>
            <div className="conjunto" >
              <div className="group" />
              <span className="pagamento">Pagamento</span>
            </div>

          </div>


          <div className="flex-row-e">

            <select
              className="select-alimentacao"
              value={pontoEntrega}
              onChange={(e) => setPontoEntrega(e.target.value)}
            >
              <option value="P - Alimentação 1">P - Alimentação 1</option>
              <option value="P - Alimentação 2">P - Alimentação 2</option>
              <option value="P - Alimentação 3">P - Alimentação 3</option>
            </select>

            <input
              type="date"
              className="input-data"
              value={data} // Vincula o estado 'data' ao input
              onChange={(e) => setData(e.target.value)} // Atualiza o estado 'data' ao digitar
            />


            <select className="select-turno"
              value={turno}
              onChange={(e) => setTurno(e.target.value)} // Atualiza o estado 'turno' ao selecionar
            >
              <option className="manha" value="Manha">Manhã</option>
              <option className="manha" value="Tarde">Tarde</option>
              <option className="manha" value="Noite">Noite</option>
            </select>

            <input
              type="time"
              className="input-horario"
              value={horario} // Vincula o estado 'horario' ao input
              onChange={(e) => setHorario(e.target.value)} // Atualiza o estado 'horario' ao digitar
            />

            <select
              className="select-pagamento"
              value={pagamento}
              onChange={(e) => setPagamento(e.target.value)}
            >
              <option value="Crédito">Crédito</option>
              <option value="Débito">Débito</option>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Vale Alimentação">Vale Alimentação</option>
            </select>


          </div>
        </div>


        <div className="rectangle-d">
          <div className="flex-row-ff">

            <div className="conjunto-2" >
              <div className="edit-name-e" />
              <span className="name">Nome </span>
            </div>

            <div className="conjunto-2" >
              <div className="edit-name" />
              <span className="email">E-mail</span>
            </div>

            <div className="conjunto-2" >
              <div className="whatsapp" />
              <span className="phone">Telefone</span>
            </div>

          </div>

          <div className="flex-row-ee">

            <input
              type="text"
              className="input-nome"
              placeholder="Nome"
              value={nome} // Vincula o estado 'nome' ao input
              onChange={(e) => setNome(e.target.value)} // Atualiza o estado 'nome' ao digitar
            />
            <input
              type="text"
              className="input-ddd"
              placeholder="E-mail"
              value={email} // Vincula o estado 'email' ao input
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado 'email' ao digitar
            />
            <input
              type="text"
              className="input-numero"
              placeholder="Número"
              maxLength="11"
              value={telefone} // Vincula o estado 'telefone' ao input
              onChange={(e) => setTelefone(e.target.value)} // Atualiza o estado 'telefone' ao digitar
            />


          </div>
        </div>


        <div className="rectangle-13">
          <div className="flex-row-e-14">
            <div className="shopping-bag-heart" />
            <span className="resumo-da-reserva">Resumo da reserva: </span>
          </div>
          <div className="flex-row-db">
            <span className="pagamento-no-credito">{pagamento} </span>
            <span className="p-alimentacao-15">{pontoEntrega}</span>
            <span className="total-r">{totalGeral.toFixed(2)}</span>
          </div>
        </div>


        <button onClick={manipularFinalizacaoReserva} className="rectangle-16">
          <span className="finalizar-reserva">Finalizar Reserva</span>
        </button>

      </main>

      <footer>

        <div className="divLogo">

          <img className="wmremove-transformed-4" src="imgs/wmremove-transformed (1).png" />
          <span className="avenida-engenheiro-stevaux">
            Avenida Engenheiro Eusébio Stevaux, 600 - Santo Amaro, 04696-000
          </span>
          <span className="telefones">Telefones: (11) 99766 - 1964</span>

        </div>


        <div className="divLinks">

          <span className="links">Links</span>
          <span className="nossa-marca">Nossa Marca</span>
          <span className="produtos">Produtos</span>
          <span className="contato-6">Contato</span>

        </div>


        <div className="divContatos">
          <span className="contato">Contato</span>

          <div className="flex-row-whats">
            <div className="ic-sharp-whatsapp" />
            <span className="phone-number">(11) 99766 - 1964</span>
          </div>

          <div className="flex-row-face">
            <div className="ic-baseline-facebook" />
            <span className="segredo-sabor-confeitaria">
              @segredosabor.confeitaria
            </span>
          </div>


          <div className="flex-row-insta">

            <div className="mdi-instagram" />
            <span className="segredo-sabor-confeitaria-5">
              @segredosabor.confeitaria
            </span>

          </div>

        </div>



      </footer>


    </div>
  );
}
