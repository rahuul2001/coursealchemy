import React from "react";
import Header from "./Header";

interface MainPageProps {
  token: string;
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-4">Main Page</h1>
        
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </main>
    </div>
  );
};

export default MainPage;
