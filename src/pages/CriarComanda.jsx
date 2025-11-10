import Sidebar from "../components/Sidebar"
import HeaderLogged from "../components/HeaderLogged"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Clock, CircleQuestionMark, Check, Ban, CircleHelp, ChefHat, X, CheckCheck } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const CriarComanda = () => {
  const { comandaId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- Estados das comandas ---
  const [comanda, setComanda] = useState(null);
  const [cardapio, setCardapio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCardapioModal, setShowCardapioModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantidadeToAdd, setQuantidadeToAdd] = useState(1);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [isSubmittingItem, setIsSubmittingItem] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [inlineSearchTerm, setInlineSearchTerm] = useState('');
  const [showAutocompleteDropdown, setShowAutocompleteDropdown] = useState(false);
  const [submittingItemId, setSubmittingItemId] = useState(null);

  const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

  // Busca de dados 
  const fetchData = async () => {
    if (!comandaId || !quiosqueId) {
      setError("ID da comanda ou quiosque inválido.");
      setLoading(false);
      return;
    }
    try {
      const [comandaResponse, cardapioResponse] = await Promise.all([
        apiClient.get(`/api/comandas/${comandaId}`),
        cardapio.length === 0 ? apiClient.get(`/api/quiosques/${quiosqueId}/produtos`) : Promise.resolve({ data: cardapio })
      ]);
      
      setComanda(comandaResponse.data);
      if (cardapio.length === 0) setCardapio(cardapioResponse.data);
      setError('');
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados da comanda.");
      if (err.response?.status === 404) {
        setError(`Comanda com ID ${comandaId} não encontrada.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Busca inicial de dados
  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      await fetchData(); 
    };

    fetchApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comandaId, user]); 


  // --- FUNÇÃO PARA ADICIONAR ITEM ---
  const handleAddItemClick = async (produto, obs = '') => { 
    setSelectedProduto(produto);
    setIsSubmittingItem(true);
    setError('');
    try {
      await apiClient.post(`/api/comandas/${comandaId}/itens`, {
        produtoId: produto.id,
        quantidade: quantidadeToAdd,
        observacoes: obs 
      });
      await fetchData(); 
        setShowCardapioModal(false);
        setSearchTerm('');
        setQuantidadeToAdd(1);
        setSelectedProduto(null);
        setInlineSearchTerm(''); 
        setObservacoes('');     
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      toast.error(`Falha ao adicionar item: ${err.response?.data?.message || 'Erro desconhecido'}`); 
    } finally {
      setIsSubmittingItem(false);
    }
  };

  // --- FUNÇÃO ENVIAR PARA COZINHA ---
  const handleEnviarCozinha = async () => {
    if (!comanda || comanda.itens?.length === 0) {
      toast.success("Itens enviados para a cozinha!");
      return;
    }
    if (!window.confirm("Enviar itens para a cozinha?")) {
      return;
    }

    setIsSubmittingAction(true);
    setActionError('');
    setError('');
    try {
      const response = await apiClient.patch(`/api/comandas/${comandaId}/enviar-cozinha`);
      setComanda(response.data);
    } catch (err) {
      console.error("Erro ao enviar para cozinha:", err);
      toast.error(err.response?.data?.message || "Falha ao enviar para a cozinha.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // --- FUNÇÕES DE AÇÃO (FINALIZAR / CANCELAR) ---
  const handleFinalizar = async () => {
      setShowFinalizarModal(true);
  };

  const confirmarFinalizacao = async () => {
    setShowFinalizarModal(false); 
    setIsSubmittingAction(true);
    setActionError('');
    setError('');
    try {
      await apiClient.patch(`/api/comandas/${comandaId}/finalizar`);
      toast.success("Comanda finalizada com sucesso!"); 
      navigate('/comandas');
    } catch (err) {
      console.error("Erro ao finalizar comanda:", err);
      const errorMsg = err.response?.data?.message || "Não foi possível finalizar a comanda.";
      toast.error(errorMsg); 
    } finally {
      setIsSubmittingAction(false);
    }
  };


  const handleCancelar = async () => {
    setShowCancelarModal(true);
  };

  const confirmarCancelamento = async () => {
    setShowCancelarModal(false); // Fecha o modal
    setIsSubmittingAction(true);
    setActionError('');
    setError('');
    try {
      await apiClient.patch(`/api/comandas/${comandaId}/cancelar`);
      toast.success("Comanda cancelada com sucesso!"); 
      navigate('/comandas');
    } catch (err) {
      console.error("Erro ao cancelar comanda:", err);
      const errorMsg = err.response?.data?.message || "Não foi possível cancelar a comanda.";
      toast.error(errorMsg); 
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleMarcarEntregue = async (itemId) => {
    setSubmittingItemId(itemId); // Mostra o 'loading' para este item
    // Limpa erros antigos
    setActionError('');
    setError('');

    try {

      await apiClient.patch(`/api/comandas/itens/${itemId}/marcar-entregue`);
      
      // Atualiza a página inteira para mostrar o novo status
      await fetchData(); 
    } catch (err) {
      console.error("Erro ao marcar item como entregue:", err);
      const errorMsg = err.response?.data?.message || "Não foi possível marcar a entrega.";
      setError(errorMsg); // Mostra o erro no box de resumo
    } finally {
      setSubmittingItemId(null); // Esconde o 'loading'
    }
  };

  // Função para o clique no item do dropdown
  const handleAutocompleteAddItemClick = async (produto) => {
    setShowAutocompleteDropdown(false);
    await handleAddItemClick(produto, observacoes);
  };

  const handleInlineSubmit = async (e) => {
    e.preventDefault();

    if (!inlineSearchTerm) {
      toast.error("Digite o nome de um produto.");
      return;
    }

    const produto = cardapio.find(
      p => p.nome.toLowerCase() === inlineSearchTerm.toLowerCase()
    );

    if (!produto) {
      toast.error(`Produto "${inlineSearchTerm}" não encontrado no cardápio.`);
      return;
    }

    await handleAddItemClick(produto, observacoes);
  };

  

  // Filtra cardápio para o modal
  const filteredCardapio = cardapio.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inlineFilteredCardapio = cardapio.filter(p =>
    inlineSearchTerm && p.nome.toLowerCase().includes(inlineSearchTerm.toLowerCase())
  );

  // Formata data/hora
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Data inválida';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return dateTimeString; }
  };

  // Helper para formatar moeda
  const formatCurrency = (value) => {
     if (typeof value !== 'number') {
      value = 0;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcula subtotal
  const subtotal = comanda?.itens?.reduce((sum, item) => sum + (item.precoUnitario * item.quantidade), 0) || 0;

  // --- Variáveis de controle de status ---
  const isComandaAberta = comanda?.status === 'ABERTA';
  const isComandaNaCozinha = comanda?.status === 'NA COZINHA';
  const isComandaEmPreparo = comanda?.status === 'EM PREPARO';
  const isComandaProntaParaEntrega = comanda?.status === 'PRONTO_PARA_ENTREGA';
  
const canEditComanda = isComandaAberta || isComandaProntaParaEntrega; 
  // (Permite finalizar se ABERTA ou PRONTA)
  const canFinalizarComanda = isComandaAberta || isComandaProntaParaEntrega;
  // (Pode cancelar em qualquer estado ativo)
  const canCancelComanda = isComandaAberta || isComandaNaCozinha || isComandaEmPreparo || isComandaProntaParaEntrega;

  // Helper para mostrar o status
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ABERTA':
        return { text: 'Aguardando Pedido', color: 'text-orange-500', Icon: Clock };
      case 'NA_COZINHA':
        return { text: 'Na Cozinha', color: 'text-blue-500', Icon: ChefHat };
      case 'EM_PREPARO':
        return { text: 'Em Preparo', color: 'text-amber-500', Icon: ChefHat };
      case 'PRONTO_PARA_ENTREGA':
        return { text: 'Pronto para Servir', color: 'text-green-500', Icon: Check };
      case 'FECHADA':
        return { text: 'Finalizada', color: 'text-slate-500', Icon: Check };
      case 'CANCELADA':
        return { text: 'Cancelada', color: 'text-red-500', Icon: Ban };
      default:
        return { text: status || 'Indefinido', color: 'text-slate-500', Icon: CircleHelp };
    }
  };
  const statusDisplay = getStatusDisplay(comanda?.status);


  // --- RENDERIZAÇÃO ---
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-xl">Carregando comanda...</p>
    </div>
  );
  
  if (error && !comanda) return (
    <div className="flex h-screen items-center justify-center">
      <p className="p-10 text-red-500 text-xl">{error}</p>
    </div>
  );

  if (!comanda) return (
    <div className="flex h-screen items-center justify-center">
      <p className="p-10 text-xl">Comanda não encontrada.</p>
    </div>
  );

  return (
    <div className="text-slate-600 flex h-screen ">
      <Sidebar />
      <ToastContainer autoClose={3000} hideProgressBar />
      <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9 overflow-y-auto">
        <HeaderLogged hasUndo/>
        
        <main className="flex flex-col lg:flex-row w-full gap-5">
          
          {/* Coluna da Esquerda: Infos e Formulário */}
          <div className="flex flex-col flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Comanda #{comanda.numeroComanda || comanda.id}</h1>
            <div className="flex flex-col gap-3">
              <h2 className="text-lg text-slate-500">{formatDateTime(comanda.dataAbertura)}</h2>
              <div className="flex flex-col font-medium">
                <h3>Guarda-sol: <span className="font-semibold">{comanda.guardaSol?.numero || comanda.guardaSol?.identificacao || '?'}</span></h3>
                <h3>Atendido por: <span className="font-semibold">{comanda.atendente?.nome || user?.name || '?'}</span></h3>
              </div>
            </div>

            <form onSubmit={handleInlineSubmit}>
              <fieldset 
                className="flex max-w-lg flex-col gap-3 my-5" 
                disabled={!canEditComanda || isSubmittingItem || isSubmittingAction}
              >
                <label htmlFor="search-item-inline">
                  Selecionar item (Busca Rápida)
                  <div className="relative w-full"> 
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="search-item-inline"
                      className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 pl-10 pr-5 rounded border border-slate-300 text-slate-900 w-full disabled:bg-slate-100"
                      type="search"
                      placeholder="Digite o nome do produto..."
                      value={inlineSearchTerm}
                      autoComplete="off" 

                      onChange={(e) => {
                        setInlineSearchTerm(e.target.value);
                        setShowAutocompleteDropdown(true); // Mostra o dropdown ao digitar
                      }}
                      onFocus={() => {
                        if (inlineSearchTerm.length > 0) {
                          setShowAutocompleteDropdown(true);
                        }
                      }}
                      onBlur={() => {
                        // Atraso para permitir que o clique no dropdown funcione antes de fechar
                        setTimeout(() => {
                          setShowAutocompleteDropdown(false);
                        }, 200); 
                      }}
                    />

                    {/*  DROPDOWN */}
                    {showAutocompleteDropdown && inlineFilteredCardapio.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {inlineFilteredCardapio.map(produto => (
                          <div
                            key={produto.id}
                            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-slate-100"
                            onMouseDown={() => handleAutocompleteAddItemClick(produto)}
                          >
                            <span className="font-medium">{produto.nome}</span>
                            <span className="text-blue-600 font-bold text-lg">+</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                  </div>
                </label>
                <label htmlFor="quantidade-inline">
                  Quantidade
                  <input
                    id="quantidade-inline"
                    className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 px-4 rounded border border-slate-300 text-slate-900 w-full disabled:bg-slate-100"
                    type="number"
                    min="1"
                    value={quantidadeToAdd}
                    onChange={(e) => setQuantidadeToAdd(Number(e.target.value) || 1)}
                  />
                </label>
                <label htmlFor="observacoes">
                  <textarea 
                    id="observacoes"
                    className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-4 lg:py-3 px-4 rounded border border-slate-300 text-slate-900 w-full disabled:bg-slate-100" 
                    rows="4" 
                    cols="50" 
                    placeholder="Observações (opcional)"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                  ></textarea>
                </label>
                
                <div className="flex justify-between gap-2">
                  <button
                    type="button"
                    className="cursor-pointer shadow-sm bg-slate-600 text-slate-50 font-medium rounded py-2 text-center flex-2 disabled:bg-slate-400"
                    onClick={() => setShowCardapioModal(true)}
                  >
                    Selecionar pelo cardápio
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer shadow-sm bg-blue-600 text-slate-50 font-medium rounded py-2 text-center flex-1 disabled:bg-slate-400"
                  >
                    Adicionar
                  </button>
                </div>
              </fieldset>
            </form>
          </div>

          {/* Coluna da Direita: Itens e Resumo */}
          <div className="flex flex-col md:flex-row gap-5 w-full justify-end flex-2">
            
            {/* Box de Itens */}
            <div className="bg-slate-100 p-6 md:p-10 flex flex-col gap-5 rounded-lg w-full max-w-lg h-[60vh] lg:h-[75vh]">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-2xl">Itens</h2>
                <div className="text-amber-500" title="Itens em amarelo estão em preparo ou pendentes.">
                  <CircleHelp size="18" />
                </div>
              </div>
              <div className="flex font-semibold text-slate-500 px-2">
                <h3 className="flex-3">Produto</h3>
                <h3 className="flex-1 text-center">Valor</h3>
                <h3 className="flex-1 text-right">Ação</h3>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2">
                {comanda?.itens?.length > 0 ? (
                  comanda.itens.map((item) => {
                    
                      // --- Lógica de Status do Item ---
                      let itemClass = "text-slate-600"; 
                      let statusText = item.status; 

                      if (!item.status) {
                           itemClass = "text-slate-400";
                           statusText = "Status Indefinido";
                      } else if (item.status === 'ENTREGUE') {
                          itemClass = "text-slate-400 line-through";
                          statusText = "Entregue";
                      } else if (item.status === 'PRONTO') {
                          itemClass = "text-green-600 font-semibold";
                          statusText = "Pronto p/ Servir";
                      } else if (item.status === 'NA_COZINHA' || item.status === 'EM_PREPARO') {
                          itemClass = "text-blue-500";
                          statusText = "Na Cozinha";
                      } else if (item.status === 'PENDENTE') {
                           itemClass = "text-amber-500";
                           statusText = "Aguardando Envio";
                      }

                      const isCarregando = submittingItemId === item.id;

                    return (
                        // Div da linha inteira
                        <div key={item.id} className={`flex text-lg items-center justify-between border-t py-3 border-slate-300 px-2 ${itemClass}`}>
                            
                            {/* Coluna 1: Produto (Qtd, Nome e Status) */}
                            <div className="flex-3">
                              <p>
                                <span className="font-bold">{item.quantidade}x</span> {item.produtoNome}
                              </p>
                              <p className="text-xs font-semibold uppercase">{statusText}</p>
                            </div>

                            {/* Coluna 2: Valor */}
                            <p className="flex-1 text-right">{formatCurrency(item.precoUnitario * item.quantidade)}</p>

                            {/* Coluna 3: Ação (Botão) */}
                            <div className="flex-1 text-right pl-3">
                              {/* Só mostra o botão se o item estiver PRONTO */}
                              {item.status === 'PRONTO' && (
                                <button
                                  title="Confirmar Entrega"
                                  className="text-blue-600 hover:text-blue-800 disabled:text-slate-300"
                                  onClick={() => handleMarcarEntregue(item.id)}
                                  disabled={isCarregando}
                                >
                                  {isCarregando ? (
                                    <Clock size={20} className="animate-spin" />
                                  ) : (
                                    <CheckCheck size={20} strokeWidth={3} />
                                  )}
                                </button>
                              )}
                            </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-slate-500 py-10">Nenhum item na comanda.</p>
                )}
              </div>
            </div>

            {/* Box de Resumo e Ações */}
            <div className="bg-slate-100 p-6 md:p-10 flex flex-col gap-5 rounded-lg w-full max-w-md max-h-fit">
              <h2 className="font-bold text-2xl">Resumo da comanda</h2>

              {/* Exibe erro da API aqui se houver */}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              
              <div className="flex text-lg justify-between">
                <p>Quantidade de itens</p>
                <p className="font-semibold">{comanda?.itens?.length || 0}</p>
              </div>
              <div className="flex text-lg justify-between">
                <p>Status</p>
                <p className={`font-semibold flex gap-2 items-center ${statusDisplay.color}`}>
                  <statusDisplay.Icon size="18" strokeWidth={3} />{statusDisplay.text}
                </p>
              </div>
              <div className="flex text-lg justify-between">
                <p>Subtotal</p>
                <p className="font-semibold">{formatCurrency(subtotal)}</p>
              </div>

              <div className="flex flex-col gap-3">
                
                {isComandaAberta && comanda.itens?.length > 0 && (
                  <button 
                    className="w-full bg-green-600 hover:bg-green-700 rounded text-slate-50 text-lg font-medium py-3 flex gap-2 justify-center items-center disabled:bg-slate-400"
                    onClick={handleEnviarCozinha}
                    disabled={isSubmittingAction}
                  >
                    <ChefHat size={17} strokeWidth={3}/> 
                    {isSubmittingAction ? 'Enviando...' : 'Enviar para Cozinha'}
                  </button>
                )}

                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-slate-600 hover:bg-slate-700 rounded text-slate-50 text-lg font-medium py-3 flex gap-2 justify-center items-center disabled:bg-slate-400"
                    onClick={handleCancelar}
                    disabled={!canCancelComanda || isSubmittingAction}
                  >
                    <Ban size={15} strokeWidth={3} />Cancelar
                  </button>
                  <button 
                    className="flex-2 bg-blue-600 hover:bg-blue-700 rounded text-slate-50 text-lg font-medium py-3 flex gap-2 justify-center items-center disabled:bg-slate-400"
                    onClick={handleFinalizar}
                    disabled={!canFinalizarComanda || isSubmittingAction}
                  >
                    <Check size="17" strokeWidth={3} /> 
                    {isSubmittingAction ? 'Processando...' : 'Finalizar'}
                  </button>
                </div>
                {actionError && <p className="text-red-500 text-sm mt-2 text-center">{actionError}</p>}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal do Cardápio */}
      {showCardapioModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Selecionar do Cardápio</h3>
              <button onClick={() => setShowCardapioModal(false)} className="text-slate-500 hover:text-slate-800">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <input
                type="search"
                placeholder="Buscar no cardápio..."
                className="inset-shadow-sm focus:ring focus:outline-none focus:border-blue-600 bg-white py-3 px-4 rounded border border-slate-300 text-slate-900 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {filteredCardapio.length > 0 ? (
                filteredCardapio.map(produto => (
                  <div key={produto.id} className="flex justify-between items-center p-3 hover:bg-slate-100 rounded">
                    <div>
                      <p className="font-semibold">{produto.nome}</p>
                      <p className="text-sm text-slate-500">{formatCurrency(produto.preco)}</p>
                    </div>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm disabled:bg-slate-400 min-w-[100px]"
                      onClick={() => handleAddItemClick(produto)}
                      disabled={isSubmittingItem && selectedProduto?.id === produto.id}
                    >
                      {isSubmittingItem && selectedProduto?.id === produto.id ? 'Adic...' : 'Adicionar'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-10">Nenhum produto encontrado.</p>
              )}
            </div>
            <div className="p-4 border-t text-right">
              <button
                className="bg-slate-600 text-white px-5 py-2 rounded hover:bg-slate-700"
                onClick={() => setShowCardapioModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>  
      )}

    {/* Modal de Confirmação FINALIZAR */}
    {showFinalizarModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-xl font-bold">Finalizar Comanda</h3>
            <p className="py-4">Tem certeza que deseja finalizar esta comanda?</p>
          </div>
          <div className="p-4 border-t flex justify-end gap-3">
            <button
              className="bg-slate-600 text-white px-5 py-2 rounded hover:bg-slate-700 disabled:bg-slate-400"
              onClick={() => setShowFinalizarModal(false)}
              disabled={isSubmittingAction}
            >
              Voltar
            </button>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-slate-400"
              onClick={confirmarFinalizacao}
              disabled={isSubmittingAction}
            >
              {isSubmittingAction ? 'Finalizando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal de Confirmação CANCELAR */}
    {showCancelarModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <h3 className="text-xl font-bold text-red-600">Cancelar Comanda</h3>
            <p className="py-4">CUIDADO! Esta ação não pode ser desfeita. Tem certeza que deseja cancelar esta comanda?</p>
          </div>
          <div className="p-4 border-t flex justify-end gap-3">
            <button
              className="bg-slate-600 text-white px-5 py-2 rounded hover:bg-slate-700 disabled:bg-slate-400"
              onClick={() => setShowCancelarModal(false)}
              disabled={isSubmittingAction}
            >
              Voltar
            </button>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 disabled:bg-slate-400"
              onClick={confirmarCancelamento}
              disabled={isSubmittingAction}
            >
              {isSubmittingAction ? 'Cancelando...' : 'Sim, Cancelar'}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  )

}

export default CriarComanda;