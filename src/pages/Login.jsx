import Header from '../components/Header';
import axios from "axios";
import { useState } from 'react';
import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [codigo, setCodigo] = useState('');
  const [showCodigo, setShowCodigo] = useState(false); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!showCodigo) {
      // --- FLUXO DE LOGIN PARA O DONO (E-MAIL/SENHA) ---
      if (!email || !pass) {
        setError('Preencha todos os campos');
        setLoading(false);
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('E-mail inválido');
        setLoading(false);
        return;
      }

      try {
        const loginResponse = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password: pass,
        });

        localStorage.setItem('user', JSON.stringify(loginResponse.data));
        const profileResponse = await apiClient.get('/api/users/me');

        const userDataCompleto = {
          ...profileResponse.data,
          accessToken: loginResponse.data.accessToken,
          ExpiresIn: loginResponse.data.ExpiresIn
        };

        login(userDataCompleto);
        navigate('/inicio');

      } catch (err) {
        localStorage.removeItem('user');
        setError(err.response?.data?.message || 'Email ou senha inválidos');
      } finally {
        setLoading(false);
      }
    } else {
            // --- FLUXO DE LOGIN PARA O ATENDENTE (CÓDIGO) ---
            try {
                const response = await axios.post('http://localhost:8080//api/atendentes/login', { 
                    codigo: codigo, 
                });
                
                const atendenteData = {
                    accessToken: response.data.accessToken, 
                    name: response.data.userName, 
                    email: null, 
                    roles: [{ name: response.data.userRole }], 
                    quiosqueId: response.data.quiosqueId
                };
                
                login(atendenteData); 
                navigate('/comandas'); // Redireciona para a tela de comandas

            } catch (err) {
                setError(err.response?.data?.message || 'Código inválido');
            } finally {
                setLoading(false);
            }
        }
    };

  return (
    <div>
    <div className="bg-slate-50 flex flex-col md:gap-6 min-h-screen">
      <Header />
      <main className="my-5 flex-1 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <h1 className="flex-wrap flex items-center text-4xl font-medium px-4 py-4 text-blue-950 gap-3">
            <PiUserCircle size="35" strokeWidth={4}/>Entre na sua conta
          </h1>
          <h2 className="text-blue-800 text-center flex-wrap text-lg">
            Novo por aqui? <Link to="/cadastro"><span className="border-b hover:text-blue-600">Cadastre-se no Seashade</span></Link>
          </h2>
        </div>

        <form className="w-full md:max-w-md max-w-sm mx-auto" onSubmit={handleLogin}>
          <fieldset className="w-full flex flex-col gap-5">

            {!showCodigo && (
              <>
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
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    type='password'
                    placeholder='••••••••••••'
                  />
                </label>
              </>
            )}

            {showCodigo && (
              <label className="text-lg md:text-xl flex flex-col gap-2 text-slate-600">
                Código
                <input
                  className="bg-white border border-slate-300 rounded px-4 py-3 inset-shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  type='text'
                  placeholder='Insira seu código'
                />
              </label>
            )}

            {error && (
              <p className="text-red-600 text-center bg-red-100 p-3 rounded-md">{error}</p>
            )}

            <div className="text-xl flex flex-col gap-3">
              <button
                className="cursor-pointer flex items-center justify-center bg-orange-500 text-white py-3 rounded-lg w-full font-semibold transition-colors hover:bg-orange-400 shadow-md disabled:bg-orange-300"
                type="submit"
                disabled={loading}
              >
                {loading ? (showCodigo ? 'Entrando...' : 'Entrando...') : (showCodigo ? 'Entrar com Código' : 'Entrar')}
              </button>

              <button
                className="text-base cursor-pointer text-slate-500 w-full hover:text-orange-400 transition-colors"
                type="button"
                onClick={() => setShowCodigo(!showCodigo)}
              >
                {showCodigo ? 'Voltar ao login com email' : 'Logar por código'}
              </button>

              {!showCodigo && (
                <button
                  className="text-base cursor-pointer text-slate-500 w-full hover:text-orange-400 transition-colors"
                  type="button"
                >
                  Esqueci minha senha
                </button>
              )}
            </div>
          </fieldset>
        </form>
      </main>
      
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
