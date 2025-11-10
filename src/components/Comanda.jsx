import { Clock, ZoomIn, ClipboardPenLine, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Função para calcular o tempo passado
function calculateTimeAgo(startTime) {
    if (!startTime) return ''; 

    const start = new Date(startTime);
    // data/hora atual do navegador
    const now = new Date(); 
    
    // Diferença em milissegundos
    const diffMs = now.getTime() - start.getTime(); 
    // Converte para minutos e arredonda
    const diffMins = Math.round(diffMs / 60000); 

    if (diffMins < 1) return 'agora';
    if (diffMins === 1) return 'há 1 min';
    return `há ${diffMins} min`;
}

const Comanda = ({ comanda }) => {

    const {
        id,
        numeroComanda,
        guardaSol,
        status,
        itens = [],
        dataAbertura
    } = comanda;

    let statusDisplay = {
        text: 'Em Preparo',
        color: 'bg-sky-500', 
        Icon: ClipboardPenLine
    };

    if (status === 'ABERTA') {
        statusDisplay = {
            text: 'Aguardando pedido',
            color: 'bg-orange-400', // Laranja
            Icon: Clock
        };
    } else if (status === 'PRONTO_PARA_ENTREGA') {
        statusDisplay = {
            text: 'Pronto para Servir',
            color: 'bg-green-500', // Verde
            Icon: Check 
        };
    }

    const formatCurrency = (value) => {
        return (Number(value) || 0).toFixed(2).replace('.', ',');
    };
    
    // Calcula o total localmente
    const valorTotal = itens.reduce((acc, item) => {
        const preco = item.precoUnitario || 0;
        const qt = item.quantidade || 0;
        return acc + (preco * qt);
    }, 0);

    const [timeAgo, setTimeAgo] = useState(() => calculateTimeAgo(dataAbertura));

    useEffect(() => {
        // Define o tempo inicial
        setTimeAgo(calculateTimeAgo(dataAbertura));

        // Define um intervalo para atualizar o timer a cada 60 segundos
        const intervalId = setInterval(() => {
            setTimeAgo(calculateTimeAgo(dataAbertura));
        }, 60000); // 60000 ms = 1 minuto

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(intervalId);
    }, [dataAbertura]); 


    return (
        <Link 
            to={`/comandas/${id}`} 
            className="bg-slate-50 rounded-lg min-w-49 md:min-w-60 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        >
            <div className="bg-slate-800 px-3 py-3 rounded-t-lg flex justify-between text-slate-300 text-sm items-center">
                <p className="font-medium text-center text-xl text-slate-50">#{numeroComanda || id}</p>
                <p>Guarda-Sol {guardaSol?.identificacao || guardaSol?.numero || '?'}</p> 
            </div>
            <div className={`text-center py-1 px-2 ${statusDisplay.color}`}>
                <p className="text-slate-50 font-medium flex items-center justify-center gap-2 text-sm md:text-base">
                    <statusDisplay.Icon size={16} strokeWidth={3} />
                    {statusDisplay.text}
                    <span className="font-normal opacity-90">({timeAgo})</span>
                </p> 
            </div>
            
            <div className="flex font-semibold bg-slate-200 text-center py-1">
                <p className="flex-1">Qt.</p>
                <p className="flex-5">Item</p>
                <p className="flex-2">R$</p>
            </div>
            <div className="overflow-y-auto h-35 md:h-50">
                {itens.length > 0 ? ( 
                    itens.map((item, index) => {
                        const nome = item.produtoNome || 'Produto removido';
                        const preco = item.precoUnitario || 0;
                        const qt = item.quantidade || 0;
                        const precoTotalLinha = qt * preco;

                        let itemClassName = "text-slate-600"; // Cor padrão
                            
                            // Se o item foi entregue, fica cinza e riscado
                            if (item.status === 'ENTREGUE') {
                                itemClassName = "text-slate-400 line-through";
                            }
                            // (Opcional) 
                            // else if (item.status === 'PRONTO') {
                            //     itemClassName = "text-green-600 font-semibold";
                            // }

                        return (
                            <div key={item.id || index } className={`flex text-center py-2 border-b border-slate-200 ${itemClassName}`}>
                                    <p className='flex-1'>{qt}</p>
                                    <p className='flex-5 truncate px-1' title={nome}>{nome}</p>
                                    <p className='flex-2'>{formatCurrency(precoTotalLinha)}</p>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center text-slate-500 p-4">Nenhum item lançado.</p>
                )}
            </div>
            <div className="flex font-semibold bg-slate-200 px-3 py-1 rounded-b-lg justify-between items-center">
                <p>Total: R$ {formatCurrency(valorTotal)}</p>
                <ZoomIn size="20" />
            </div>
        </Link> 
    );
};

export default Comanda;