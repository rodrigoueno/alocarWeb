import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import { Topbar } from "../../componentes/Topbar/Topbar";
import style from "./EditarServico.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ServicoAPI from "../../services/servicoAPI";

const SITUACOES = [
  { value: 1, label: "Agendado" },
  { value: 2, label: "Em Andamento" },
  { value: 3, label: "Concluído" },
  { value: 4, label: "Cancelado" },
];

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

// Converte "2026-05-31T14:30:00" → "2026-05-31T14:30" (formato aceito pelo input datetime-local)
function toDatetimeLocal(value) {
  if (!value) return "";
  return value.slice(0, 16);
}

export function EditarServico() {
  const navigate = useNavigate();
  const location = useLocation();
  const servicoId = location.state;

  const [dataAgendamento, setDataAgendamento] = useState("");
  const [situacao, setSituacao] = useState(1);
  const [valorTotal, setValorTotal] = useState("");
  const [observacao, setObservacao] = useState("");

  // Itens existentes do serviço (somente leitura — exibição informativa)
  const [itensExistentes, setItensExistentes] = useState([]);

  useEffect(() => {
    async function carregarServico() {
      try {
        const servico = await ServicoAPI.obterAsync(servicoId);
        setDataAgendamento(toDatetimeLocal(servico.dataAgendamento));
        setSituacao(servico.situacao ?? 1);
        setValorTotal(servico.valorTotal ?? "");
        setObservacao(servico.observacao ?? "");
        setItensExistentes(servico.itens ?? []);
      } catch (error) {
        console.error("Erro ao carregar serviço:", error);
      }
    }
    if (servicoId) carregarServico();
  }, [servicoId]);

  const isFormValid = () => dataAgendamento && situacao && valorTotal !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await ServicoAPI.atualizarAsync(
        servicoId,
        dataAgendamento,
        Number(situacao),
        Number(valorTotal),
        observacao
      );
      navigate("/servicos");
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
    }
  };

  const getLabelTipo = (value) =>
    TIPOS_SERVICO.find((t) => t.value === value)?.label ?? `Tipo ${value}`;

  return (
    <Sidebar>
      <Topbar>
        <div className={style.pagina_conteudo}>
          <h3>Editar Serviço</h3>

          <form onSubmit={handleSubmit} className={style.formulario}>

            {/* Data de agendamento */}
            <div className={style.campo}>
              <label>Data de Agendamento *</label>
              <input
                type="datetime-local"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
                required
              />
            </div>

            {/* Situação + Valor total lado a lado */}
            <div className={style.linha}>
              <div className={style.campo}>
                <label>Situação *</label>
                <select value={situacao} onChange={(e) => setSituacao(e.target.value)} required>
                  {SITUACOES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={style.campo}>
                <label>Valor Total (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Itens (somente leitura) */}
            {itensExistentes.length > 0 && (
              <>
                <p className={style.secao_titulo}>Itens do Serviço</p>
                <div className={style.itens_lista}>
                  {itensExistentes.map((item, index) => (
                    <div key={index} className={`${style.item_linha} ${style.item_selecionado}`}>
                      <input type="checkbox" className={style.item_checkbox} checked readOnly />
                      <span className={style.item_nome}>{getLabelTipo(item.tipoServico)}</span>
                      <input
                        type="number"
                        className={style.item_valor_input}
                        value={item.valor ?? ""}
                        disabled
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

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
