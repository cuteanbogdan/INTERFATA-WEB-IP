import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Administrator from "./pages/Administrator";
import UserForm from './pages/UserForm';
import Medic from './pages/Medic';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/administrator" element={<Administrator />} />
        <Route exact path="/test" element={<UserForm />} />
        <Route exact path="/medic" element={<Medic />} />
      </Routes>
    </Router>
  );
}

export default App;
