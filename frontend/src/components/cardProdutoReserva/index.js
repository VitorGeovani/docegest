import React, { useState, useEffect } from "react";
import "./index.scss";

function ProdutoCard({ id, imagem, nomeProduto, quantidadeUsuario, preco, qtdEstoque, onExcluir, onAtualizarTotal, onAtualizarQuantidade }) {
  const [quantidade, setQuantidade] = useState(quantidadeUsuario);

  // Atualiza o total do produto no componente pai
  useEffect(() => {
    const totalProduto = parseFloat(preco) * quantidade;
    onAtualizarTotal(id, totalProduto); // Atualiza o total no componente pai
    onAtualizarQuantidade(id, quantidade); // Atualiza a quantidade no componente pai
  }, [quantidade, preco, id]); // Remova `onAtualizarTotal` do array de dependências

  // Função para aumentar a quantidade
  const aumentarQuantidade = () => {
    if (quantidade < qtdEstoque) {
      setQuantidade(quantidade + 1);
    } else {
      alert("Quantidade máxima atingida com base no estoque disponível!");
    }
  };

  // Função para diminuir a quantidade
  const diminuirQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  return (
    <div className="rectangle-1">
      <img className="img" src={imagem} alt={nomeProduto} title={nomeProduto} />

      <span className="nomeProduto">{nomeProduto}</span>

      <div className="rectangle-2">
        <button className="fluent-subtract-regular" onClick={diminuirQuantidade}></button>
        <span className="text-a">{quantidade}</span>
        <button className="mdi-plus" onClick={aumentarQuantidade}></button>
      </div>

      <div className="precoUnidade">
        <span className="r-dollar">R$</span>
        <span className="valorUnitario">{preco}</span>
        <span className="space-slash"> /</span>
        <span className="unit">un</span>
      </div>

      <div className="totalDaqueleProduto">
        <span className="r">R$</span>
        <span className="nbsp">{(parseFloat(preco) * quantidade).toFixed(2)}</span>
      </div>

      {/* Botão de excluir */}
      <button className="botao-excluir" onClick={() => onExcluir(id)}>
        Excluir
      </button>
    </div>
  );
}

export default ProdutoCard;