import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {type RootState, useAppDispatch, useAppSelector} from "../store/store";
import { login } from "../../slices/authSlice";
import * as React from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, token } = useAppSelector((state: RootState) => state.authStoreSlice);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const validate = (): boolean => {
    if (!email || !password) {
      alert("All fields are required.");
      return false;
    }

    if (!email.includes("@")) {
      alert("Incorrect email");
      return false;
    }

    if (password.length < 5) {
      alert("Password must be at least 5 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Sending login:', { login: email, password });
    try {
      await dispatch(login({ login: email, password })).unwrap();
      navigate("/app/orders");
    } catch (e: unknown) {
      if (e instanceof Error) {
      alert(e || "Incorrect login or password");
    }

  }
  };
  useEffect(() => {
    if (token) navigate("/app");
  }, [token, navigate]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#43a047]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-80">
          <h2 className="text-center text-xl font-semibold mb-6">Login</h2>

          {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>

          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
  );
};

export default Login;
