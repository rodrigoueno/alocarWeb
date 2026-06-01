import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./NovoServico.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ServicoAPI from "../../services/ServicoAPI";
import ClienteAPI from "../../services/clienteAPI";
import VeiculoAPI from "../../services/VeiculoAPI";

const TIPOS_SERVICO = [
  { value: 1,  label: "Revisão Geral" },
  { value: 2,  label: "Troca de Óleo" },
  { value: 3,  label: "Troca Filtro de Óleo" },
  { value: 4,  label: "Troca Filtro de Combustível" },
  { value: 5,  label: "Troca Filtro de Ar" },
  { value: 6,  label: "Troca Líquido Arrefecimento" },
  { value: 7,  label: "Troca Líquido Freio" },
  { value: 8,  label: "Troca Pastilhas de Freio" },
  { value: 9,  label: "Troca Lona de Freio" },
  { value: 10, label: "Troca Pneus" },
  { value: 11, label: "Alinhamento" },
  { value: 12, label: "Balanceamento" },
  { value: 13, label: "Troca Velas" },
  { value: 14, label: "Troca Cabo de Velas" },
  { value: 15, label: "Troca Correia" },
  { value: 16, label: "Troca Bateria" },
  { value: 17, label: "Diagnóstico Scan" },
  { value: 18, label: "Troca de Embreagem" },
  { value: 19, label: "Reparo Sistema Elétrico" },
  { value: 20, label: "Revisão Sistema de Ar Condicionado" },
  { value: 21, label: "Troca Amortecedores" },
  { value: 22, label: "Checkup Pré-Viagem" },
  { value: 23, label: "Outros Serviços" },
];

export function NovoServico() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [quilometragem, setQuilometragem] = useState("");
  const [observacao, setObservacao] = useState("");

  const [itens, setItens] = useState(
    TIPOS_SERVICO.map((t) => ({ tipoServico: t.value, label: t.label, selecionado: false, valor: "" }))
  );

  // Carrega clientes ativos
  useEffect(() => {
    ClienteAPI.listarAsync(true)
      .then(setClientes)
      .catch((err) => console.error("Erro ao carregar clientes:", err));
  }, []);

  // Carrega veículos do cliente selecionado
  useEffect(() => {
    if (!clienteId) {
      setVeiculos([]);
      setVeiculoId("");
      return;
    }
    VeiculoAPI.listarPorClienteAsync(Number(clienteId))
      .then(setVeiculos)
      .catch((err) => console.error("Erro ao carregar veículos:", err));
    setVeiculoId("");
  }, [clienteId]);

  const toggleItem = (index) => {
    setItens((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, selecionado: !item.selecionado, valor: !item.selecionado ? item.valor : "" }
          : item
      )
    );
  };

  const setValorItem = (index, valor) => {
    setItens((prev) =>
      prev.map((item, i) => (i === index ? { ...item, valor } : item))
    );
  };

  const itensSelecionados = itens.filter((i) => i.selecionado);

  const isFormValid = () =>
    clienteId &&
    veiculoId &&
    dataAgendamento &&
    quilometragem !== "" &&
    Number(quilometragem) >= 0 &&
    itensSelecionados.length > 0 &&
    itensSelecionados.every((i) => i.valor !== "" && Number(i.valor) > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Preencha todos os campos obrigatórios e adicione ao menos um item com valor maior que zero.");
      return;
    }
    try {
      await ServicoAPI.criarAsync(
        Number(clienteId),
        Number(veiculoId),
        dataAgendamento,
        observacao,
        itensSelecionados.map((i) => ({
          tipoServico: i.tipoServico,
          valor: Number(i.valor),
          kilometragemNaRevisao: Number(quilometragem),
        }))
      );
      navigate("/servicos");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
    }
  };

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <h3>Novo Serviço</h3>

          <form onSubmit={handleSubmit} className={style.formulario}>

            {/* Cliente */}
            <div className={style.campo}>
              <label>Cliente *</label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} — {c.cpf}
                  </option>
                ))}
              </select>
            </div>

            {/* Veículo */}
            <div className={style.campo}>
              <label>Veículo *</label>
              <select
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                disabled={!clienteId}
                required
              >
                <option value="">
                  {clienteId ? "Selecione um veículo" : "Selecione um cliente primeiro"}
                </option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} — {v.marca} {v.modelo} ({v.anoModelo})
                  </option>
                ))}
              </select>
            </div>

            {/* Data + Quilometragem lado a lado */}
            <div className={style.linha}>
              <div className={style.campo}>
                <label>Data de Agendamento *</label>
                <input
                  type="datetime-local"
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  required
                />
              </div>

              <div className={style.campo}>
                <label>Quilometragem Atual (km) *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex: 45000"
                  value={quilometragem}
                  onChange={(e) => setQuilometragem(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Observação */}
            <div className={style.campo}>
              <label>
                Observação
                <span className={style.contador}>
                  {observacao.length}/500
                </span>
              </label>
              <textarea
                placeholder="Observações sobre o serviço (opcional)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* Itens */}
            <p className={style.secao_titulo}>
              Itens do Serviço *{" "}
              {itensSelecionados.length > 0 &&
                `(${itensSelecionados.length} selecionado${itensSelecionados.length > 1 ? "s" : ""})`}
            </p>
            <div className={style.itens_lista}>
              {itens.map((item, index) => (
                <div
                  key={item.tipoServico}
                  className={`${style.item_linha} ${item.selecionado ? style.item_selecionado : ""}`}
                  onClick={() => toggleItem(index)}
                >
                  <input
                    type="checkbox"
                    className={style.item_checkbox}
                    checked={item.selecionado}
                    onChange={() => toggleItem(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className={style.item_nome}>{item.label}</span>
                  <input
                    type="number"
                    className={style.item_valor_input}
                    placeholder="R$ 0,00"
                    step="0.01"
                    min="0"
                    value={item.valor}
                    disabled={!item.selecionado}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setValorItem(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className={style.acoes}>
              <button type="button" className={style.botao_cancelar} onClick={() => navigate("/servicos")}>
                Cancelar
              </button>
              <button type="submit" className={style.botao_salvar} disabled={!isFormValid()}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </Topbar>
    </Sidebar>
  );
}
