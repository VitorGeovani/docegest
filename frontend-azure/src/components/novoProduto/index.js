import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaImage, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./index.scss";

function NovoProduto({ fecharModal, onSucesso, produtoEditando = null }) {
  const [categorias, setCategorias] = useState([]);
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  
  const [produto, setProduto] = useState({
    nome: "",
    preco: "",
    quantidade: "0",
    id_categoria: "",
    descricao: "",
    disponivel: true
  });
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarCategorias();
    carregarIngredientes();
    
    if (produtoEditando) {
      setProduto({
        nome: produtoEditando.nome || "",
        preco: produtoEditando.preco || "",
        quantidade: produtoEditando.quantidade || "0",
        id_categoria: produtoEditando.id_categoria || "",
        descricao: produtoEditando.descricao || "",
        disponivel: produtoEditando.disponivel !== undefined ? produtoEditando.disponivel : true
      });
      
      if (produtoEditando.imagem) {
        setImagemAtual(produtoEditando.imagem);
        setPreviewImagem(`http://localhost:5000/storage/${produtoEditando.imagem}`);
      }

      // Carregar receita do produto
      if (produtoEditando.id) {
        carregarReceitaProduto(produtoEditando.id);
      }
    }
  }, [produtoEditando]);

  const carregarCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categorias/ativas");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast.error("Erro ao carregar categorias");
    }
  };

  const carregarIngredientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ingrediente/listar");
      setIngredientesDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error);
      toast.error("Erro ao carregar ingredientes");
    }
  };

  const carregarReceitaProduto = async (idproduto) => {
    try {
      const response = await axios.get(`http://localhost:5000/receita/${idproduto}`);
      const receita = response.data.map(item => ({
        idingrediente: item.idingrediente,
        nomeIngrediente: item.nomeIngrediente,
        quantidade: item.quantidade,
        unidadeMedida: item.unidadeMedida,
        custo: item.custo
      }));
      setIngredientesSelecionados(receita);
    } catch (error) {
      console.error("Erro ao carregar receita:", error);
    }
  };

  const adicionarIngrediente = () => {
    setIngredientesSelecionados([
      ...ingredientesSelecionados,
      {
        idingrediente: "",
        nomeIngrediente: "",
        quantidade: "",
        unidadeMedida: "kg",
        custo: 0
      }
    ]);
  };

  const removerIngrediente = (index) => {
    const novosIngredientes = ingredientesSelecionados.filter((_, i) => i !== index);
    setIngredientesSelecionados(novosIngredientes);
  };

  const atualizarIngrediente = (index, campo, valor) => {
    const novosIngredientes = [...ingredientesSelecionados];
    novosIngredientes[index][campo] = valor;

    // Se mudar o ingrediente, atualizar o nome e calcular custo
    if (campo === "idingrediente") {
      const ingrediente = ingredientesDisponiveis.find(
        (ing) => ing.id === parseInt(valor)
      );
      if (ingrediente) {
        novosIngredientes[index].nomeIngrediente = ingrediente.nome;
        novosIngredientes[index].unidadeMedida = ingrediente.unidadeMedida;
        
        // Calcular custo baseado na quantidade
        const quantidade = parseFloat(novosIngredientes[index].quantidade) || 0;
        const precoUnitario = parseFloat(ingrediente.precoUnitario) || 0;
        novosIngredientes[index].custo = (quantidade * precoUnitario).toFixed(2);
      }
    }

    // Se mudar a quantidade, recalcular custo
    if (campo === "quantidade") {
      const ingrediente = ingredientesDisponiveis.find(
        (ing) => ing.id === parseInt(novosIngredientes[index].idingrediente)
      );
      if (ingrediente) {
        const quantidade = parseFloat(valor) || 0;
        const precoUnitario = parseFloat(ingrediente.precoUnitario) || 0;
        novosIngredientes[index].custo = (quantidade * precoUnitario).toFixed(2);
      }
    }

    setIngredientesSelecionados(novosIngredientes);
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("A imagem deve ter no máximo 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.warning("Por favor, selecione uma imagem válida");
        return;
      }

      setImagem(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagem(null);
    setPreviewImagem(null);
    setImagemAtual(null); // Limpar também a imagem atual
  };

  const salvarReceita = async (idProduto) => {
    try {
      const ingredientesValidos = ingredientesSelecionados
        .filter((ing) => ing.idingrediente && ing.quantidade > 0)
        .map((ing) => ({
          idingrediente: parseInt(ing.idingrediente),
          quantidade: parseFloat(ing.quantidade),
          unidadeMedida: ing.unidadeMedida || 'kg',
          custo: parseFloat(ing.custo) || 0
        }));

      if (ingredientesValidos.length === 0) {
        return;
      }

      console.log('Enviando receita:', ingredientesValidos);

      await axios.post(`http://localhost:5000/receita/${idProduto}`, {
        ingredientes: ingredientesValidos
      });
      
      toast.success('Receita salva com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      console.error("Detalhes do erro:", error.response?.data);
      toast.warning("Produto salvo, mas houve erro ao salvar a receita");
      throw error; // Propagar erro para debug
    }
  };

  const darBaixaIngredientes = async (idProduto, quantidade) => {
    try {
      await axios.post(`http://localhost:5000/receita/${idProduto}/produzir`, {
        quantidade
      });
      toast.info(`Baixa de ${quantidade} unidade(s) realizada nos ingredientes`);
    } catch (error) {
      console.error("Erro ao dar baixa nos ingredientes:", error);
      toast.warning("Produto salvo, mas houve erro ao dar baixa nos ingredientes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!produto.nome.trim()) {
      toast.warning("Nome do produto é obrigatório");
      return;
    }

    if (!produto.preco || parseFloat(produto.preco) <= 0) {
      toast.warning("Preço deve ser maior que zero");
      return;
    }

    if (!produto.id_categoria || produto.id_categoria === "") {
      toast.warning("Selecione uma categoria");
      return;
    }

    setSalvando(true);

    try {
      const formData = new FormData();
      formData.append("nome", produto.nome.trim());
      formData.append("preco", parseFloat(produto.preco));
      formData.append("quantidade", parseInt(produto.quantidade) || 0);
      formData.append("idcategoria", produto.id_categoria);
      formData.append("descricao", produto.descricao.trim());
      formData.append("disponivel", produto.disponivel);

      // Se tiver uma nova imagem, enviar ela
      if (imagem) {
        formData.append("imagem", imagem);
      } 
      // Se for edição e não tiver nova imagem, mas tiver imagem atual, manter a atual
      else if (produtoEditando && imagemAtual) {
        formData.append("imagemAtual", imagemAtual);
      }

      if (produtoEditando) {
        const response = await axios.put(
          `http://localhost:5000/produto/${produtoEditando.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        
        // Salvar receita se houver ingredientes
        if (ingredientesSelecionados.length > 0) {
          await salvarReceita(produtoEditando.id);
          
          // Se aumentou a quantidade, dar baixa na diferença
          const quantidadeAnterior = produtoEditando.quantidade || 0;
          const quantidadeNova = parseInt(produto.quantidade) || 0;
          const diferenca = quantidadeNova - quantidadeAnterior;
          
          if (diferenca > 0) {
            await darBaixaIngredientes(produtoEditando.id, diferenca);
          }
        }
        
        toast.success("Produto atualizado com sucesso!");
      } else {
        const response = await axios.post("http://localhost:5000/produto/inserir", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        const idProduto = response.data.id;
        
        // Salvar receita se houver ingredientes
        if (ingredientesSelecionados.length > 0) {
          await salvarReceita(idProduto);
          
          // Dar baixa nos ingredientes automaticamente ao criar o produto
          const quantidadeProduzida = parseInt(produto.quantidade) || 1;
          await darBaixaIngredientes(idProduto, quantidadeProduzida);
        }
        
        toast.success("Produto cadastrado com sucesso!");
      }

      if (onSucesso) {
        onSucesso();
      }
      
      if (fecharModal) {
        fecharModal();
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error(error.response?.data?.erro || "Erro ao salvar produto");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-content-produto" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{produtoEditando ? "Editar Produto" : "Novo Produto"}</h2>
          <button className="btn-close" onClick={fecharModal}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="produto-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">
                Nome do Produto <span className="required">*</span>
              </label>
              <input
                type="text"
                id="nome"
                value={produto.nome}
                onChange={(e) => setProduto({ ...produto, nome: e.target.value })}
                placeholder="Ex: Sorvete de Chocolate"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco">
                Preço (R$) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="preco"
                step="0.01"
                min="0"
                value={produto.preco}
                onChange={(e) => setProduto({ ...produto, preco: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">
                Quantidade em Estoque
              </label>
              <input
                type="number"
                id="quantidade"
                min="0"
                value={produto.quantidade}
                onChange={(e) => setProduto({ ...produto, quantidade: e.target.value })}
                placeholder="0"
              />
          </div>
        </div>

          <div className="form-group">
            <label htmlFor="categoria">
              Categoria <span className="required">*</span>
            </label>
            <select
              id="categoria"
              value={produto.id_categoria}
              onChange={(e) => setProduto({ ...produto, id_categoria: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={produto.descricao}
              onChange={(e) => setProduto({ ...produto, descricao: e.target.value })}
              placeholder="Descrição opcional do produto..."
              rows="4"
            />
          </div>

          <div className="form-group image-upload-group">
            <label>Imagem do Produto</label>
            
            {previewImagem ? (
              <div className="image-preview">
                <img src={previewImagem} alt="Preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={removerImagem}
                  title="Remover imagem"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label htmlFor="imagem" className="image-upload-label">
                <FaImage />
                <span>Clique para selecionar uma imagem</span>
                <small>(Máximo 5MB - JPG, PNG, WEBP)</small>
              </label>
            )}
            
            <input
              type="file"
              id="imagem"
              accept="image/*"
              onChange={handleImagemChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={produto.disponivel}
                onChange={(e) =>
                  setProduto({ ...produto, disponivel: e.target.checked })
                }
              />
              Produto disponível para venda
            </label>
          </div>

          {/* Seção de Ingredientes da Receita */}
          <div className="receita-section">
            <div className="receita-header">
              <h3>📝 Receita do Produto (Ingredientes)</h3>
              <button
                type="button"
                className="btn-add-ingrediente"
                onClick={adicionarIngrediente}
              >
                <FaPlus /> Adicionar Ingrediente
              </button>
            </div>

            {ingredientesSelecionados.length === 0 ? (
              <p className="sem-ingredientes">
                Nenhum ingrediente adicionado. Clique em "Adicionar Ingrediente" para começar.
              </p>
            ) : (
              <div className="ingredientes-lista">
                {ingredientesSelecionados.map((ing, index) => (
                  <div key={index} className="ingrediente-item">
                    <div className="ingrediente-row">
                      <div className="form-group-inline">
                        <label>Ingrediente *</label>
                        <select
                          value={ing.idingrediente}
                          onChange={(e) =>
                            atualizarIngrediente(index, "idingrediente", e.target.value)
                          }
                          required
                        >
                          <option value="">Selecione...</option>
                          {ingredientesDisponiveis.map((ingrediente) => (
                            <option
                              key={ingrediente.id}
                              value={ingrediente.id}
                            >
                              {ingrediente.nome} ({ingrediente.unidadeMedida})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group-inline">
                        <label>Quantidade *</label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={ing.quantidade}
                          onChange={(e) =>
                            atualizarIngrediente(index, "quantidade", e.target.value)
                          }
                          placeholder="Ex: 0.5"
                          required
                        />
                      </div>

                      <div className="form-group-inline">
                        <label>Unidade</label>
                        <input
                          type="text"
                          value={ing.unidadeMedida}
                          readOnly
                          disabled
                        />
                      </div>

                      <div className="form-group-inline">
                        <label>Custo (R$)</label>
                        <input
                          type="text"
                          value={ing.custo || "0.00"}
                          readOnly
                          disabled
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-remove-ingrediente"
                        onClick={() => removerIngrediente(index)}
                        title="Remover ingrediente"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="custo-total">
                  <strong>Custo Total da Receita:</strong>
                  <span className="valor-total">
                    R${" "}
                    {ingredientesSelecionados
                      .reduce((acc, ing) => acc + parseFloat(ing.custo || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={fecharModal}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : produtoEditando ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NovoProduto;
