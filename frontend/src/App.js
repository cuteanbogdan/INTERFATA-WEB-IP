import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Administrator from "./pages/Administrator";
import Medic from './pages/Medic';
import ChangePassword from './pages/ChangePassword';
import UpdatePassword from './pages/UpdatePassword';
import StartPage from "./pages/StartPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<StartPage />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/administrator" element={<Administrator />} />
        <Route exact path="/medic" element={<Medic />} />
        <Route exact path="/change-password" element={<ChangePassword />} />
        <Route exact path="/update-password" element={<UpdatePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
