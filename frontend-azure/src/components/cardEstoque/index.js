import React, { useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import './index.scss';

function CardEstoque({ produto, atualizar, editar, deletar }) {
    const { id, caminhoImagem, nome, descricao, quantidade, preco } = produto;
    const [estaEditando, setEstaEditando] = useState(false);
    const [produtoEditado, setProdutoEditado] = useState({ nome, descricao, quantidade, preco, imagem: caminhoImagem });
    
    const aoClicarEditar = () => {
        if (editar) {
            editar();
        } else {
            setEstaEditando(true);
        }
    };

    const aoAlterarInput = (e) => {
        const { name, value, files } = e.target;

        if (name === "imagem") {
            setProdutoEditado((produtoAnterior) => ({
                ...produtoAnterior,
                imagem: files[0], // Atualiza o arquivo da imagem
            }));
        } else {
            setProdutoEditado((produtoAnterior) => ({
                ...produtoAnterior,
                [name]: value, // Atualiza os outros campos
            }));
        }
    };

    const aoClicarSalvar = async () => {
        try {
            const formData = new FormData();
            formData.append("nome", produtoEditado.nome);
            formData.append("descricao", produtoEditado.descricao);
            formData.append("quantidade", produtoEditado.quantidade);
            formData.append("preco", produtoEditado.preco);
    
            // Verifica se uma nova imagem foi selecionada
            if (produtoEditado.imagem instanceof File) {
                formData.append("imagem", produtoEditado.imagem); // Adiciona a nova imagem ao FormData
            } else {
                formData.append("caminhoImagem", produtoEditado.imagem); // Adiciona o caminho da imagem existente
            }
    
            // Exibe o conteúdo do FormData no console para debug
            for (let pair of formData.entries()) {
                console.log(pair[0] + ':', pair[1]);
            }
    
            await axios.put(`http://localhost:5000/produto/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            const produtoAtualizado = await axios.get(`http://localhost:5000/produto/${id}`);
            console.log("Produto atualizado com sucesso!", produtoAtualizado.data);
            if (atualizar) atualizar(produtoAtualizado.data);
            setEstaEditando(false);
        } catch (erro) {
            console.error("Erro ao atualizar o produto:", erro);
        }
    };

    const aoClicarCancelar = () => {
        setProdutoEditado({ nome, descricao, quantidade, preco, imagem: caminhoImagem });
        setEstaEditando(false);
    };

    const aoClicarDeletar = async () => {
        console.log("Tentando deletar o produto com ID:", id);
        try {
            await axios.delete(`http://localhost:5000/produto/${id}`);
            console.log("Produto deletado com sucesso!");
            if (deletar) deletar(id);
        } catch (erro) {
            console.error("Erro ao deletar o produto:", erro);
        }
    };

    return (
        <div className="cardEstoque">
            <div className="flex-row-e">
                {estaEditando ? (
                    <>
                        <div className="formAtualizado">
                            <div className="custom-file-input-card">
                                <input
                                    type="file"
                                    name="imagem"
                                    onChange={aoAlterarInput}
                                />
                            </div>
                            <input
                                type="text"
                                name="nome"
                                className="inputNomeCard"
                                value={produtoEditado.nome}
                                onChange={aoAlterarInput}
                            />
                            <input
                                type="text"
                                name="descricao"
                                className="inputDescricaoCard"
                                value={produtoEditado.descricao}
                                onChange={aoAlterarInput}
                            />
                            <input
                                type="number"
                                name="quantidade"
                                className="inputQtdCard"
                                min={0}
                                value={produtoEditado.quantidade}
                                onChange={aoAlterarInput}
                            />
                            <input
                                type="text"
                                name="preco"
                                className="inputPrecoCard"
                                value={produtoEditado.preco}
                                onChange={aoAlterarInput}
                            />
                            <div className="botoesCard">
                                <button className="btnAdicionarProdutoCard" onClick={aoClicarSalvar}>Salvar</button>
                                <button className="btnCancelarProdutoCard" onClick={aoClicarCancelar}>Cancelar</button>
                                <button className="btnDeletarProdutoCard" onClick={aoClicarDeletar}>Deletar</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>

                        
                        <img 
                            className="img" 
                            src={`http://localhost:5000/storage/${caminhoImagem}`} 
                            alt={nome}
                            title={`${nome} - ${descricao}`}
                        />
                        <span className="nomeProduto">{nome}</span>
                        <span className="descricao">{descricao}</span>
                        <span className="quantidade">{quantidade} un</span>
                        <div className="div-rs-un">
                            <span className="span-rs">R$</span>
                            <span className="span-12-00">{preco}</span>
                            <span className="span-slash"> /</span>
                            <span className="span-un-6">un</span>
                        </div>
                        <div className="botoesAcao">
                            <div className="divEditar" onClick={aoClicarEditar}>
                                <div className="div-icon-park-edit" />
                                <span className="span-editar">Editar</span>
                            </div>
                            <div className="divExcluir" onClick={aoClicarDeletar}>
                                <FaTrashAlt className="icon-trash" />
                                <span className="span-excluir">Excluir</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CardEstoque;