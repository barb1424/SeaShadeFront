import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; 
import apiClient from '../services/apiClient';

/**
 * Props:
 * - produtoId (Long): O ID do produto que estamos editando.
 * - produtoNome (String): O nome para exibir no título (ex: "Receita para: Pastel").
 * - onClose (Função): A função para fechar o modal.
 */
const GerenciarReceitaModal = ({ produtoId, produtoNome, onClose }) => {
    const { user } = useAuth();
    const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

    // --- Estados ---
    // 1. A receita ATUAL do produto (ex: [{id: 1, nome: "Carne Moída", qtd: 0.1}])
    const [componentes, setComponentes] = useState([]);
    // 2. A lista de TODOS os ingredientes do estoque (para o dropdown)
    const [listaEstoque, setListaEstoque] = useState([]);
    
    // 3. Estados do formulário "Adicionar Ingrediente"
    const [selectedEstoqueId, setSelectedEstoqueId] = useState('');
    const [quantidadeUtilizada, setQuantidadeUtilizada] = useState('');

    // 4. Estados de Loading
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null); // (Guarda o ID do item sendo deletado)

    // --- Funções de API ---

    // Função para buscar os dados do modal (Receita atual + Lista de ingredientes)
    const fetchData = async () => {
        if (!produtoId || !quiosqueId) return;
        setIsLoading(true);
        try {
            const [resComponentes, resEstoque] = await Promise.all([
                // GET /api/produtos/{produtoId}/componentes
                apiClient.get(`/api/produtos/${produtoId}/componentes`),
                // GET /api/quiosques/{quiosqueId}/itens-estoque
                apiClient.get(`/api/quiosques/${quiosqueId}/itens-estoque`)
            ]);
            
            setComponentes(resComponentes.data || []);
            setListaEstoque(resEstoque.data || []);
            
        } catch (err) {
            console.error("Erro ao buscar dados da receita:", err);
            toast.error("Erro ao carregar dados da receita.");
            onClose(); // Fecha o modal se der erro
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handlers (Ações do Usuário) ---

    const handleAddIngrediente = async (e) => {
        e.preventDefault();
        if (!selectedEstoqueId || !quantidadeUtilizada || quantidadeUtilizada <= 0) {
            toast.warn("Selecione um ingrediente e informe uma quantidade válida.");
            return;
        }

        setIsSubmitting(true);
        try {
            // POST /api/produtos/{produtoId}/componentes
            await apiClient.post(`/api/produtos/${produtoId}/componentes`, {
                itemEstoqueId: Number(selectedEstoqueId),
                quantidadeUtilizada: Number(quantidadeUtilizada)
            });
            
            toast.success("Ingrediente adicionado!");
            // Limpa o formulário e recarrega a lista
            setSelectedEstoqueId('');
            setQuantidadeUtilizada('');
            fetchData(); // Recarrega a receita atual
            
        } catch (err) {
            console.error("Erro ao adicionar ingrediente:", err);
            toast.error(err.response?.data?.message || "Erro ao adicionar ingrediente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteIngrediente = async (componenteId) => {
        if (!window.confirm("Remover este ingrediente da receita?")) return;
        
        setIsDeleting(componenteId);
        try {
            // DELETE /api/produtos/componentes/{componenteId}
            await apiClient.delete(`/api/produtos/componentes/${componenteId}`);
            toast.success("Ingrediente removido!");
            fetchData(); // Recarrega a receita atual
            
        } catch (err) {
            console.error("Erro ao remover ingrediente:", err);
            toast.error(err.response?.data?.message || "Erro ao remover ingrediente.");
        } finally {
            setIsDeleting(null);
        }
    };

    // --- Efeito Inicial ---
    // Busca os dados assim que o modal é aberto (quando produtoId muda)
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [produtoId]);


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* 1. Cabeçalho do Modal */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">Receita para: {produtoNome}</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <X size={24} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-10 text-center">
                        <Loader2 className="animate-spin inline-block" />
                        <p>Carregando...</p>
                    </div>
                ) : (
                    <>
                        {/* 2. Lista de Ingredientes Atuais */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <h4 className="text-lg font-semibold mb-2 text-slate-600">Ingredientes Atuais</h4>
                            <div className="flex flex-col gap-2">
                                {componentes.length === 0 && (
                                    <p className="text-slate-500">Nenhum ingrediente cadastrado para este produto.</p>
                                )}
                                {componentes.map(comp => (
                                    <div key={comp.id} className="flex justify-between items-center bg-slate-100 p-3 rounded-md">
                                        <div>
                                            <span className="font-semibold text-slate-800">{comp.nomeIngrediente}</span>
                                            <span className="text-sm text-slate-600 ml-2">({comp.quantidadeUtilizada} {comp.unidadeMedida})</span>
                                        </div>
                                        <button 
                                            className="text-red-500 hover:text-red-700 disabled:text-slate-300"
                                            onClick={() => handleDeleteIngrediente(comp.id)}
                                            disabled={isDeleting === comp.id}
                                        >
                                            {isDeleting === comp.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Formulário "Adicionar Ingrediente" */}
                        <form onSubmit={handleAddIngrediente} className="p-6 border-t bg-slate-50">
                            <h4 className="text-lg font-semibold mb-3 text-slate-600">Adicionar Ingrediente</h4>
                            <div className="flex flex-col md:flex-row gap-3">
                                <select
                                    value={selectedEstoqueId}
                                    onChange={(e) => setSelectedEstoqueId(e.target.value)}
                                    className="border rounded px-3 py-2 w-full md:flex-1"
                                >
                                    <option value="">-- Selecione um ingrediente --</option>
                                    {listaEstoque.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                                
                                <input
                                    type="number"
                                    step="0.01" // Permite decimais
                                    placeholder="Qtd."
                                    value={quantidadeUtilizada}
                                    onChange={(e) => setQuantidadeUtilizada(e.target.value)}
                                    className="border rounded px-3 py-2 w-full md:w-1/4"
                                />
                                
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                    Adicionar
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default GerenciarReceitaModal;