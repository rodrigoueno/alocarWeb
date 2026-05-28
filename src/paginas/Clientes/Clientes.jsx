import style from "./Clientes.module.css";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import ClienteAPI from "../../services/clienteAPI";

export function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const handleClickDeletar = (cliente) => {
    setClienteSelecionado(cliente);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    try {
      await ClienteAPI.deletarAsync(clienteSelecionado.id);
      setClientes(clientes.filter((c) => c.id !== clienteSelecionado.id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    } finally {
      handleFecharModal();
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setClienteSelecionado(null);
  };

  async function carregarClientes() {
    try {
      const lista = await ClienteAPI.listarAsync(true);
      setClientes(lista);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h3>Clientes</h3>
            <Link to="/cliente/novo" className={style.botao_novo}>
              + Novo
            </Link>
          </div>

          <div className={style.tabela_container}>
            <table className={style.tabela}>
              <thead className={style.tabela_cabecalho}>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tabela_corpo}>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.cpf}</td>
                    <td>
                      <Link
                        to="/cliente/editar"
                        state={cliente.id}
                        className={style.botao_editar}
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => handleClickDeletar(cliente)}
                        className={style.botao_deletar}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className={style.modal_overlay}>
              <div className={style.modal}>
                <div className={style.modal_header}>
                  <h5>Confirmar exclusão</h5>
                </div>
                <div className={style.modal_body}>
                  Tem certeza que deseja deletar o cliente{" "}
                  <strong>{clienteSelecionado?.nome}</strong>?
                </div>
                <div className={style.modal_footer}>
                  <button className={style.botao_cancelar} onClick={handleFecharModal}>
                    Cancelar
                  </button>
                  <button className={style.botao_confirmar} onClick={handleDeletar}>
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Topbar>
    </Sidebar>
  );
}
