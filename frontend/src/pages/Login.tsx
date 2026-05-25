import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";

type LoginData = { email: string; password: string };

export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginData) => {
      const res = await axiosInstance.post("/auth/login", loginData);
      return res.data;
    },
    onSuccess: (responseData) => {
      localStorage.setItem("token", responseData.token);
      navigate("/");
    },
    onError: () => {
      alert("Login Failed");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (googleToken: string) => {
      const res = await axiosInstance.post("/auth/google", { googleToken });
      return res.data;
    },
    onSuccess: (responseData) => {
      localStorage.setItem("token", responseData.token);
      navigate("/");
    },
    onError: () => {
      alert("Google Login Failed");
    },
  });

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-[420px] bg-zinc-900 p-8 rounded-3xl">
        <h1 className="text-4xl text-white text-center mb-8">DevFlow AI</h1>

        <form onSubmit={login} className="space-y-4">
          <input
            className="w-full p-4 rounded bg-zinc-800 text-white"
            placeholder="Email"
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="w-full p-4 rounded bg-zinc-800 text-white"
            placeholder="Password"
            onChange={(e) =>
              setData({
                ...data,
                password: e.target.value,
              })
            }
          />

          <button className="w-full bg-green-600 p-4 rounded text-white">
            Login
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                googleLoginMutation.mutate(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        <Link to="/register" className="text-green-400 block text-center mt-5">
          Register
        </Link>
      </div>
    </div>
  );
}
