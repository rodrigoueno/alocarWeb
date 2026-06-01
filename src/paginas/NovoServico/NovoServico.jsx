import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./NovoServico.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ServicoAPI from "../../services/ServicoAPI";
import ClienteAPI from "../../services/clienteAPI";
import VeiculoAPI from "../../services/VeiculoAPI";

const BASE_SUGESTAO_URL = "http://localhost:5150/api/Sugestao/ObterSugestoes";

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

const PRIORIDADE_STYLE = {
  Alta:  { background: "#ffebee", color: "#c62828" },
  Média: { background: "#fff8e1", color: "#f57f17" },
  Baixa: { background: "#e8f5e9", color: "#2e7d32" },
};

function dataHojeLocal() {
  const agora = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
}

export function NovoServico() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState(dataHojeLocal());
  const [quilometragem, setQuilometragem] = useState("");
  const [observacao, setObservacao] = useState("");

  const [sugestoes, setSugestoes] = useState(null);
  const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

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
      setSugestoes(null);
      return;
    }
    VeiculoAPI.listarPorClienteAsync(Number(clienteId))
      .then(setVeiculos)
      .catch((err) => console.error("Erro ao carregar veículos:", err));
    setVeiculoId("");
    setSugestoes(null);
  }, [clienteId]);

  // Ao selecionar veículo: preenche KM e busca sugestões
  useEffect(() => {
  if (!veiculoId) {
    setSugestoes(null);
    return;
  }

  async function carregarVeiculo() {
    try {
      const veiculo = await VeiculoAPI.obterAsync(Number(veiculoId));
      setQuilometragem(veiculo.quilometragem ?? 0);
      setSugestoes(null);
    } catch (err) {
      console.error("Erro ao carregar veículo:", err);
    }
  }

  carregarVeiculo();
}, [veiculoId]);

useEffect(() => {
  if (!veiculoId || quilometragem === "") {
    return;
  }

  async function carregarSugestoes() {
    try {
      setCarregandoSugestoes(true);
      setSugestoes(null);

      const response = await fetch(BASE_SUGESTAO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          veiculoId: Number(veiculoId),
          kilometragemAtual: Number(quilometragem),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSugestoes(data);
      }
    } catch (err) {
      console.error("Erro ao carregar sugestões:", err);
    } finally {
      setCarregandoSugestoes(false);
    }
  }

  carregarSugestoes();
}, [quilometragem]);
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
        <div className={style.pagina_conteudo}>
          <h3>Novo Serviço</h3>

          <div className={style.layout}>
            {/* ── Formulário ── */}
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

              {/* Data + Quilometragem */}
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
                  <span className={style.contador}>{observacao.length}/500</span>
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

            {/* ── Painel de Sugestões da IA ── */}
            <div className={style.sugestoes_painel}>
              <p className={style.secao_titulo}>Sugestões do Thiaguinho CDF</p>

              {!veiculoId && (
                <p className={style.sugestoes_vazio}>
                  Selecione um veículo para receber sugestões de manutenção.
                </p>
              )}

              {veiculoId && carregandoSugestoes && (
                <div className={style.sugestoes_loading}>
                  <div className={style.spinner} />
                  <span>Analisando histórico do veículo...</span>
                </div>
              )}

              {sugestoes && !carregandoSugestoes && (
                <>
                  <div className={style.sugestoes_lista}>
                    {sugestoes.servicosSugeridos.map((s, i) => (
                      <div key={i} className={style.sugestao_card}>
                        <div className={style.sugestao_cabecalho}>
                          <span className={style.sugestao_tipo}>{s.tipoServico}</span>
                          <span
                            className={style.sugestao_prioridade}
                            style={PRIORIDADE_STYLE[s.prioridade] ?? PRIORIDADE_STYLE["Baixa"]}
                          >
                            {s.prioridade}
                          </span>
                        </div>
                        <p className={style.sugestao_justificativa}>{s.justificativa}</p>
                      </div>
                    ))}
                  </div>

                  {sugestoes.previsaoProximoRetorno && (
                    <div className={style.previsao_retorno}>
                      🔁 <strong>Próximo retorno:</strong> {sugestoes.previsaoProximoRetorno}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
    </Sidebar>
  );
}
