import style from "./Veiculos.module.css";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import VeiculoAPI from "../../services/veiculoAPI";

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

  const handleClickDeletar = (veiculo) => {
    setVeiculoSelecionado(veiculo);
    setMostrarModal(true);
  };

  const handleDeletar = async () => {
    try {
      await VeiculoAPI.deletarAsync(veiculoSelecionado.id);
      setVeiculos(veiculos.filter((v) => v.id !== veiculoSelecionado.id));
    } catch (error) {
      console.error("Erro ao deletar veiculo:", error);
    } finally {
      handleFecharModal();
    }
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setVeiculoSelecionado(null);
  };

  async function carregarVeiculos() {
    try {
      const lista = await VeiculoAPI.listarAsync(true);
      setVeiculos(lista);
    } catch (error) {
      console.error("Erro ao carregar veiculos:", error);
    }
  }

  useEffect(() => {
    carregarVeiculos();
  }, []);

  return (
    <Sidebar>
        <div className={style.pagina_conteudo}>
          <div className={style.pagina_cabecalho}>
            <h3>Veículos</h3>
            <Link to="/veiculo/novo" className={style.botao_novo}>
              + Cadastrar Veículo
            </Link>
          </div>

          <div className={style.tabela_container}>
            <table className={style.tabela}>
              <thead className={style.tabela_cabecalho}>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Cor</th>
                  <th>Placa</th>
                  <th>Km</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tabela_corpo}>
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td>{veiculo.marca}</td>
                    <td>{veiculo.modelo}</td>
                    <td>{veiculo.cor}</td>
                    <td>{veiculo.placa}</td>
                    <td>{veiculo.quilometragem}</td>
                    <td>
                      <Link
                        to="/veiculo/editar"
                        state={veiculo.id}
                        className={style.botao_editar}
                      >
                        <MdEdit />
                      </Link>
                      <button
                        onClick={() => handleClickDeletar(veiculo)}
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
                  Tem certeza que deseja deletar o veículo{" "}
                  <strong>{veiculoSelecionado?.marca} {veiculoSelecionado?.modelo}</strong>?
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
