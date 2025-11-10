import Sidebar from "../components/Sidebar"
import HeaderLogged from "../components/HeaderLogged"
import IconList from "../components/IconList"
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react'
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const NovoPedido = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [guardaSois, setGuardaSois] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedGuardaSolId, setSelectedGuardaSolId] = useState(null);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mostrarInput, setMostrarInput] = useState(false);

    const fetchGuardaSois = async () => {
        const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;
        if (!quiosqueId) {
            setError("Quiosque não identificado."); setLoading(false); return;
        }
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/quiosques/${quiosqueId}/guardasois`);
            setGuardaSois(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (err) {
            console.error("Erro ao buscar guarda-sóis:", err);
            setError("Não foi possível carregar os guarda-sóis.");
        } finally {
            setLoading(false);
        }
    };

    // --- EFEITO PARA BUSCAR DADOS AO CARREGAR ---
    useEffect(() => {
        if (user) {
            fetchGuardaSois();
        }
    }, [user]);

    // --- HANDLERS ---
    const handleGuardaSolClick = (guardaSol) => {
        if (guardaSol.status === 'LIVRE') {
            setSelectedGuardaSolId(guardaSol.id);
            setError('');
        } else {
            setError(`Guarda-sol ${guardaSol.identificacao} está ocupado.`);
            setSelectedGuardaSolId(null); 
        }
    };

    const handleCriarComanda = async (e) => {
        e.preventDefault();
        if (!selectedGuardaSolId) {
            setError("Por favor, selecione um guarda-sol disponível na grade.");
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const response = await apiClient.post('/api/comandas', {
                guardaSolId: selectedGuardaSolId
                // TODO: Adicionar 'observacoes' se o backend aceitar
            });
            console.log("Comanda criada:", response.data);
            navigate(`/comandas/${response.data.id}`); // Ajuste a rota de destino
        } catch (err) {
            console.error("Erro ao criar comanda:", err);
            setError(err.response?.data?.message || "Falha ao criar comanda.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- VALORES CALCULADOS ---
    const total = guardaSois.length;
    const disponiveis = guardaSois.filter(g => g.status === 'LIVRE').length;
    const ocupados = total - disponiveis;
    const selectedGuardaSolIdentificacao = guardaSois.find(g => g.id === selectedGuardaSolId)?.identificacao;


    // --- RENDERIZAÇÃO ---
    if (loading && !guardaSois.length) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Carregando guarda-sóis...</p>
    </div>
  );
}

if (error && !guardaSois.length) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-red-500">{error}</p>
      {/*  adicionar um botão para tentar novamente aqui */}
    </div>
  );
}

    return(
        <div className="text-slate-600 flex h-screen ">
            <Sidebar/>
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
            <HeaderLogged hasUndo link="/comandas"></HeaderLogged>
            <main className="flex h-full flex-col lg:flex-row gap-10">
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold">Criar Comanda</h1>
                    <form onSubmit={handleCriarComanda}>
                        <fieldset className="text-lg flex flex-2 flex-col gap-3 my-5">
                         <label>
                            <input
                            className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 px-5 rounded border border-slate-300 text-slate-900 w-full" 
                            type="text"
                            readOnly
                            value={user?.name || 'Carregando...'}
                            placeholder="Atendente"/>
                         </label>
                        <label className="flex justify-between items-center ">
                                <span className="flex items-center">Para viagem</span>
                                <input 
                                    type="checkbox"
                                    className="transform scale-123"
                                    checked={mostrarInput}
                                    onChange={() => setMostrarInput(!mostrarInput)}
                                 />
                         </label>
                         {!mostrarInput &&
                         <label>
                            
                            <input
                            className=" inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 px-5 rounded border border-slate-300 text-slate-900 w-full" 
                            type="text" 
                            readOnly
                            value={selectedGuardaSolIdentificacao ? `#${selectedGuardaSolIdentificacao}` : 'Selecione o guarda-sol na grade'}
                            placeholder="Número do guarda-sol"/>
                         </label>
                            }

                         

                         <label>
                            <textarea 
                            className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 px-5 rounded border border-slate-300 text-slate-900 w-full" 
                            rows="4" cols="50" 
                            placeholder="Observações (opcional)"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            ></textarea>
                         </label>

                         {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                              
                            <button
                                type="submit"
                                disabled={isSubmitting || !selectedGuardaSolId}
                                className="text-lg cursor-pointer shadow-sm bg-blue-600 text-slate-50 font-medium rounded py-2 text-center">
                                {isSubmitting ? 'Criando...' : 'Confirmar'}
                            </button>
                        </fieldset>
                    </form>
                </div>
               <div className="flex flex-col gap-5 flex-1">
                    {/* Título */}
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-600">
                        Seus Guarda-sóis
                    </h2>

                    {/* Indicadores */}
                    <div className="flex flex-wrap gap-3 items-center">
                        
                        <div className="bg-slate-50 rounded-lg px-3 py-1 shadow-sm text-slate-800 text-sm md:text-base">
                        Total: {total}
                        </div>
                        <div className="bg-green-100 rounded-lg px-3 py-1 shadow-sm text-green-800 text-sm md:text-base">
                        Disponíveis: {disponiveis}
                        </div>
                        <div className="bg-red-100 rounded-lg px-3 py-1 shadow-sm text-red-800 text-sm md:text-base">
                        Ocupados: {ocupados}
                        </div>
                        <div className="flex items-center">
                            <Link to="/config/guardasois" title="Gerenciar Guarda-sóis"><Settings /></Link>
                        </div> 
                    </div>

                    {/* Lista de ícones */}
                    <div className="bg-slate-50 shadow rounded-lg md:p-4 p-2 max-h-80 overflow-y-auto">
                    <IconList 
                        guardaSois={guardaSois}
                        onGuardaSolClick={handleGuardaSolClick}
                        selectedGuardaSolId={selectedGuardaSolId}
                    />
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
}
export default NovoPedido;