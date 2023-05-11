import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Test = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const history = useNavigate();
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
            type="button"
          >
            Login
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker"
            onClick={() => history("/change-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test;
