import Sidebar from "../components/Sidebar";
import HeaderLogged from "../components/HeaderLogged";
import { ShoppingCart, UserCheck, TrendingUp, AlertTriangle, Users, MinusSquare, DollarSign } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import apiClient from '../services/apiClient'; 

const Inicio = () => {
  // --- ESTADOS ---
  const [indicadores, setIndicadores] = useState([]);
  const [topItens, setTopItens] = useState([]);
  const [itensComBaixaSaida, setItensComBaixaSaida] = useState([]);
  const [estoqueCritico, setEstoqueCritico] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);

  // Estado para armazenar a data e hora atuais
  const [dataAtual, setDataAtual] = useState(new Date());

  // ESTADOS DE LOADING E API ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const quiosqueId = user?.quiosque?.quiosqueId || user?.quiosqueId;

  // Efeito para o relógio
  useEffect(() => {
    const timerId = setInterval(() => {
      setDataAtual(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Efeito para buscar dados
  useEffect(() => {
    if (!quiosqueId) {
      setError("ID do Quiosque não encontrado.");
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [
          kpisRes,          
          topItensRes,     
          baixaSaidaRes,   
          estoqueRes,     
          equipeRes
        ] = await Promise.all([
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/kpis`),
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/top-itens`),
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/bottom-itens`),
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/estoque-critico`),
          apiClient.get(`/api/quiosques/${quiosqueId}/relatorios/visao-equipe`)
        ]);

        const kpis = kpisRes.data; 
        const kpiFormatado = [
          { 
            title: "Ticket Médio", 
            value: `R$ ${String(kpis.ticketMedio || 0).replace('.',',')}`, 
            icon: TrendingUp 
          },
          { 
            title: "Pedidos Ativos", 
            value: kpis.pedidosAtivos, 
            icon: ShoppingCart 
          },
          { 
            title: "Pedidos Finalizados Hoje", 
            value: kpis.pedidosFinalizadosHoje, 
            icon: UserCheck 
          },
          { 
            title: "Faturamento Hoje", 
            value: `R$ ${String(kpis.faturamentoHoje || 0).replace('.',',')}`,
            icon: DollarSign 
          },
        ];

        setIndicadores(kpiFormatado);
        setTopItens(topItensRes.data || []);
        setItensComBaixaSaida(baixaSaidaRes.data || []);
        setEstoqueCritico(estoqueRes.data || []);
        setFuncionarios(equipeRes.data || []);

      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [quiosqueId]);

  // --- TELAS DE LOADING E ERRO ---
  if (loading) {
    return (
        <div className="text-slate-800 flex h-screen ">
            <Sidebar className="w-[250px]" />
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-23 md:pr-8">
                <HeaderLogged />
                <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-600">Olá, {user.name}!</h1>
              
                <h2 className="font-semibold">
                  {`Hoje é dia ${dataAtual.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}, ${dataAtual.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`}
                </h2>
              </div>
                <p className="text-lg">Carregando dados...</p>
            </div>
        </div>
    );
  }

  if (error) {
     return (
        <div className="text-slate-800 flex h-screen ">
            <Sidebar className="w-[250px]" />
            <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-23 md:pr-8">
                <HeaderLogged />
                <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-600">Olá, {user.name}!</h1>
              
                <h2 className="font-semibold">
                  {`Hoje é dia ${dataAtual.toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}, ${dataAtual.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`}
                </h2>
              </div>
                <p className="text-lg text-red-500">{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="text-slate-800 flex h-screen ">
      <Sidebar className="w-[250px]" />
      <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-23 md:pr-8">
        <HeaderLogged />

        <div className="mb-8 text-slate-600">
          <h1 className="text-3xl font-bold ">Olá, {user.name}!</h1>

          <h2 className="font-semibold">
            {`Hoje é dia ${dataAtual.toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}, ${dataAtual.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}`}
          </h2>
        </div>

        {/* Indicadores (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {indicadores.map((item) => (
            <div
              key={item.title} 
              className="bg-slate-50 rounded-xl shadow-sm p-6 flex items-center gap-4 border-l-4 border-blue-500"
            >
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <item.icon size={24} />
              </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-500">{item.title}</span>
              <span className="text-2xl font-bold text-slate-800">{item.value}</span>
            </div>
            </div>
          ))}
      </div>

      {/* Seções de Listas e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Itens */}
        <div className="bg-teal-50 rounded-xl shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4 text-teal-700">
            <TrendingUp size={20} />
            <h2 className="text-xl font-semibold">Itens Mais Vendidos</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {topItens.map((item, i) => (
              <li key={i} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-teal-600">{i + 1}. {item.nome}</span>
                <span className="text-lg font-bold text-teal-800">{item.qtd}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Itens com Baixa Saída */}
        <div className="bg-red-50 rounded-xl shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <MinusSquare size={20} />
            <h2 className="text-xl font-semibold">Itens com Baixa Saída</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {itensComBaixaSaida.map((item, i) => (
              <li key={i} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-semibold text-red-500">{item.nome}</span>
                <span className="text-lg font-bold text-red-800">{item.qtdVendida}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Estoque Crítico */}
        <div className="bg-amber-50 rounded-xl shadow-sm p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertTriangle size={20} />
            <h2 className="text-xl font-semibold">Estoque Crítico</h2>
          </div>
          <ul className="flex flex-col gap-4">
            {estoqueCritico.map((item, i) => (
              <li key={i} className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-amber-800">{item.nome}</span>
                  <span className="text-sm font-medium text-amber-500">{item.quantidade} de {item.max}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${(item.quantidade / item.max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Funcionários */}
      <div className="bg-slate-50 rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4 text-blue-700">
          <Users size={20} />
          <h2 className="text-xl font-semibold">Visão Geral da Equipe</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funcionarios.map((func,i) => (
            <li key={i} className="flex flex-col p-4 bg-white rounded-lg">
              <span className="font-bold text-lg text-blue-700">{func.nome}</span>
              <span className="text-sm text-slate-600">
                Pedidos Ativos: <span className="font-bold">{func.pedidosAtivos}</span>
              </span>
              <span className="text-sm text-slate-600">
                Total Atendidos Hoje: <span className="font-bold">{func.totalAtendidos}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
   </div>
  );
};

export default Inicio;