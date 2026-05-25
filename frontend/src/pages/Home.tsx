import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <nav className="flex justify-between p-5">
        <h1 className="text-3xl">DevFlow AI</h1>
        <button onClick={logout} className="bg-red-500 px-5 py-2 rounded">
          Logout
        </button>
      </nav>  

      <div className="flex justify-center items-center h-[80vh]">
        <h1 className="text-6xl font-bold">Hello</h1>
      </div>
    </div>
  );
}
