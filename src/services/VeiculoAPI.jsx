const URLReferencia = "http://localhost:5150/api/Veiculo";

const VeiculoAPI = {
  async listarAsync(ativo = true) {
    const response = await fetch(`${URLReferencia}/Listar?ativo=${ativo}`);
    if (!response.ok) throw new Error("Erro ao listar veiculos");
    return await response.json();
  },

  async listarPorClienteAsync(clienteId) {
    const response = await fetch(`${URLReferencia}/ListarPorCliente/${clienteId}`);
    if (!response.ok) throw new Error("Erro ao listar veículos do cliente");
    return await response.json();
  },

  async obterAsync(id) {
    const response = await fetch(`${URLReferencia}/Obter/${id}`);
    if (!response.ok) throw new Error("Erro ao obter veiculo");
    return await response.json();
  },

  async criarAsync(marca, modelo, cor, placa, anoFabricacao, anoModelo, quilometragem, tipo) {
    const response = await fetch(`${URLReferencia}/Criar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marca, modelo, cor, placa, anoFabricacao, anoModelo, quilometragem, tipo }),
    });
    if (!response.ok) throw new Error("Erro ao criar veiculo");
    return await response.json();
  },

  async atualizarAsync(id, marca, modelo, cor, placa, anoFabricacao, anoModelo, quilometragem, tipo) {
    const response = await fetch(`${URLReferencia}/Atualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, marca, modelo, cor, placa, anoFabricacao, anoModelo, quilometragem, tipo }),
    });
    if (!response.ok) throw new Error("Erro ao atualizar veiculo");
  },

  async deletarAsync(id) {
    const response = await fetch(`${URLReferencia}/Excluir/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar veiculo");
  },
};

export default VeiculoAPI;
