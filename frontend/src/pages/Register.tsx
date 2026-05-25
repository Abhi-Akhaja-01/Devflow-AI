import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { GoogleLogin } from "@react-oauth/google";

type RegisterData = { name: string; email: string; password: string };

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const res = await axiosInstance.post("/auth/register", registerData);
      return res.data;
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: () => {
      alert("Register Failed");
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="w-[420px] bg-zinc-900 p-8 rounded-3xl">
        <h1 className="text-4xl text-center text-white mb-8">DevFlow AI</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-4 rounded bg-zinc-800 text-white"
            placeholder="Name"
            onChange={(e) =>
              setData({
                ...data,
                name: e.target.value,
              })
            }
          />

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

          <button className="w-full bg-blue-600 p-4 rounded text-white">
            Register
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

        <Link to="/login" className="text-blue-400 block text-center mt-5">
          Login
        </Link>
      </div>
    </div>
  );
}
