// src/pages/Ajuda.jsx
import Sidebar from '../components/Sidebar';
import HeaderLogged from '../components/HeaderLogged';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Ajuda = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      pergunta: 'Como adicionar um novo pedido?',
      resposta: 'Para adicionar um pedido, clique no botão "Novo Pedido" no painel principal, selecione os itens desejados e confirme.'
    },
    {
      pergunta: 'Como gerenciar estoque?',
      resposta: 'Acesse a aba "Estoque" e você poderá ver os produtos, atualizar quantidades, adicionar novos itens ou registrar saídas.'
    },
    {
      pergunta: 'Como verificar reservas de mesas/guarda-sóis?',
      resposta: 'No painel principal, clique em "Mesas/Guarda-sóis" e você terá uma visão detalhada das reservas e disponibilidade.'
    },
    {
      pergunta: 'Como entrar em contato com suporte?',
      resposta: 'Envie um e-mail para suporte@seashade.com ou utilize o chat interno disponível no canto inferior direito.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="text-slate-600 h-screen flex">
      <Sidebar />
      <div className="flex flex-col w-full pl-20 py-4 pr-4 md:pl-25 md:pr-9">
        <HeaderLogged hasUndo />
        <h1 className="text-3xl font-bold mb-5 text-blue-600">Ajuda - SeaShade</h1>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200">
                <button 
                  onClick={() => toggleFAQ(index)} 
                  className="w-full text-left py-3 flex justify-between items-center font-medium text-slate-600 hover:text-blue-600"
                >
                  {faq.pergunta}
                  <ChevronDown className={`transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === index && (
                  <p className="text-slate-500 pb-3">{faq.resposta}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Dicas rápidas</h2>
            <ul className="list-disc list-inside text-slate-600">
              <li>Atualize o estoque diariamente para evitar produtos em falta.</li>
              <li>Verifique reservas antecipadamente para gerenciar melhor as mesas e guarda-sóis.</li>
              <li>Use o histórico de pedidos para analisar vendas e planejar compras.</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Contato</h2>
            <p className="text-slate-600">Se precisar de ajuda adicional, entre em contato com <a href="mailto:suporte@seashade.com" className="text-blue-600 underline">suporte@seashade.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ajuda;
