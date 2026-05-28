import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./NovoCliente.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ClienteAPI from "../../services/clienteAPI";

export function NovoCliente() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const isFormValid = () => nome && email && telefone && cpf;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        await ClienteAPI.criarAsync(nome, email, telefone, cpf);
        navigate("/clientes");
      } catch (error) {
        console.error("Erro ao criar cliente:", error);
      }
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <Sidebar>
        <div className={style.pagina_conteudo}>
          <h3>Novo Cliente</h3>

          <form onSubmit={handleSubmit} className={style.formulario}>
            <div className={style.campo}>
              <label>Nome</label>
              <input
                type="text"
                placeholder="Digite o nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className={style.campo}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={style.campo}>
              <label>Telefone</label>
              <input
                type="text"
                placeholder="Digite o telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className={style.campo}>
              <label>CPF</label>
              <input
                type="text"
                placeholder="Digite o CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className={style.acoes}>
              <button
                type="button"
                className={style.botao_cancelar}
                onClick={() => navigate("/clientes")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={style.botao_salvar}
                disabled={!isFormValid()}
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
     </Sidebar>
  );
}
