import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginRequest } from "../../services/authService.tsx"
const Login = () => {
  // const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    if (!email || !password) {
      setError("Усі поля обовʼязкові");
      return false;
    }

    if (!email.includes("@")) {
      setError("Некоректний email");
      return false;
    }

    if (password.length < 6) {
      setError("Пароль має бути мінімум 6 символів");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // try {
    //   setLoading(true);
    //   const response = await loginRequest({ email, password });
    //   localStorage.setItem("token", response.token);
    //   navigate("/");
    // } catch (err: any) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-xl font-semibold mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/*<button*/}
          {/*  type="submit"*/}
          {/*  disabled={loading}*/}
          {/*  className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"*/}
          {/*>*/}
          {/*  {loading ? "Loading..." : "LOGIN"}*/}
          {/*</button>*/}
        </form>
      </div>
    </div>
  );
};

export default Login;
