import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./paginas/Home/Home";
import { Clientes } from "./paginas/Clientes/Clientes";
import { NovoCliente } from "./paginas/NovoCliente/NovoCliente";
import { EditarCliente } from "./paginas/EditarCliente/EditarCliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/cliente/novo" element={<NovoCliente />} />
        <Route path="/cliente/editar" element={<EditarCliente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
