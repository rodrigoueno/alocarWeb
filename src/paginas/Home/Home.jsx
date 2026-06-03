import { useState, useEffect, useMemo } from "react";
import { Sidebar } from "../../componentes/Sidebar/Sidebar";
import style from "./Home.module.css";

const BASE_URL = "http://localhost:5150/api";

const SITUACAO_LABEL = {
  1: "Agendado",
  2: "Em Andamento",
  3: "Concluído",
  4: "Cancelado",
};

const SITUACAO_CLASS = {
  1: "agendado",
  2: "em_andamento",
  3: "concluido",
  4: "cancelado",
};

function formatarHora(dataISO) {
  if (!dataISO) return "--:--";
  const d = new Date(dataISO);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarData(dataISO) {
  if (!dataISO) return "--";
  const d = new Date(dataISO);
  return d.toLocaleDateString("pt-BR");
}

function ehHoje(dataISO) {
  if (!dataISO) return false;
  const hoje = new Date();
  const d = new Date(dataISO);
  return (
    d.getDate() === hoje.getDate() &&
    d.getMonth() === hoje.getMonth() &&
    d.getFullYear() === hoje.getFullYear()
  );
}

export function Home() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Filtros
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [filtroAtivos, setFiltroAtivos] = useState(false);

  useEffect(() => {
    async function carregarServicos() {
      try {
        setCarregando(true);
        const res = await fetch(`${BASE_URL}/Servico/Listar?ativo=true`);
        if (!res.ok) throw new Error("Erro ao carregar serviços");
        const data = await res.json();
        setServicos(data);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarServicos();
  }, []);

  // Pesquisa todos serviços de um cliente.
  const clientes = useMemo(() => {
    const mapa = new Map();
    servicos.forEach((s) => {
      if (s.nomeCliente) {
      mapa.set(s.id, s.nomeCliente);
    }});
    return Array.from(mapa.entries()).map(([id, nome]) => ({ id, nome }));
  }, [servicos]);

  // Lista serviço Agendados e Em Andamento.
  const servicosFiltrados = useMemo(() => {
    let lista = [...servicos];

    if (clienteSelecionado) {
    lista = lista.filter(
      (s) => String(s.id) === String(clienteSelecionado)
    );
    } else if (filtroAtivos) {
      lista = lista.filter((s) => s.situacao === 1 || s.situacao === 2);
    } else {
      lista = lista.filter((s) => ehHoje(s.dataAgendamento));
    }


    lista.sort(
      (a, b) =>
        new Date(a.dataAgendamento) - new Date(b.dataAgendamento)
    );

    return lista;
  }, [servicos, clienteSelecionado, filtroAtivos]);

  function limparFiltros() {
    setClienteSelecionado("");
    setFiltroAtivos(false);
  }

  const tituloLista = useMemo(() => {
    if (clienteSelecionado) {
      const cliente = clientes.find(
        (c) => String(c.id) === String(clienteSelecionado)
      );
      return `Serviços de ${cliente?.nome ?? "cliente"}`;
    }
    if (filtroAtivos) return "Serviços Agendados e Em Andamento";
    return `Serviços de Hoje — ${new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    })}`;
  }, [clienteSelecionado, filtroAtivos, clientes]);

  return (
    <div className={style.conteudo}>
      <Sidebar>
        <div className={style.topbar}>
          <div className={style.topbar_titulo}>
            <span>A solução certa para o seu veículo</span>
          </div>
          <div className={style.topbar_filtros}>
            <select
              className={style.filtro_select}
              value={clienteSelecionado}
              onChange={(e) => {
                setClienteSelecionado(e.target.value);
                setFiltroAtivos(false);
              }}
            >
              <option value="">Todos os clientes</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <button
              className={`${style.filtro_btn} ${filtroAtivos ? style.filtro_btn_ativo : ""}`}
              onClick={() => {
                setFiltroAtivos((prev) => !prev);
                setClienteSelecionado("");
              }}
            >
              Agendados / Em Andamento
            </button>

            {(clienteSelecionado || filtroAtivos) && (
              <button className={style.filtro_limpar} onClick={limparFiltros}>
                ✕ Limpar
              </button>
            )}
          </div>
        </div>

        <div className={style.pagina_conteudo}>
          <h3 className={style.titulo_lista}>{tituloLista}</h3>

          {carregando && (
            <div className={style.estado_msg}>Carregando serviços...</div>
          )}
          {erro && (
            <div className={style.estado_erro}>Erro: {erro}</div>
          )}

          {!carregando && !erro && servicosFiltrados.length === 0 && (
            <div className={style.estado_msg}>
              Nenhum serviço encontrado.
            </div>
          )}

          {!carregando && !erro && servicosFiltrados.length > 0 && (
            <div className={style.tabela_container}>
              <table className={style.tabela}>
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Cliente</th>
                    <th>Veículo</th>
                    <th>Placa</th>
                    <th>Situação</th>
                    <th>Valor Previsto</th>
                    <th>Valor Total</th>
                    {(clienteSelecionado || filtroAtivos) && <th>Data</th>}
                  </tr>
                </thead>
                <tbody>
                  {servicosFiltrados.map((s) => (
                    <tr key={s.id}>
                      <td className={style.col_hora}>
                        {formatarHora(s.dataAgendamento)}
                      </td>
                      <td>{s.nomeCliente ?? "—"}</td>
                      <td>{s.modeloVeiculo}</td>
                      <td className={style.col_placa}>{s.placaVeiculo}</td>
                      <td>
                        <span
                          className={`${style.badge} ${style[SITUACAO_CLASS[s.situacao]]}`}
                        >
                          {SITUACAO_LABEL[s.situacao] ?? s.situacao}
                        </span>
                      </td>
                      <td>
                        {s.valorPrevisto?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td>
                        {s.valorTotal?.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      {(clienteSelecionado || filtroAtivos) && (
                        <td>{formatarData(s.dataAgendamento)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
}
