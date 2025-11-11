import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Reserve from "./pages/Reserve";
import Travel from "./pages/Travel";
import CreateTravel from "./pages/CreateTravel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reserve" element={<Reserve />} />
      <Route path="/travel" element={<Travel />} />
      <Route path="/travel/create" element={<CreateTravel />} />

      {/* Ruta catch-all (si algo no existe → volver al login) */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
