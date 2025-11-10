import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import HeaderLogged from '../components/HeaderLogged';
import { Plus, Minus, SquarePen } from 'lucide-react';
import Modal from '../components/Modal';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const Estoque = () => {
    // --- ESTADOS ---
    const [itensEstoque, setItensEstoque] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- ESTADOS DE CONTROLE DA UI ---
    const [showModal, setShowModal] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    // --- ESTADOS PARA O MODAL INTELIGENTE ---
    const [isNewItem, setIsNewItem] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        unidadeMedida: 'unidade',
        custoUnitario: '',
        itemEstoqueId: '',
        tipoMovimento: 'ENTRADA',
        quantidade: '',
        motivo: '',
        observacao: ''
    });

    const { user } = useAuth();

    // --- FUNÇÃO PARA BUSCAR OS DADOS DO BACKEND ---
    const fetchData = async () => {
        const quiosqueId = user?.quiosque?.quiosqueId;
        if (!quiosqueId) {
            setError("Quiosque não identificado. Faça login novamente.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [itensResponse, historicoResponse] = await Promise.all([
                apiClient.get(`/api/quiosques/${quiosqueId}/estoque`),
                apiClient.get(`/api/quiosques/${quiosqueId}/estoque/historico`)
            ]);

            setItensEstoque(Array.isArray(itensResponse.data) ? itensResponse.data : []);
            setHistorico(Array.isArray(historicoResponse.data) ? historicoResponse.data : []);

        } catch (err) {
            console.error("Erro ao buscar dados do estoque:", err);
            setError("Não foi possível carregar os dados do estoque.");
            setItensEstoque([]); // Seta array vazio em caso de erro
            setHistorico([]);
        } finally {
            setLoading(false);
        }
    };

    // --- EFEITO PARA BUSCAR OS DADOS NA PRIMEIRA RENDERIZAÇÃO ---
    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // --- FUNÇÕES PARA O MODAL ---
    const openModal = () => {
        setIsNewItem(false);
        setFormData({
            nome: '', descricao: '', unidadeMedida: 'unidade', custoUnitario: '',
            itemEstoqueId: '', tipoMovimento: 'ENTRADA', quantidade: '', motivo: '', observacao: ''
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTipoMovimentoChange = (tipo) => {
        setFormData(prev => ({ ...prev, tipoMovimento: tipo }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const quiosqueId = user?.quiosque?.quiosqueId;

        try {
            if (isNewItem) {
                const payload = {
                    nome: formData.nome,
                    descricao: formData.descricao,
                    unidadeMedida: formData.unidadeMedida,
                    custoUnitario: formData.custoUnitario,
                    quantidade: formData.quantidade,
                    motivo: formData.motivo,
                    observacao: formData.observacao
                };
                await apiClient.post(`/api/quiosques/${quiosqueId}/estoque/novo-com-movimento`, payload);
            } else {
                const payload = {
                    itemEstoqueId: formData.itemEstoqueId,
                    tipoMovimento: formData.tipoMovimento,
                    quantidade: formData.quantidade,
                    motivo: formData.motivo,
                    observacao: formData.observacao
                };
                await apiClient.post(`/api/quiosques/${quiosqueId}/estoque/movimentacoes`, payload);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Erro ao submeter formulário de estoque:", err);
            alert(`Falha na operação: ${err.response?.data?.message || 'Verifique os dados'}`);
        }
    };

    // --- FUNÇÃO PARA DESATIVAR ITEM (SOFT DELETE) ---
    const handleDeleteItem = async (itemEstoqueId) => {
        if (!window.confirm("Tem certeza que deseja desativar este item? Ele sumirá da lista, mas seu histórico será mantido.")) {
            return;
        }
        const quiosqueId = user?.quiosque?.quiosqueId;
        try {
            await apiClient.patch(`/api/quiosques/${quiosqueId}/estoque/${itemEstoqueId}/desativar`);
            setItensEstoque(itensAtuais => itensAtuais.filter(item => item.id !== itemEstoqueId));
        } catch (err) {
            console.error("Erro ao desativar item:", err);
            alert(`Falha ao desativar: ${err.response?.data?.message || 'Tente novamente.'}`);
        }
    };

    // Renderização de loading e erro
    if (loading) { /* ... JSX de loading ... */ }
    if (error) { /* ... JSX de erro ... */ }

    return (
        <div className="text-slate-600 h-screen flex ">
            <Sidebar />
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
                <HeaderLogged hasUndo />
                <h1 className="text-2xl md:text-3xl font-bold mb-5">Estoque</h1>
                <div className=" flex items-end justify-between gap-1">
                    <div className="flex gap-1 h-full">
                        <button className={`rounded-t py-2 px-3 flex items-center font-semibold  cursor-pointer mb-1 text-slate-800 ${showTable ? " bg-slate-200" : "bg-slate-100"}`} onClick={() => setShowTable(true)}>Lista de produtos</button>
                        <button className={`rounded-t py-2 px-3 flex items-center font-semibold cursor-pointer mb-1 text-slate-800 ${!showTable ? " bg-slate-200" : "bg-slate-100 "}`} onClick={() => setShowTable(false)}>Histórico</button>
                    </div>

                    {showTable &&
                        <div className="flex gap-1">
                            <button onClick={() => setShowDelete(!showDelete)} className="shadow-sm rounded p-2 flex bg-slate-500 text-slate-50 cursor-pointer transition-all duration-300 mb-1"><SquarePen /></button>
                            <button onClick={openModal} className="shadow-sm rounded p-2 flex bg-blue-600 text-slate-50 cursor-pointer transition-all duration-300 mb-1"><Plus /></button>
                        </div>}

                    <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-slate-600 mb-5">{isNewItem ? "Criar Novo Item no Estoque" : "Registrar Movimentação"}</h3>
                            <form className="text-lg flex flex-col gap-4" onSubmit={handleFormSubmit}>
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="checkbox" id="isNewItemCheckbox" className="h-4 w-4" checked={isNewItem} onChange={() => setIsNewItem(!isNewItem)} />
                                    <label htmlFor="isNewItemCheckbox" className="text-base cursor-pointer">Criar um novo item</label>
                                </div>

                                {isNewItem ? (
                                    <>
                                        <div className="flex flex-col gap-1"><label>Nome do Item*</label><input type="text" name="nome" required className="bg-white p-2 rounded" value={formData.nome} onChange={handleInputChange} /></div>
                                        <div className="flex flex-col gap-1"><label>Descrição</label><input type="text" name="descricao" className="bg-white p-2 rounded" value={formData.descricao} onChange={handleInputChange} /></div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col gap-1 flex-1"><label>Unidade*</label><input type="text" name="unidadeMedida" placeholder="kg, L, un" required className="bg-white p-2 rounded" value={formData.unidadeMedida} onChange={handleInputChange} /></div>
                                            <div className="flex flex-col gap-1 flex-1"><label>Custo Unitário</label><input type="number" step="0.01" name="custoUnitario" placeholder="R$ 0,00" className="bg-white p-2 rounded" value={formData.custoUnitario} onChange={handleInputChange} /></div>
                                        </div>
                                        <hr />
                                        <h4 className="font-semibold text-center">Primeira Entrada no Estoque</h4>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="itemEstoqueId">Selecione o item (ID ou nome)*</label>
                                            <input placeholder="Digite o ID do item" type="number" name="itemEstoqueId" id="itemEstoqueId" required className="bg-white p-2 rounded" value={formData.itemEstoqueId} onChange={handleInputChange} />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>Tipo de movimento</label>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => handleTipoMovimentoChange('ENTRADA')} className={`flex-1 rounded text-slate-50 ${formData.tipoMovimento === 'ENTRADA' ? "bg-teal-500" : "bg-teal-500/60"}`}>Entrada</button>
                                                <button type="button" onClick={() => handleTipoMovimentoChange('SAIDA')} className={`flex-1 rounded text-slate-50 ${formData.tipoMovimento === 'SAIDA' ? "bg-red-400" : "bg-red-400/60"}`}>Saída</button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex flex-col gap-1"><label htmlFor="quantidade">Quantidade*</label><input type="number" step="0.01" name="quantidade" id="quantidade" required className="bg-white p-2 rounded" value={formData.quantidade} onChange={handleInputChange} /></div>
                                <div className="flex flex-col gap-1"><label htmlFor="motivo">Motivo*</label><input type="text" name="motivo" id="motivo" required className="bg-white p-2 rounded" value={formData.motivo} onChange={handleInputChange} /></div>
                                <div className="flex flex-col gap-1"><label htmlFor="observacao">Observação</label><input type="text" name="observacao" id="observacao" className="bg-white p-2 rounded" value={formData.observacao} onChange={handleInputChange} /></div>

                                <button type="submit" className="cursor-pointer bg-indigo-600 text-slate-50 py-2 text-xl rounded hover:bg-indigo-700">{isNewItem ? "Criar e Adicionar" : "Registrar Movimentação"}</button>
                            </form>
                        </div>
                    </Modal>
                </div>
                <main className="flex-1">
                    <div className="w-full overflow-x-auto overflow-y-auto h-[780px]">
                        {showTable ?
                            <table className="min-w-full rounded-lg table-fixed border-collapse">
                                <thead className="bg-slate-200 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold w-[15%]">Produto (ID)</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold w-[25%]">Descrição</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold w-[20%]">Qtd. em estoque</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold w-[10%]">Valor total</th>
                                        {showDelete && <th className="px-4 py-2 text-center text-slate-800 font-semibold w-[5%]">Ação</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {Array.isArray(itensEstoque) && itensEstoque.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-2">#{item.id}</td>
                                            <td className="px-4 py-2">{item.nome}</td>
                                            <td className="px-4 py-2">{`${item.quantidadeAtual} ${item.unidadeMedida}`}</td>
                                            <td className="px-4 py-2">R$ {(item.quantidadeAtual * (item.custoUnitario || 0)).toFixed(2).replace('.', ',')}</td>
                                            {showDelete && <td className="text-center"><button onClick={() => handleDeleteItem(item.id)} className="text-slate-50 bg-red-600 rounded-full cursor-pointer p-1"><Minus size={16} /></button></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <table className="min-w-full rounded-lg table-fixed border-collapse">
                                <thead className="bg-slate-200 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Mov.</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Produto</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Tipo</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Qtd.</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Data</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Motivo</th>
                                        <th className="px-4 py-2 text-left text-slate-800 font-semibold">Obs.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {Array.isArray(historico) && historico.map((mov) => (
                                        <tr key={mov.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-2">#{mov.id}</td>
                                            <td className="px-4 py-2">{mov.itemEstoque.nome} (#{mov.itemEstoque.id})</td>
                                            <td className="px-4 py-2">{mov.tipoMovimento}</td>
                                            <td className="px-4 py-2">{mov.quantidade}</td>
                                            <td className="px-4 py-2">{new Date(mov.dataMovimento).toLocaleString('pt-BR')}</td>
                                            <td className="px-4 py-2">{mov.motivo}</td>
                                            <td className="px-4 py-2">{mov.observacao}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Estoque;