import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Administrator from "./pages/Administrator";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/administrator" element={<Administrator />} />
      </Routes>
    </Router>
  );
}

export default App;
