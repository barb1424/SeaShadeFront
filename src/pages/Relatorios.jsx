import Sidebar from "../components/Sidebar";
import HeaderLogged from "../components/HeaderLogged"
import { TrendingUp, BarChart as BarIcon, PieChart, Activity, Users, List } from "lucide-react"; 
import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  AreaChart, Area,
  ComposedChart, ResponsiveContainer
} from "recharts";
import { useAuth } from '../context/AuthContext'; 
import apiClient from '../services/apiClient'; 

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#8b5cf6"];

const Relatorios = () => {
  // --- 1. Estados ---
  const [vendasDiarias, setVendasDiarias] = useState([]);
  const [faturamentoMensal, setFaturamentoMensal] = useState([]);
  const [receitaDespesa, setReceitaDespesa] = useState([]);
  const [vendasCompras, setVendasCompras] = useState([]);
  const [pedidosPorFuncionario, setPedidosPorFuncionario] = useState([]);
  const [pedidosMensais, setPedidosMensais] = useState([]); 
  const [nomesAtendentes, setNomesAtendentes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

  // --- 2. Busca os dados na API  ---
  useEffect(() => {
  	if (!quiosqueId) {
  	  setError("ID do Quiosque não encontrado.");
  	  setLoading(false);
  	  return;
  	}

  	const fetchRelatorios = async () => {
  	  setLoading(true);
  	  setError('');
  	  try {
  	    const anoAtual = new Date().getFullYear();

  	    const [
  	      resVendasDiarias,
  	      resFaturamento,
  	      resReceitaDespesa,
  	      resVendasCompras,
  	      resPedidosFuncMensal, 
          resPedidosMensais 
  	    ] = await Promise.all([
  	      apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/vendas-diarias`, { params: { dias: 7 } }),
  	      apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/faturamento-mensal`, { params: { ano: anoAtual } }),
  	      apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/receita-despesa-mensal`, { params: { ano: anoAtual } }),
  	      apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/vendas-compras-mensal`, { params: { ano: anoAtual } }),
  	      apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/pedidos-por-atendente-mensal`, { params: { ano: anoAtual } }),
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/pedidos-mensais`, { params: { ano: anoAtual } }) 
  	    ]);

  	    setVendasDiarias(resVendasDiarias.data);
  	    setFaturamentoMensal(resFaturamento.data);
  	    setReceitaDespesa(resReceitaDespesa.data);
  	    setVendasCompras(resVendasCompras.data);
  	    setPedidosPorFuncionario(resPedidosFuncMensal.data); 
        setPedidosMensais(resPedidosMensais.data); 

  	    if (resPedidosFuncMensal.data && resPedidosFuncMensal.data.length > 0) { 
  	      const atendenteKeys = Object.keys(resPedidosFuncMensal.data[0]).filter(key => key !== 'mes');
  	      setNomesAtendentes(atendenteKeys);
  	    }

  	  } catch (err) {
  	    console.error("Erro ao buscar relatórios:", err);
  	    setError("Não foi possível carregar os relatórios.");
  	  } finally {
  	    setLoading(false);
  	  }
  	};

  	fetchRelatorios();
  }, [quiosqueId]);


  // --- 3. Telas de Loading e Erro (Sem mudança) ---
  if (loading || error) {
  	// ... (código de loading/error) ...
    return (
        <div className="text-slate-800 flex min-h-screen">
          <Sidebar className="w-[250px]" />

          <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
  <HeaderLogged hasUndo/>
            <h1 className="text-3xl font-bold mb-8 text-slate-600">Relatórios</h1>
            {loading && <p className="text-lg">Carregando relatórios...</p>}
            {error && <p className="text-lg text-red-500">{error}</p>}
          </div>
        </div>
    );
  }

  return (
  	<div className="text-slate-800 flex min-h-screen">
  	  <Sidebar className="w-[250px]" />

  	  <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
  <HeaderLogged hasUndo/>
  	    <h1 className="text-3xl font-bold mb-8 text-slate-600">Relatórios</h1>

  	    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  	      {/* Vendas Totais Diárias */}
  	      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
  	        {/* ... (código do gráfico) ... */}
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <TrendingUp size={20} />
              <h2 className="text-xl font-semibold">Vendas Diárias (Últimos 7 dias)</h2>
            </div>
    	        <ResponsiveContainer width="100%" height="100%">
    	          <LineChart data={vendasDiarias}>
    	            <CartesianGrid strokeDasharray="3 3" />
    	            <XAxis dataKey="diaSemana" /> 
    	            <YAxis />
    	            <Tooltip />
    	            <Line type="monotone" dataKey="quantidade" stroke="#3b82f6" strokeWidth={2} /> 
    	          </LineChart>
    	        </ResponsiveContainer>
  	      </div>

  	      {/* Faturamento por Mês */}
  	      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
  	        {/* ... (código do gráfico) ... */}
            <div className="flex items-center gap-3 mb-4 text-blue-600">
      	          <BarIcon size={20} />
      	          <h2 className="text-xl font-semibold">Faturamento por Mês</h2>
      	        </div>
    	        <ResponsiveContainer width="100%" height="100%">
    	          <BarChart data={faturamentoMensal}>
    	            <CartesianGrid strokeDasharray="3 3" />
    	            <XAxis dataKey="mes" /> 
    	            <YAxis />
    	            <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
    	            <Bar dataKey="faturamento" fill="#10b981" /> 
    	          </BarChart>
    	        </ResponsiveContainer>
  	      </div>

  	      {/* Receita x Despesa */}
  	      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
  	        {/* ... (código do gráfico) ... */}
            <div className="flex items-center gap-3 mb-4 text-blue-600">
      	          <PieChart size={20} />
      	          <h2 className="text-xl font-semibold">Receita x Despesa</h2>
      	        </div>
    	        <ResponsiveContainer width="100%" height="100%">
    	          <AreaChart data={receitaDespesa}>
    	            <CartesianGrid strokeDasharray="3 3" />
    	            <XAxis dataKey="mes" /> 
    	            <YAxis />
    	            <Tooltip formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
  	            <Area type="monotone" dataKey="receita" stackId="1" stroke="#3b82f6" fill="#3b82f6" /> 
  	            <Area type="monotone" dataKey="despesa" stackId="1" stroke="#ef4444" fill="#ef4444" /> 
  	          </AreaChart>
  	        </ResponsiveContainer>
  	      </div>

  	      {/* Vendas x Compras */}
  	      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
  	        {/* ... (código do gráfico) ... */}
            <div className="flex items-center gap-3 mb-4 text-blue-600">
    	          <Activity size={20} />
    	          <h2 className="text-xl font-semibold">Vendas x Compras</h2>
    	        </div>
  	        <ResponsiveContainer width="100%" height="100%">
  	          <ComposedChart data={vendasCompras}>
  	            <CartesianGrid strokeDasharray="3 3" />
  	            <XAxis dataKey="mes" /> 
  	            <YAxis />
  	            <Tooltip />
  	            <Legend />
  	            <Bar dataKey="vendas" barSize={20} fill="#3b82f6" /> 
  	            <Line type="monotone" dataKey="compras" stroke="#f59e0b" strokeWidth={2} /> 
  	          </ComposedChart>
  	        </ResponsiveContainer>
  	      </div>

  	      {/* Pedidos Atendidos por Funcionário */}
  	      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
  	        {/* ... (código do gráfico) ... */}
            <div className="flex items-center gap-3 mb-4 text-blue-600">
    	          <Users size={20} />
  	          <h2 className="text-xl font-semibold">Pedidos Atendidos por Funcionário (Mensal)</h2>
  	        </div>
  	        <ResponsiveContainer width="100%" height="100%">
  	          <LineChart data={pedidosPorFuncionario}>
  	            <CartesianGrid strokeDasharray="3 3" />
  	            <XAxis dataKey="mes" />
  	            <YAxis />
  	            <Tooltip />
  	            <Legend />
  	            {nomesAtendentes.map((nome, index) => (
  	              <Line 
  	                key={nome}
  	                type="monotone" 
  	                dataKey={nome} 
  	                stroke={COLORS[index % COLORS.length]} 
  	                strokeWidth={2} 
  	              />
  	            ))}
  	          </LineChart>
  	        </ResponsiveContainer>
  	      </div>
          
          {/* --- 5. GRÁFICO "PEDIDOS POR MÊS"  --- */}
          <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-80">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <List size={20} />
              <h2 className="text-xl font-semibold">Total de Pedidos por Mês</h2>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pedidosMensais}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
  	            <Legend />
  	            <Bar dataKey="quantidade" fill="#8884d8" />
    	          </BarChart>
    	        </ResponsiveContainer>
  	      </div>

  	    </div>
  	  </div>
  	</div>
  );
};

export default Relatorios;