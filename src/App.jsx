import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "react-use-cart";
import Dashboard from "./pages/Dashboard.jsx";
import CreateForm from "./components/Admin/CreateForm.jsx";
import DynamicForm from "./components/User/DynamicForm.jsx";
import ResponsesPage from "./pages/ResponsesPage.jsx";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <nav className="navbar">
          <h2>📋 Form Builder</h2>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/edit/:id" element={<CreateForm />} />
          <Route path="/form/:id" element={<DynamicForm />} />
          <Route path="/responses/:id" element={<ResponsesPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;