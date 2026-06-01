const BASE_URL = "http://localhost:5150/api/Servico";

const ServicoAPI = {
  async listarAsync(ativo = true) {
    const response = await fetch(`${BASE_URL}/Listar?ativo=${ativo}`);
    if (!response.ok) throw new Error("Erro ao listar serviços");
    return response.json();
  },

  async obterAsync(id) {
    const response = await fetch(`${BASE_URL}/Obter/${id}`);
    if (!response.ok) throw new Error("Erro ao obter serviço");
    return response.json();
  },

  async criarAsync(clienteId, veiculoId, dataAgendamento, observacao, itens) {
    const response = await fetch(`${BASE_URL}/Criar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId, veiculoId, dataAgendamento, observacao, itens }),
    });
    if (!response.ok) throw new Error("Erro ao criar serviço");
    return response.json();
  },

  async atualizarAsync(id, dataAgendamento, situacao, valorTotal, observacao) {
    const response = await fetch(`${BASE_URL}/Atualizar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataAgendamento, situacao, valorTotal, observacao }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar serviço");
  },

  async deletarAsync(id) {
    const response = await fetch(`${BASE_URL}/Excluir/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar serviço");
  },
};

export default ServicoAPI;
