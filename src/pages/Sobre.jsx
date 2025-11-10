import Header from '../components/Header';
import Footer from '../components/Footer'
const Sobre = () => {

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <Header />
      {/* A tag 'main' agora atua como um container para centralizar o conteúdo */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Card de conteúdo principal */}
        <div className="bg-white rounded max-w-4xl w-full p-8 md:p-12">
          
          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
            Sobre o Seashade
          </h1>
          
          {/* Container para os parágrafos, com espaçamento e estilo de texto */}
          <div className="space-y-6 text-slate-600 text-lg text-justify leading-relaxed">
            <p>
              O SeaShade nasceu em Santos, uma cidade litorânea cuja história e economia estão profundamente ligadas ao turismo e à vida na praia. Nosso sistema foi desenvolvido para facilitar o dia a dia de empreendedores e equipes que atuam nesse ambiente dinâmico, permitindo que eles foquem no que realmente importa: <strong className="font-semibold text-blue-800">oferecer um atendimento de qualidade aos clientes.</strong>
            </p>
            <p>
              Com o SeaShade, o que antes era feito de forma manual e suscetível a falhas passa a ser gerenciado de forma prática, rápida e centralizada. É possível gerenciar de forma integrada pedidos, estoque, mesas e guarda-sóis, além de organizar informações essenciais para o bom funcionamento do quiosque. Tudo isso em uma plataforma <strong className="font-semibold text-blue-800">intuitiva, rápida e acessível</strong> para garantir assim, que o turismo, sendo o motor da economia da cidade, seja cada vez mais valorizado.
            </p>
            
            {/* Parágrafo de conclusão com um separador visual */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-center italic text-slate-600">
                Mais do que um sistema de gestão, o SeaShade é um reflexo do espírito santista: inovar sem perder a essência.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default Sobre;