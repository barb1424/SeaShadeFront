import Sidebar from "../components/Sidebar"
import HeaderLogged from "../components/HeaderLogged"
import { Check, Ban, CircleHelp, Filter, Search, Calendar, ZoomIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

// --- FUNÇÕES AUXILIARES DE FORMATAÇÃO ---

// Formata DATA
const formatDate = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch (e) { return '-'; }
};

// Formata HORA
const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
        const date = new Date(dateTimeString);
        return date.toLocaleString('pt-BR', {
            hour: '2-digit', minute: '2-digit'
        });
    } catch (e) { return '-'; }
};

// --- Helper de Status 
const getStatusDisplay = (status) => {
    switch (status) {
        case 'FECHADA':
            // Pílula verde 
            return { text: 'Concluída', className: 'bg-green-300 text-slate', Icon: Check };
        case 'CANCELADA':
            // Pílula vermelha
            return { text: 'Cancelada', className: 'bg-red-500 text-white', Icon: Ban };
        default:
            //Gualquer outro status
            return { text: status || 'Indefinido', className: 'bg-slate-200 text-slate-800', Icon: CircleHelp };
    }
};

// --- COMPONENTE PRINCIPAL (Histórico) ---

const TodosPedidos = () => { 
    const { user } = useAuth();
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

    useEffect(() => {
        if (!quiosqueId) {
            setError("ID do quiosque não encontrado.");
            setLoading(false);
            return;
        }

        const fetchComandasHistorico = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await apiClient.get(`/api/comandas`, {
                    params: { 
                        quiosqueId,
                        status: ['FECHADA', 'CANCELADA'] 
                    } 
                });
                
                const comandasOrdenadas = (response.data || []).sort((a, b) => 
                    new Date(b.dataFechamento || b.dataAbertura) - new Date(a.dataFechamento || a.dataAbertura)
                );
                setComandas(comandasOrdenadas);
                console.log('DADOS BRUTOS DA API:', response.data);

            } catch (err) {
                console.error("Erro ao buscar histórico de comandas:", err);
                setError("Não foi possível carregar o histórico.");
            } finally {
                setLoading(false);
            }
        };

        fetchComandasHistorico();
    }, [quiosqueId]); 

    // Telas de Loading e Erro 
    if (loading) {
        return (
            <div className="text-slate-600 flex h-screen">
                <Sidebar />
                <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
                    <HeaderLogged hasUndo/>
                    <main className="flex h-full items-center justify-center">
                        <p className="text-xl">Carregando histórico...</p>
                    </main>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="text-slate-600 flex h-screen">
                <Sidebar />
                <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
                    <HeaderLogged hasUndo/>
                    <main className="flex h-full items-center justify-center">
                        <p className="p-10 text-red-500 text-xl">{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="text-slate-600 flex h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9 overflow-y-auto">
                <HeaderLogged hasUndo/>
            
                <main className="flex h-full flex-col gap-5">
                    
                    {/* Título */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                            Finalizadas
                        </h2>
                    </div>

                    {/* ---  Barra de Filtros --- */}
                    <div className="flex justify-end ">
                        <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-lg shadow-sm">
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700">
                                <Filter size={16} />
                                Filtros  
                            </button>
                            <input type="text" placeholder="ID" className="px-3 py-2 text-sm bg-white rounded-4xl w-24" />
                            <input type="text" placeholder="Status" className="px-3 py-2 text-sm  bg-white  rounded-4xl w-32" />
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="dd/mm/aaaa"
                                    className="px-3 py-2 text-sm bg-white text-blue-700 border border-slate-300 rounded-4xl w-35 pr-11" 
                                />
                                <Calendar 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black" 
                                    size={16} 
                                />
                            </div>
                            <button className="px-5 py-2 text-sm font-medium text-white bg-blue-700 rounded-4xl hover:bg-blue-900">
                                Aplicar
                            </button>
                        </div>
                    </div>

                    
                    {/* --- Tabela) --- */}
                    <table className="min-w-full divide-y divide-slate-200  shadow-lg overflow-hidden border border-slate-200">
                        <thead className="bg-slate-800 text-slate-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Nº da Comanda</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Guarda-sol</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">Horário</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {comandas.length > 0 ? (
                                comandas.map(comanda => {
                                    const statusDisplay = getStatusDisplay(comanda.status);
                                    const data = comanda.dataFechamento || comanda.dataAbertura;
                                    
                                    return (
                                        <tr key={comanda.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-500" >#{comanda.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-slate-800">#{String(comanda.numeroComanda).padStart(3, '0')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600">{comanda.guardaSol?.identificacao || '?'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-11 py-2 text-xs font-medium ${statusDisplay.className}`}>
                                                    {statusDisplay.text}
                                                    <statusDisplay.Icon size={14} strokeWidth={3} />
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{formatDate(data)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{formatTime(data)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-blue-600">
                                                <ZoomIn 
                                                    size={18} 
                                                    className="hover:opacity-70 cursor-pointer inline-block"
                                                    title="Ver detalhes"
                                                    onClick={() => navigate(`/comandas/${comanda.id}`)} 
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-slate-500 py-10">
                                        Nenhuma comanda encontrada no histórico.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    )
}

export default TodosPedidos;