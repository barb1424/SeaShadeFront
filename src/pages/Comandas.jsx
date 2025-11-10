import Sidebar from "../components/Sidebar"
import HeaderLogged from "../components/HeaderLogged"
import Comanda from '../components/Comanda'
import { Clock, ClipboardPenLine } from 'lucide-react' 
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const Pedidos = () => {
    const { user } = useAuth();
    const [comandas, setComandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

    // Função para buscar os dados
    const fetchComandasAtivas = async () => {
        if (!quiosqueId) {
            setError("ID do quiosque não encontrado.");
            setLoading(false);
            return;
        }
        
        try {
            const response = await apiClient.get(`/api/comandas`, {
                params: { 
                    quiosqueId,
                    status: ['ABERTA', 'NA_COZINHA', 'EM_PREPARO', 'PRONTO_PARA_ENTREGA'] 
                }
            });
            setComandas(response.data || []);
        } catch (err) {
            console.error("Erro ao buscar comandas ativas:", err);
            if (loading) {
                setError("Não foi possível carregar as comandas ativas.");
            }
        } finally {
            if (loading) {
                setLoading(false);
            }
        }
    };

    // Busca inicial dos dados
    useEffect(() => {
        fetchComandasAtivas();
    }, [quiosqueId]); 

    // Efeito para ATUALIZAÇÃO AUTOMÁTICA (Polling)
    useEffect(() => {
        // intervalo para rodar a função a cada 15 segundos
        const intervalId = setInterval(() => {
            console.log("Atualizando comandas..."); 
            fetchComandasAtivas();
        }, 15000); // 15 segundos

        return () => clearInterval(intervalId);
    }, [quiosqueId]);

    // Filtrar as comandas em listas separadas
    const comandasAguardando = comandas.filter(
        c => c.status === 'ABERTA'
    );

    const comandasEmAtendimento = comandas.filter(
        c => c.status === 'NA_COZINHA' || c.status === 'EM_PREPARO' || c.status === 'PRONTO_PARA_ENTREGA'
    );


    // Telas de Loading e Erro
    if (loading) {
        return (
            <div className="text-slate-600 flex h-screen">
                <Sidebar />
                <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
                    <HeaderLogged hasUndo /> 
                    <main className="flex h-full items-center justify-center">
                        <p className="text-xl">Carregando comandas...</p>
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
                    <HeaderLogged hasUndo />
                    <main className="flex h-full items-center justify-center">
                        <p className="p-10 text-red-500 text-xl">{error}</p>
                    </main>
                </div>
            </div>
        );
    }

    // Renderizar o Painel de Ação
    return (
        <div className="text-slate-600 flex h-screen">
            <div>
                <Sidebar />
            </div>
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9 overflow-y-auto">
                <HeaderLogged hasUndo /> 
            <div className="flex mb-5 items-center justify-between">
             <h1 className="text-2xl md:text-3xl font-bold">Comandas</h1>
                {/*LINK HISTÓRICO  --- */}
                <div className="flex justify-end ml-3">
                    
                    <Link
                        to="/comandas/more"
                        className="inline-flex items-center gap-2 px-2 py-1 rounded bg-slate-600 text-white transition-all font-medium text-sm md:text-base shadow-sm"
                    >
                        <ClipboardPenLine size={20}/>
                        Ver Histórico
                    </Link>
                </div>
                </div>

                <main className="flex h-full flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold flex gap-2 text-orange-600 items-center"><Clock size="20" strokeWidth={3}/> Aguardando pedido</h2>
                        <span className="font-semibold text-slate-500">({comandasAguardando.length})</span>
                    </div>
                    <div className="w-full flex gap-8 flex-wrap">
                        {comandasAguardando.length > 0 ? (
                            comandasAguardando.map(comanda => (
                                <Comanda key={comanda.id} comanda={comanda} />
                            ))
                        ) : (
                            <p className="text-slate-500 px-2">Nenhuma comanda com pedidos em andamento.</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-10">
                        <h2 className="text-xl md:text-2xl font-bold flex gap-2 text-blue-600 items-center">< ClipboardPenLine size="20" strokeWidth={3}/>Abertas</h2>
                        <span className="font-semibold text-slate-500">({comandasEmAtendimento.length})</span>
                    </div>
                    <div className="w-full flex gap-8 flex-wrap">
                        {comandasEmAtendimento.length > 0 ? (
                            comandasEmAtendimento.map(comanda => (
                                <Comanda key={comanda.id} comanda={comanda} />
                            ))
                        ) : (
                            <p className="text-slate-500 px-2">No momento, nenhuma comanda está sem pedidos em andamento.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Pedidos;
