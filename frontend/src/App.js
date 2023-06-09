import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Administrator from "./pages/Administrator";
import Doctor from "./pages/Doctor";
import ChangePassword from "./pages/ChangePassword";
import UpdatePassword from "./pages/UpdatePassword";
import StartPage from "./pages/StartPage";
import Pacient from "./pages/Pacient";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Ingrijitor from "./pages/Ingrijitor";
import Supraveghetor from "./pages/Supraveghetor";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path="/" element={<StartPage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/administrator" element={<Administrator />} />
          <Route exact path="/doctor" element={<Doctor />} />
          <Route exact path="/pacient/:id" element={<Pacient />} />
          <Route exact path="/change-password" element={<ChangePassword />} />
          <Route exact path="/update-password" element={<UpdatePassword />} />
          <Route exact path="/ingrijitor" element={<Ingrijitor />} />
          <Route exact path="/supraveghetor" element={<Supraveghetor />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
