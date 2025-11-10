import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import Profile from "./pages/Profile";
import CreateTravel from "./pages/CreateTravel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/reserve/:id" element={<Reserve />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-travel" element={<CreateTravel />} />
    </Routes>
  );
}

export default App;
