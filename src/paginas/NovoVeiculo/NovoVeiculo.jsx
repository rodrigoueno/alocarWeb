import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import style from "./NovoVeiculo.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VeiculoAPI from "../../services/veiculoAPI";

export function NovoVeiculo() {
  const navigate = useNavigate();
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [placa, setPlaca] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [anoModelo, setAnoModelo] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [tipo, setTipo] = useState("");

  const isFormValid = () => marca && modelo && cor && placa && anoFabricacao && anoModelo && quilometragem && tipo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        await VeiculoAPI.criarAsync(marca, modelo, cor, placa, anoFabricacao, anoModelo, quilometragem, tipo);
        navigate("/veiculos");
      } catch (error) {
        console.error("Erro ao criar veículo:", error);
      }
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  return (
    <Sidebar>
      <div className={style.pagina_conteudo}>
        <h3>Novo Veículo</h3>

        <form onSubmit={handleSubmit} className={style.formulario}>
          <div className={style.campo}>
            <label>Marca</label>
            <input
              type="text"
              placeholder="Digite a marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Modelo</label>
            <input
              type="text"
              placeholder="Digite o modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Cor</label>
            <input
              type="text"
              placeholder="Digite a cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Placa</label>
            <input
              type="text"
              placeholder="Digite a placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Ano de Fabricação</label>
            <input
              type="number"
              placeholder="Ex: 2020"
              value={anoFabricacao}
              onChange={(e) => setAnoFabricacao(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Ano do Modelo</label>
            <input
              type="number"
              placeholder="Ex: 2021"
              value={anoModelo}
              onChange={(e) => setAnoModelo(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Quilometragem</label>
            <input
              type="number"
              placeholder="Ex: 50000"
              value={quilometragem}
              onChange={(e) => setQuilometragem(e.target.value)}
              required
            />
          </div>

          <div className={style.campo}>
            <label>Tipo</label>
            <input
              type="text"
              placeholder="Ex: Carro, Moto, Caminhão"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />
          </div>

          <div className={style.acoes}>
            <button
              type="button"
              className={style.botao_cancelar}
              onClick={() => navigate("/veiculos")}
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
