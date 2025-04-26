
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-marvel-black flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="container px-4 py-24 text-center max-w-2xl mx-auto">
          <h1 className="text-8xl font-bold text-marvel-red mb-6">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Página Não Encontrada</h2>
          <p className="text-white/70 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link to="/" className="marvel-button inline-block">
            Voltar para Início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
