import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import "./index.scss";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState({
    id: null,
    nome: "",
    descricao: "",
    ativo: true
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/categorias");
      setCategorias(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast.error("Erro ao carregar categorias");
      setLoading(false);
    }
  };

  const abrirModal = (categoria = null) => {
    if (categoria) {
      setCategoriaAtual(categoria);
      setEditando(true);
    } else {
      setCategoriaAtual({
        id: null,
        nome: "",
        descricao: "",
        ativo: true
      });
      setEditando(false);
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCategoriaAtual({
      id: null,
      nome: "",
      descricao: "",
      ativo: true
    });
    setEditando(false);
  };

  const salvarCategoria = async (e) => {
    e.preventDefault();

    if (!categoriaAtual.nome.trim()) {
      toast.warning("Nome da categoria é obrigatório");
      return;
    }

    try {
      if (editando) {
        await axios.put(
          `http://localhost:5000/categorias/${categoriaAtual.id}`,
          categoriaAtual
        );
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await axios.post("http://localhost:5000/categorias", categoriaAtual);
        toast.success("Categoria criada com sucesso!");
      }
      fecharModal();
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria");
    }
  };

  const excluirCategoria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/categorias/${id}`);
      toast.success("Categoria excluída com sucesso!");
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      toast.error("Erro ao excluir categoria. Verifique se não há produtos vinculados.");
    }
  };

  const alternarStatus = async (categoria) => {
    try {
      await axios.put(`http://localhost:5000/categorias/${categoria.id}`, {
        ...categoria,
        ativo: !categoria.ativo
      });
      toast.success(`Categoria ${categoria.ativo ? 'desativada' : 'ativada'} com sucesso!`);
      carregarCategorias();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status da categoria");
    }
  };

  if (loading) {
    return (
      <div className="categorias-loading">
        <div className="spinner"></div>
        <p>Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <h1>
          <FaTag /> Gerenciar Categorias
        </h1>
        <button className="btn-add" onClick={() => abrirModal()}>
          <FaPlus /> Nova Categoria
        </button>
      </div>

      <div className="categorias-grid">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className={`categoria-card ${!categoria.ativo ? 'inativa' : ''}`}
          >
            <div className="categoria-header">
              <h3>{categoria.nome}</h3>
              <span className={`status-badge ${categoria.ativo ? 'ativo' : 'inativo'}`}>
                {categoria.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {categoria.descricao && (
              <p className="categoria-descricao">{categoria.descricao}</p>
            )}

            <div className="categoria-actions">
              <button
                className="btn-edit"
                onClick={() => abrirModal(categoria)}
                title="Editar"
              >
                <FaEdit />
              </button>
              <button
                className="btn-toggle"
                onClick={() => alternarStatus(categoria)}
                title={categoria.ativo ? 'Desativar' : 'Ativar'}
              >
                {categoria.ativo ? '🔴' : '🟢'}
              </button>
              <button
                className="btn-delete"
                onClick={() => excluirCategoria(categoria.id)}
                title="Excluir"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="empty-state">
            <FaTag />
            <p>Nenhuma categoria cadastrada</p>
            <button onClick={() => abrirModal()}>Criar primeira categoria</button>
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button className="btn-close" onClick={fecharModal}>
                ×
              </button>
            </div>

            <form onSubmit={salvarCategoria}>
              <div className="form-group">
                <label htmlFor="nome">
                  Nome da Categoria <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  value={categoriaAtual.nome}
                  onChange={(e) =>
                    setCategoriaAtual({ ...categoriaAtual, nome: e.target.value })
                  }
                  placeholder="Ex: Sorvetes, Milk-shakes, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={categoriaAtual.descricao}
                  onChange={(e) =>
                    setCategoriaAtual({ ...categoriaAtual, descricao: e.target.value })
                  }
                  placeholder="Descrição opcional da categoria"
                  rows="3"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={categoriaAtual.ativo}
                    onChange={(e) =>
                      setCategoriaAtual({ ...categoriaAtual, ativo: e.target.checked })
                    }
                  />
                  Categoria ativa
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editando ? 'Atualizar' : 'Criar'} Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;
