import style from "./Servicos.module.css";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import ServicoAPI from "../../services/ServicoAPI";

const SITUACOES = {
  1: "Agendado",
  2: "Em Andamento",
  3: "Concluído",
  4: "Cancelado",
};

function formatarData(valor) {
  if (!valor) return "—";
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatarMoeda(valor) {
  return Number(valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const handleClickDeletar = (servico) => {
    setServicoSelecionado(servico);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    try {
      await ServicoAPI.deletarAsync(servicoSelecionado.id);
      setServicos(servicos.filter((s) => s.id !== servicoSelecionado.id));
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
    } finally {
      handleFecharModal();
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setServicoSelecionado(null);
  };

  useEffect(() => {
    async function carregarServicos() {
      try {
        const lista = await ServicoAPI.listarAsync();
        setServicos(lista);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      }
    }
    carregarServicos();
  }, []);

  return (
    <Sidebar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h3>Serviços</h3>
            <Link to="/servico/novo" className={style.botao_novo}>
              + Novo Serviço
            </Link>
          </div>

          <div className={style.tabela_container}>
            <table className={style.tabela}>
              <thead className={style.tabela_cabecalho}>
                <tr>
                  <th>Cliente</th>
                  <th>Veículo</th>
                  <th>Agendamento</th>
                  <th>Situação</th>
                  <th>Valor Previsto</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tabela_corpo}>
                {servicos.map((servico) => (
                  <tr key={servico.id}>
                    <td>{servico.nomeCliente}</td>
                    <td>{servico.modeloVeiculo}</td>
                    <td>{formatarData(servico.dataAgendamento)}</td>
                    <td>
                      <span className={`${style.badge} ${style[`situacao_${servico.situacao}`]}`}>
                        {SITUACOES[servico.situacao] ?? "—"}
                      </span>
                    </td>
                    <td>{formatarMoeda(servico.valorPrevisto)}</td>
                    <td>
                      <Link
                        to="/servico/editar"
                        state={servico.id}
                        className={style.botao_editar}
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => handleClickDeletar(servico)}
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
                  Tem certeza que deseja deletar o serviço de{" "}
                  <strong>{servicoSelecionado?.nomeCliente}</strong>?
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
    </Sidebar>
  );
}
