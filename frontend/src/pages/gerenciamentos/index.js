import React, { useEffect } from "react";
import "./index.scss";
import Logo from "../../components/logo";
import Logo2 from "../../components/logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Financas from "../../components/financas";
import Dashboard from "../../components/dashboard";
import Estoque from "../../components/estoque";
import Reservas from "../../components/reservasAndamentos";
import Ingredientes from "../../components/ingredientes";
import CustosReceitas from "../../components/custosReceitas";
import Categorias from "../../components/categorias";
import Relatorios from "../../components/relatorios";

export default function Login() {
  const [paginaAtual, setPaginaAtual] = useState("dashboard");
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem("authToken");
    const admin = localStorage.getItem("adminData");

    if (!token || !admin) {
      toast.error("Você precisa fazer login para acessar esta área");
      navigate("/login");
      return;
    }

    try {
      const adminParsed = JSON.parse(admin);
      setAdminData(adminParsed);
    } catch (error) {
      toast.error("Sessão inválida. Faça login novamente.");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminData");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  // Não renderizar nada até verificar autenticação
  if (!adminData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          fontSize: "24px",
          fontFamily: "Playfair Display, serif",
        }}
      >
        🔐 Verificando autenticação...
      </div>
    );
  }

  return (
    <div className="pagina-gerenciamento">
      <header>
        <div className="header-logo">
          <img
            src="/imgs/docegest-logo-nobg.png"
            alt="DoceGest"
          />
        </div>

        <nav className="navGerenciamentos">
          <a
            onClick={() => setPaginaAtual("dashboard")}
            className={paginaAtual === "dashboard" ? "active" : ""}
          >
            Dashboard
          </a>
          <a
            onClick={() => setPaginaAtual("categorias")}
            className={paginaAtual === "categorias" ? "active" : ""}
          >
            Categorias
          </a>
          <a
            onClick={() => setPaginaAtual("estoque")}
            className={paginaAtual === "estoque" ? "active" : ""}
          >
            Estoque
          </a>
          <a
            onClick={() => setPaginaAtual("ingredientes")}
            className={paginaAtual === "ingredientes" ? "active" : ""}
          >
            Ingredientes
          </a>
          <a
            onClick={() => setPaginaAtual("custos")}
            className={paginaAtual === "custos" ? "active" : ""}
          >
            Custos
          </a>
          <a
            onClick={() => setPaginaAtual("relatorios")}
            className={paginaAtual === "relatorios" ? "active" : ""}
          >
            Relatórios
          </a>
          <a
            onClick={() => setPaginaAtual("reservas")}
            className={paginaAtual === "reservas" ? "active" : ""}
          >
            Reservas
          </a>
        </nav>

        <div className="admin-info">
          <span className="admin-nome">👤 {adminData.nome}</span>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </header>

      <main>
        {paginaAtual === "dashboard" && <Dashboard />}
        {paginaAtual === "financas" && <Financas />}
        {paginaAtual === "categorias" && <Categorias />}
        {paginaAtual === "estoque" && <Estoque />}
        {paginaAtual === "ingredientes" && <Ingredientes />}
        {paginaAtual === "custos" && <CustosReceitas />}
        {paginaAtual === "relatorios" && <Relatorios />}
        {paginaAtual === "reservas" && <Reservas />}
      </main>

      {/* <footer>

                <div className="divLogo">

                    <img className="wmremove-transformed-4" src="imgs/logo_segredo_branca-removebg.png" />
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



            </footer> */}
    </div>
  );
}
