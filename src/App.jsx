import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CreateForm from "./components/Admin/CreateForm.jsx";
import DynamicForm from "./components/User/DynamicForm.jsx";
import ResponsesPage from "./pages/ResponsesPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>📋 Form Builder</h2>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
        </div>
      </nav>

      <Routes>
        {/* Admin Dashboard - list of all forms */}
        <Route path="/" element={<Dashboard />} />

        {/* Create new form */}
        <Route path="/create" element={<CreateForm />} />

        {/* Edit existing form (same builder, loads existing data) */}
        <Route path="/edit/:id" element={<CreateForm />} />

        {/* Public form fill page for end users */}
        <Route path="/form/:id" element={<DynamicForm />} />

        {/* Admin responses table for a form */}
        <Route path="/responses/:id" element={<ResponsesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
