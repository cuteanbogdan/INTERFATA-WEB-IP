import React from "react";
import useAuth from "../utils/useAuth";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const history = useNavigate();

  const { authenticated } = useAuth();
  if (!authenticated) {
    history("/login");
    return null;
  }
  return <div>StartPage</div>;
};

export default StartPage;
