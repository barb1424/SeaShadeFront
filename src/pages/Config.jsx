import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext'; 
import apiClient from '../services/apiClient'; // 
import { toast } from 'react-toastify'; 

const Config = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [emailFuncionario, setEmailFuncionario] = useState('');

  // --- Estados da API ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

  // --- FUNÇÃO PARA BUSCAR OS FUNCIONÁRIOS (GET) ---
  const fetchFuncionarios = async () => {
    if (!quiosqueId) {
      toast.error("Erro: ID do Quiosque não encontrado.");
      return;
    }
    try {
      const response = await apiClient.get(`/api/quiosques/${quiosqueId}/atendentes`);
      setFuncionarios(response.data || []);
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
      toast.error(err.response?.data?.message || "Não foi possível carregar os funcionários.");
    }
  };

  // --- CARREGA OS FUNCIONÁRIOS QUANDO A PÁGINA ABRE ---
  useEffect(() => {
    fetchFuncionarios();
  }, [quiosqueId]);

  // --- FUNÇÃO PARA ADICIONAR (POST) ---
  const handleSubmitFuncionario = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    if (!nomeFuncionario || !emailFuncionario) {
        toast.warn("Preencha o nome e o e-mail.");
        return;
    }

    setIsSubmitting(true);
    try {
      // Assumindo a rota da API
      await apiClient.post(`/api/quiosques/${quiosqueId}/atendentes`, {
        nome: nomeFuncionario,
        email: emailFuncionario
      });

      toast.success("Funcionário adicionado!");
      setNomeFuncionario('');
      setEmailFuncionario('');
      fetchFuncionarios(); // Atualiza a lista na tela

    } catch (err) {
      console.error("Erro ao adicionar funcionário:", err);
      toast.error(err.response?.data?.message || "Erro ao adicionar funcionário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FUNÇÃO PARA REMOVER (DELETE) ---
  const removerFuncionario = async (funcionarioId) => {
    // Adiciona uma confirmação
    if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) {
        return;
    }

    try {
      await apiClient.delete(`/api/atendentes/${funcionarioId}`);
      toast.success("Funcionário removido.");
      fetchFuncionarios(); // Atualiza a lista na tela
    } catch (err) {
      console.error("Erro ao remover funcionário:", err);
      toast.error(err.response?.data?.message || "Erro ao remover funcionário.");
    }
  };

  return (
    <div className="text-slate-600 h-screen flex">
      <Sidebar />
      <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
        <h1 className="text-3xl font-bold text-slate-600 mt-15">Central de Colaboradores</h1>


        {/* Cadastro de funcionários */}
        <div className="bg-white my-5">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Cadastro
          </h2>
          <form onSubmit={handleSubmitFuncionario} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome do funcionário"
              value={nomeFuncionario}
              onChange={(e) => setNomeFuncionario(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-1/3"
            />
            <input
              type="email"
              placeholder="E-mail do funcionário"
              value={emailFuncionario}
              onChange={(e) => setEmailFuncionario(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-1/3"
            />
            <button
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSubmitting} // Desabilita o botão ao enviar
            >
              Adicionar 
            </button>
          </form>
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Seus funcionários
          </h2>
          {/* Lista de funcionários */}
          {funcionarios.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-slate-200">
                <thead>
                  <tr className="bg-slate-200">
                    <th className=" px-4 py-2 text-left">Nome</th>
                    <th className=" px-4 py-2 text-left">E-mail</th>
                    <th className=" px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((f) => (
                    <tr key={f.id}> 
                      <td className="px-4 py-2">{f.nome}</td>
                      <td className="px-4 py-2">{f.email}</td>
                      <td className=" px-4 py-2 text-center">
                        <button
                          onClick={() => removerFuncionario(f.id)} // Passe o 'id'
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-slate-500 text-sm">Todas as alterações são salvas automaticamente.</p>
      </div>
    </div>
  );
};

export default Config;