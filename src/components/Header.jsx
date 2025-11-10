import { useState } from "react";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.svg";
import { PiUserCircle } from "react-icons/pi";
import { House, NotepadText, Package, MailOpen, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-sky-600 text-white py-5 relative z-20 pl-5 pr-3.5">
      {/* Container interno para o conteúdo, com padding e centralização */}
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="SeaShade Logo" className="max-w-24 md:max-w-36 sm:max-w-35 object-cover" />
        </Link>

        {/* Menu de navegação para desktop */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center gap-14 text-slate-50">
            <li><a href="/" className="line">Início</a></li>
            <li><a href="/sobre" className="line">Sobre</a></li>
            <li><a href="/contato" className="line">Contato</a></li>
          </ul>
        </nav>

        {/* Botão "Entrar" para desktop */}
        <a
          href="/login"
          className="hidden md:block border px-4 py-1.5 transition-colors duration-300 hover:bg-slate-50 hover:text-black hover:border-slate-50 rounded">
          Entrar
        </a>
      </div>

      {/* Botão de abrir Menu Hamburguer para Mobile */}
      <Menu
        onClick={() => setIsMenuOpen(true)}
        className={`text-slate-50 md:hidden cursor-pointer absolute right-3 top-1/2 -translate-y-1/2`}
        size="50"
      />

      {/* Menu Hamburguer (Mobile) */}
      <div
        className={`fixed top-0 right-0 h-screen w-full bg-sky-600 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-5 px-10">
          <img src={logo} alt="SeaShade Logo" className="max-w-24 object-cover" />
          <X onClick={() => setIsMenuOpen(false)} className="text-slate-50 cursor-pointer" size="30" />
        </div>
        <ul className="pt-7 px-8 flex flex-col gap-9 text-xl">
          <li>
            <a href="/" className="border-b flex items-center border-azul-300 pb-2.5" onClick={() => setIsMenuOpen(false)}>
              <div className="gap-2 flex hover:text-slate-300 transition-color duration-300">
              <div className="flex justify-center items-center w-8"><House size={17} /></div>
              Início</div>
            </a>
          </li>
          <li>
            <a href="/sobre" className="border-b flex items-center border-azul-300 pb-2.5" onClick={() => setIsMenuOpen(false)}>
             <div className="gap-2 flex hover:text-slate-300 transition-color duration-300">
              <div className="flex justify-center items-center w-8"><NotepadText size={17} /></div>
              Sobre</div>
            </a>
          </li>
          <li>
            <a href="/contato" className="border-b flex items-center border-azul-300 pb-2.5" onClick={() => setIsMenuOpen(false)}>
              <div className="gap-2 flex hover:text-slate-300 transition-color duration-300">
              <div className="flex justify-center items-center w-8"><MailOpen size={17} /></div>
              Contato</div>
            </a>
          </li>
          <li>
            <a href="/login" className="shadow-sm hover:brightness-110 transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 rounded-sm font-medium justify-center flex items-center gap-2 p-4" onClick={() => setIsMenuOpen(false)}>
              <div className="gap-2 flex justify-center items-center w-8"><PiUserCircle /></div>
              Entrar / Cadastrar-se
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;