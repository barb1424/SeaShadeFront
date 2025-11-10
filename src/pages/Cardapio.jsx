import Sidebar from "../components/Sidebar";
import HeaderLogged from "../components/HeaderLogged";
import { Search, Plus, Trash, BookText } from "lucide-react"; 
import Modal from "../components/Modal";
import GerenciarReceitaModal from "../components/GerenciarReceitaModal"; 
import apiClient from '../services/apiClient'; 
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 

const Cardapio = () => {
    const [produtos, setProdutos] = useState([]); // Inicia como array vazio
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
    const [termoBusca, setTermoBusca] = useState('');
    const [showModal, setShowModal] = useState(false); 
    const [showModal2, setShowModal2] = useState(false);
    const [showReceitaModal, setShowReceitaModal] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null); 

    const [novoProduto, setNovoProduto] = useState({
        nome: '',
        descricao: '',
        preco: '',
        categoria: 'BEBIDA', 
    });

    const [imagemArquivo, setImagemArquivo] = useState(null);

    const { user } = useAuth(); 
    const quiosqueId = user?.quiosque?.quiosqueId;

    useEffect(() => {
        if (!quiosqueId) {
            setError("ID do quiosque não encontrado. Faça o login novamente.");
            setLoading(false);
            return;
        }

        const fetchProdutos = async () => {
            try {
                const response = await apiClient.get(`/api/quiosques/${quiosqueId}/produtos`);
            
                if (Array.isArray(response.data)) {
                    setProdutos(response.data);
                } else {
                    console.warn("A API de produtos não retornou um array.", response.data);
                    setProdutos([]); 
                }
                
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setError("Não foi possível carregar o cardápio.");
            } finally {
                setLoading(false);
            }
        };

        fetchProdutos();
    }, [quiosqueId]); 

    const todasAsCategorias = Array.isArray(produtos) 
        ? produtos
            .map(item => item.categoria) // Pega todos os valores (ex: "BEBIDA", null, "PORCAO", "")
            .filter(cat => cat)         // 2. Filtra: remove valores null, undefined, ou ""
        : [];

    // 3. Pega apenas os valores únicos e adiciona o "Todos"
    const categorias = ['Todos', ...new Set(todasAsCategorias)];
    const itensFiltrados = Array.isArray(produtos) ? produtos.filter(item => {
        const correspondeCategoria = categoriaSelecionada === 'Todos' || item.categoria === categoriaSelecionada;
        const correspondeBusca = item.nome.toLowerCase().includes(termoBusca.toLowerCase());
        return correspondeCategoria && correspondeBusca;
    }) : []; 
    
   const handleCreateProduto = async (e) => {
        e.preventDefault();
        if (!quiosqueId) {
            setError("ID do quiosque não encontrado para criar o produto.");
            return;
        }
        try {
            const formData = new FormData();
            // Anexa o arquivo de imagem, se existir
            if (imagemArquivo) {
                formData.append('imagem', imagemArquivo);
            }
            // Anexa os dados do produto como uma string JSON
            formData.append('produto', new Blob([JSON.stringify(novoProduto)], { type: 'application/json' }));

            const response = await apiClient.post(
                `/api/quiosques/${quiosqueId}/produtos`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setProdutos(produtosAtuais => [...produtosAtuais, response.data]);
            setShowModal(false);
            setNovoProduto({ nome: '', descricao: '', preco: '', categoria: 'BEBIDA'});
            setImagemArquivo(null); // Limpa o arquivo após o envio
            toast.success("Produto criado com sucesso!");
        } catch (err) {
            console.error("Erro ao criar produto:", err);
            toast.error(err.response?.data?.message || "Falha ao criar o produto.");
        }
    };

    const handleDeletarItem = async () => {
        if (!produtoSelecionado) return; 

        const produtoId = produtoSelecionado.id;
        console.log("Desativando item com ID:", produtoId); 

        try {
            await apiClient.patch(`/api/produtos/${produtoId}/desativar`);
            
            toast.success("Produto removido (desativado) com sucesso!");
            
            setProdutos(produtosAtuais => produtosAtuais.filter(p => p.id !== produtoId));
            
            setShowModal2(false); 
            setProdutoSelecionado(null); 
        } catch (err) {
            console.error("Erro ao desativar produto:", err);
            toast.error(err.response?.data?.message || "Falha ao remover o produto.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setImagemArquivo(files[0]);
        } else {
            setNovoProduto(prevState => ({
            ...prevState,
            [name]: value
        }));
        }
    };




    const handleOpenReceitaModal = (produto) => {
        setProdutoSelecionado(produto);
        setShowReceitaModal(true);
    };

    const handleCloseReceitaModal = () => {
        setShowReceitaModal(false);
        setProdutoSelecionado(null); 
    };

    if (loading) {
        return (
            <div className="text-slate-00 flex h-screen">
                <Sidebar />
                <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
                    <HeaderLogged />
                    <h1 className="text-3xl font-bold mb-6 text-slate-600">Carregando Cardápio...</h1>
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
                    <h1 className="text-3xl font-bold mb-6 text-red-500">{error}</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="text-slate-700 flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9 overflow-y-auto">
                <HeaderLogged hasUndo />
                <h1 className="text-2xl md:text-3xl font-bold text-slate-600">Cardápio</h1>

                {/* Busca */}
                <div className="my-6 flex justify-between w-full gap-3">
                    <div className="relative flex-30 r">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="search"
                            placeholder="Buscar item por nome"
                            className="w-full max-w-90 pl-10 pr-4 py-3 rounded border border-slate-300 bg-white focus:outline-none focus:ring focus:border-blue-500"
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 flex justify-end items-center gap-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
                        >
                            <Plus size={20} /> Adicionar
                        </button>

                    </div>
                </div>

                {/* Botões de Filtro */}
                <div className="mb-6 flex flex-wrap gap-3">
                   {categorias.map((categoria, index) => (
                        <button
                            key={index} // 2. Use 'index' para a key (resolve o aviso)
                            onClick={() => setCategoriaSelecionada(categoria)} // 3. Use 'categoria' para a lógica
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                                    categoriaSelecionada === categoria
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                                                }`}
                                            >
                            {categoria} 
                        </button>
                    ))}
                </div>

                {/* Modal "Novo Produto" */}
                <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                        <div className="p-6">
                        <h3 className="text-2xl font-semibold text-slate-00 mb-7">Adicionar item ao cardápio</h3>
                        
                        <form className="text-lg flex flex-col gap-4" onSubmit={handleCreateProduto}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="nome">Nome</label>
                                <input type="text" name="nome" id="nome" placeholder="Nome do item" required 
                                      className="bg-white p-2 rounded"
                                      value={novoProduto.nome} 
                                      onChange={handleInputChange} />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label htmlFor="imagem">Imagem do Produto</label>
                                <input type="file" name="imagem" id="imagem"
                                    accept="image/png, image/jpeg, image/webp"
                                      className="bg-white p-2 rounded border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                      onChange={handleInputChange} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="descricao">Descrição</label>
                                <textarea name="descricao" id="descricao" placeholder="Descrição do item" 
                                          className="bg-white p-2 rounded"
                                          value={novoProduto.descricao} 
                                          onChange={handleInputChange} />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label htmlFor="imagemUrl">URL da Imagem</label>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <label htmlFor="categoria">Categoria</label>
                                <select name="categoria" id="categoria" required 
                                        className="bg-white p-2 rounded"
                                        value={novoProduto.categoria} 
                                        onChange={handleInputChange}>
                                    <option value="BEBIDA ALCOOLICA">Bebida Alcoólica</option>
                                    <option value="PORCAO">Porção</option>
                                    <option value="BEBIDA">Bebida</option>
                                </select>
                            </div>

                            <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-teal-600 transition">
                                Adicionar Item
                            </button>
                        </form>
                    </div>
                </Modal>

                {/* Modal "Deletar" */}
                <Modal isVisible={showModal2} onClose={() => { setShowModal2(false); setProdutoSelecionado(null); }}> 
                    <div className="p-6">
                        <h3 className="text-xl font-semibold">Confirmar Exclusão</h3>
                        <p className="my-4">Tem certeza que quer excluir o item "{produtoSelecionado?.nome}"?</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowModal2(false); setProdutoSelecionado(null); }} className="bg-slate-300 px-4 py-2 rounded">Cancelar</button>
                            <button onClick={handleDeletarItem} className="bg-red-600 text-white px-4 py-2 rounded">Excluir</button>
                        </div>
                    </div>
                </Modal>

                {/* Lista de Itens (Cardápio) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itensFiltrados.map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-lg shadow p-5 flex flex-col justify-between">
                            <img src={item.imagemUrl || 'url_da_sua_imagem_padrao.jpg'} alt={item.nome} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h2 className="text-lg font-bold mb-2">{item.nome}</h2>
                            <p className="text-slate-600 mb-4">{item.descricao}</p>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">R$ {item.preco.toFixed(2).replace('.', ',')}</span>
                                
                                <div className="flex gap-3"> 
                                    <button 
                                        onClick={() => handleOpenReceitaModal(item)} 
                                        className="text-blue-600 cursor-pointer"
                                        title="Gerenciar Receita"
                                    >
                                        <BookText size="21" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setProdutoSelecionado(item); 
                                            setShowModal2(true); 
                                        }} 
                                        className="text-red-600 cursor-pointer"
                                        title="Excluir Produto"
                                    >
                                        <Trash size="21" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mensagem de filtro sem resultados */}
                {itensFiltrados.length === 0 && (
                    <div className="text-center col-span-full py-10">
                        <p className="text-slate-500">Nenhum item encontrado com os filtros aplicados.</p>
                    </div>
                )}
            </div>
            
            {/* 6. RENDERIZA O MODAL DE RECEITAS (SE ESTIVER ABERTO) */}
            {showReceitaModal && produtoSelecionado && (
                <GerenciarReceitaModal
                    produtoId={produtoSelecionado.id}
                    produtoNome={produtoSelecionado.nome}
                    onClose={handleCloseReceitaModal}
                />
            )}

        </div>
    );
};

export default Cardapio;