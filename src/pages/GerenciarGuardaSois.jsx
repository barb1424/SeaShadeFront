import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal'
import { Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';

const GerenciarGuardaSois = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [guardaSois, setGuardaSois] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para os Modais
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Estados para os formulários
    const [novaIdentificacao, setNovaIdentificacao] = useState('');
    const [editIdentificacao, setEditIdentificacao] = useState('');
    const [editingGuardaSol, setEditingGuardaSol] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

    // --- FUNÇÃO PARA BUSCAR OS GUARDA-SÓIS ---
    const fetchGuardaSois = async () => {
        if (!quiosqueId) {
            setError("Quiosque não identificado. Faça login novamente.");
            setLoading(false);
            return;
        }
        try {
            const response = await apiClient.get(`/api/quiosques/${quiosqueId}/guardasois`);
            setGuardaSois(response.data);
            setError(''); // Limpa erro se a busca for bem-sucedida
        } catch (err) {
            console.error("Erro ao buscar guarda-sóis:", err);
            setError("Não foi possível carregar os guarda-sóis.");
        } finally {
            setLoading(false);
        }
    };

    // --- EFEITO PARA BUSCAR DADOS AO CARREGAR A PÁGINA ---
    useEffect(() => {
        setLoading(true);
        if (user && quiosqueId) {
            fetchGuardaSois();
        } else if (user && !quiosqueId) {
            setError("Quiosque não identificado. Faça login novamente.");
            setLoading(false);
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, quiosqueId]);

    // --- FUNÇÃO PARA CRIAR GUARDA-SOL ---
    const handleCriarGuardaSol = async (e) => {
        e.preventDefault();
        if (!novaIdentificacao.trim()) {
            alert("Por favor, insira uma identificação para o guarda-sol.");
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const response = await apiClient.post(`/api/quiosques/${quiosqueId}/guardasois`, {
                identificacao: novaIdentificacao
            });
            setGuardaSois(atuais => [...atuais, response.data]); // Adiciona na lista
            setShowAddModal(false);
            setNovaIdentificacao('');
        } catch (err) {
            console.error("Erro ao criar guarda-sol:", err);
            setError(`Falha ao criar: ${err.response?.data?.message || 'Erro desconhecido'}`);
            // Mantém o modal aberto para mostrar o erro ou corrigir
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- FUNÇÃO PARA ABRIR MODAL DE EDIÇÃO ---
    const openEditModal = (guardaSol) => {
        setEditingGuardaSol(guardaSol);
        setEditIdentificacao(guardaSol.identificacao);
        setError(''); // Limpa erros ao abrir o modal
        setShowEditModal(true);
    };

    // --- FUNÇÃO PARA ATUALIZAR (EDITAR) ---
    const handleAtualizarGuardaSol = async (e) => {
        e.preventDefault();
        if (!editIdentificacao.trim() || !editingGuardaSol) return;
        setIsSubmitting(true);
        setError('');
        try {
            const response = await apiClient.put(
                `/api/quiosques/${quiosqueId}/guardasois/${editingGuardaSol.id}`,
                { identificacao: editIdentificacao }
            );
            setGuardaSois(atuais => atuais.map(gs =>
                gs.id === editingGuardaSol.id ? response.data : gs
            )); // Atualiza na lista
            setShowEditModal(false);
            setEditingGuardaSol(null);
        } catch (err) {
            console.error("Erro ao atualizar guarda-sol:", err);
            setError(`Falha ao atualizar: ${err.response?.data?.message || 'Verifique a identificação'}`);
            // Mantém o modal aberto
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- FUNÇÃO PARA DESATIVAR (SOFT DELETE) ---
    const handleDesativarGuardaSol = async (id) => {
        if (!window.confirm("Tem certeza que deseja desativar este guarda-sol? Ele sumirá da lista, mas poderá ser reativado futuramente.")) {
            return;
        }
        setError('');
        try {
            await apiClient.patch(`/api/quiosques/${quiosqueId}/guardasois/${id}/desativar`);
            setGuardaSois(atuais => atuais.filter(gs => gs.id !== id)); // Remove da lista
        } catch (err) {
            console.error("Erro ao desativar guarda-sol:", err);
            setError(`Falha ao desativar: ${err.response?.data?.message || 'Tente novamente.'}`);
        }
    };

    // --- RENDERIZAÇÃO ---
    if (loading) {
        return <div className="p-10">Carregando guarda-sóis...</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            {/* Cabeçalho */}
            <div className="flex items-center mb-8">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded hover:bg-slate-200" title="Voltar">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold text-blue-600">Gerenciar Guarda-sóis</h1>
            </div>

            {/* Mensagem de Erro Geral */}
            {error && !showAddModal && !showEditModal && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>}

            {/* Botão para Adicionar */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => { setShowAddModal(true); setError(''); }} // Limpa erro ao abrir modal
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
                >
                    <Plus size={20} /> Adicionar
                </button>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Identificação
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status Atual
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {guardaSois.map((gs) => (
                            <tr key={gs.identificacao}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
                                    {gs.identificacao}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center relative">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${gs.status === 'LIVRE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {gs.status}
                                    </span>
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-800 cursor-pointer"
                                        onClick={() => handleDesativarGuardaSol(gs.id)}>
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {guardaSois.length === 0 && (
                            <tr><td colSpan="2" className="text-center py-4 text-gray-500">Nenhum guarda-sol cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Adicionar */}
            <Modal isVisible={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Novo Guarda-sol</h3>
                    {/* Exibe erro específico do modal aqui */}
                    {error && showAddModal && <p className="text-red-500 mb-4 bg-red-100 p-2 rounded text-sm">{error}</p>}
                    <form onSubmit={handleCriarGuardaSol}>
                        <div className="mb-4">
                            <label htmlFor="identificacaoAdd" className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                            <input type="number" id="identificacaoAdd" value={novaIdentificacao} onChange={(e) => setNovaIdentificacao(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: 20" required />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Editar */}
            <Modal isVisible={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Editar Guarda-sol</h3>
                    {editingGuardaSol && (<p className='text-sm text-gray-500 mb-4'>Editando Guarda-sol ID: {editingGuardaSol.id}</p>)}
                    {/* Exibe erro específico do modal aqui */}
                    {error && showEditModal && <p className="text-red-500 mb-4 bg-red-100 p-2 rounded text-sm">{error}</p>}
                    <form onSubmit={handleAtualizarGuardaSol}>
                        <div className="mb-4">
                            <label htmlFor="editIdentificacao" className="block text-sm font-medium text-gray-700 mb-1">Nova Identificação*</label>
                            <input type="text" id="editIdentificacao" value={editIdentificacao} onChange={(e) => setEditIdentificacao(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">Cancelar</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default GerenciarGuardaSois;


