const URLReferencia = "http://localhost:5150/api/Cliente";

const ClienteAPI = {
  async listarAsync(ativo = true) {
    const response = await fetch(`${URLReferencia}/Listar?ativo=${ativo}`);
    if (!response.ok) throw new Error("Erro ao listar clientes");
    return await response.json();
  },

  async obterAsync(id) {
    const response = await fetch(`${URLReferencia}/Obter/${id}`);
    if (!response.ok) throw new Error("Erro ao obter cliente");
    return await response.json();
  },

  async criarAsync(nome, email, telefone, cpf) {
    const response = await fetch(`${URLReferencia}/Criar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone, cpf }),
    });
    if (!response.ok) throw new Error("Erro ao criar cliente");
    return await response.json();
  },

  async atualizarAsync(id, nome, email, telefone, cpf) {
    const response = await fetch(`${URLReferencia}/Atualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nome, email, telefone, cpf }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar cliente");
  },

  async deletarAsync(id) {
    const response = await fetch(`${URLReferencia}/Excluir/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar cliente");
  },
};

export default ClienteAPI;