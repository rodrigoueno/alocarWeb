import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./paginas/Home/Home";
import { Clientes } from "./paginas/Clientes/Clientes";
import { NovoCliente } from "./paginas/NovoCliente/NovoCliente";
import { EditarCliente } from "./paginas/EditarCliente/EditarCliente";
import { Veiculos } from "./paginas/Veiculos/Veiculos";
import { NovoVeiculo } from "./paginas/NovoVeiculo/NovoVeiculo";
import { EditarVeiculo } from "./paginas/EditarVeiculo/EditarVeiculo";
import { Servicos } from "./paginas/Servicos/Servicos";
import { NovoServico } from "./paginas/NovoServico/NovoServico";
import { EditarServico } from "./paginas/EditarServico/EditarServico";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cliente/novo" element={<NovoCliente />} />
        <Route path="/cliente/editar" element={<EditarCliente />} />

        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/veiculo/novo" element={<NovoVeiculo />} />
        <Route path="/veiculo/editar" element={<EditarVeiculo />} />

        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servico/novo" element={<NovoServico />} />
        <Route path="/servico/editar" element={<EditarServico />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
