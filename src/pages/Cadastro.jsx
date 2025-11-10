import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PiUserCirclePlus } from "react-icons/pi";

const Cadastro = () => {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [quiosque, setQuiosque] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de controle da UI
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError('');

    // Validação de campos vazios
    if (!name || !email || !password || !quiosque || !confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    // Validação de e-mail
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('E-mail inválido');
      return;
    }
    // ADICIONADO: Validação de confirmação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name: name,
        email: email,
        password: password,
        quiosque: quiosque, 
      });
      
      console.log("Usuário cadastrado com sucesso:", response.data);

      navigate('/login', { state: { message: "Cadastro realizado com sucesso! Faça o login." } });

    } catch (err) {
      setError(err.response?.data?.message || 'Erro no cadastro. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className="bg-slate-50 flex flex-col md:gap-6 min-h-screen">
      <Header />
      <main className="my-5 flex-1 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <h1 className="flex-wrap flex items-center text-4xl font-medium px-4 py-4 text-blue-950 gap-3">
            <PiUserCirclePlus size="35" strokeWidth={4} />Faça seu cadastro
          </h1>
          <h2 className="text-blue-800 text-center flex-wrap text-lg">
            Já tem uma conta? <Link to="/login"><span className="border-b hover:text-blue-600">Entre no Seashade</span></Link>
          </h2>
        </div>

        <form className="w-full md:max-w-md max-w-sm mx-auto" onSubmit={handleCadastro}>
  <fieldset className="w-full flex flex-col gap-5">
    
    <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
      Nome
      <input 
        className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={name} 
        onChange={e => setName(e.target.value)} 
        type='text' 
        placeholder='Seu nome completo' 
      />
    </label>

    <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
      Nome do estabelecimento
      <input 
        className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={quiosque} 
        onChange={e => setQuiosque(e.target.value)} 
        type='text' 
        placeholder='Nome da sua barraca/quiosque' 
      />
    </label>

    <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
      E-mail
      <input 
        className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        type='email' 
        placeholder='Ex: email@hotmail.com' 
      />
    </label>

    <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
      Senha
      <input 
        className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        type='password' 
        placeholder='••••••••••••' 
      />
    </label>

    <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
      Confirme sua Senha
      <input 
        className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={confirmPassword} 
        onChange={e => setConfirmPassword(e.target.value)} 
        type='password' 
        placeholder='••••••••••••' 
      />
    </label>

    {error && (
      <p className="text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>
    )}

    <button 
      className="cursor-pointer mt-4 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3 rounded-lg w-full transition-colors shadow-md disabled:bg-orange-300"
      type="submit"
      disabled={loading}
    >
      {loading ? 'Cadastrando...' : 'Cadastrar'}
    </button>
  </fieldset>
</form>

      </main>
      
      </div> 
      <Footer />
    </div>
  );
};

export default Cadastro;
