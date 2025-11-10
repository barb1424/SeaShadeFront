import Header from '../components/Header';
import decoracaolg from "../assets/decoracaolg2.webp";
import decoracaosm from "../assets/decoracaosm2.webp";
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { NotebookPen, Boxes, Users, Cloud, Sparkles } from 'lucide-react';
import deitado from '../assets/mockupdeitado/deitado4.png';
import empe from '../assets/mockupempe/empe6.png';
import empe2 from '../assets/mockupempe/empe4.png';
import empe3 from '../assets/mockupempe/empe.png';
import empe4 from '../assets/mockupempe/empe3.png';

// const WavyDivider = ({ className }) => (
//   <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none ${className}`}>
//     <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[150px]">
//       <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
//     </svg>
//   </div>
// );

const Home = () => {
  return (
    // A cor de fundo geral foi removida daqui para ser aplicada por seção
    <div>
      {/* SEÇÃO 1 */}
      <div className="bg-sky-600 relative">
        <div className='flex flex-col relative min-h-screen'>
          <Header />
          <div className="relative z-10 w-full mx-auto flex-1 flex flex-col justify-center px-4">
            <main className="flex flex-col md:flex-row flex-1 md:mt-40 md:text-left justify-center">
              <div className="flex flex-col max-w-screen-2xl w-full">
                <div className="flex flex-col gap-7">
                  <h1 className="text-xl md:text-3xl lg:text-3xl font-bold sm:text-4xl">
                    <span className="text-slate-50 font-light">Seu negócio</span><br />
                    <strong className="lg:text-8xl md:text-7xl sm:text-[80px] text-[44px] break-words text-slate-50">
                      Seguro &<br /><span className="break-words">Organizado.</span>
                    </strong><br />
                  </h1>
                  <p className="text-2xl lg:text-3xl font-light text-slate-50">
                    Gerencie <span className="text-yellow-300 font-medium">pedidos</span>, <span className="text-yellow-300 font-medium">estoque</span> e <span className="text-yellow-300 font-medium">mesas</span> com praticidade.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row mt-8">
                  <a
                    href="/cadastro" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-50 font-semibold rounded lg:px-24 md:px-24 cursor-pointer md:text-2xl text-2xl py-4 text-center shadow-sm hover:opacity-90 transition-opacity">Comece já</a>
                  <div className="text-slate-50 lg:px-24 md:px-24 md:text-2xl text-2xl py-4 text-center"><a href="#sobre" className="flex items-center justify-center hover:underline">Saiba mais</a></div>
                </div>
              </div>
              <img className="hidden lg:flex absolute bottom-0 right-0 object-cover z-0" src={decoracaolg} alt="Imagem de fundo" />
            </main>
          </div>
          <img className="lg:hidden bottom-0 right-0 object-cover z-0 " src={decoracaosm} alt="Imagem de fundo" />
        </div>
        {/* <WavyDivider className="text-slate-50 transform rotate-180" /> */}
      </div>

      {/* SEÇÃO 2 */}
      <section id="sobre" className="py-15 px-6 bg-slate-50 text-slate-600 relative">
        <div className="max-w-screen-xl mx-auto w-full text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Chegamos para facilitar a vida de quem trabalha na praia
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16">
            Deixe a complexidade de lado. Nosso sistema oferece as ferramentas certas para você.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl  p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <NotebookPen className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500 mb-2">Anote Pedidos</h3>
              <p className="text-slate-600 leading-relaxed">Registre pedidos de forma rápida e digital, eliminando o papel e a caneta.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl  p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Boxes className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500 mb-2">Controle seu Estoque</h3>
              <p className="text-slate-600 leading-relaxed">Saiba em tempo real quais produtos estão acabando e evite perdas de vendas.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl  p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Users className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500 mb-2">Conecte sua Equipe</h3>
              <p className="text-slate-600 leading-relaxed">Sua equipe trabalha em sintonia, da cozinha ao atendimento na areia.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl  p-8 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <Cloud className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-orange-500 mb-2">Supervisione de Longe</h3>
              <p className="text-slate-600 leading-relaxed">Acesse relatórios e monitore seu negócio de qualquer celular ou computador.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO 3 */}
      <section className="py-16 px-6 bg-white text-slate-800">
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-16">
              Comece a usar em 3 passos simples
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-10">
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-sm font-bold text-sky-600 tracking-wider mb-2">PASSO 01</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Configure seu Cardápio</h3>
              <p className="text-slate-600 text-lg leading-relaxed">O primeiro passo é o mais rápido. Cadastre seus produtos, bebidas e porções. Adicione preços e descrições para que sua equipe tenha tudo na mão.</p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <img src={deitado} alt="Tela de cardápio do sistema em um tablet" className="max-w-md rounded-lg " width={340} height={650} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-10 lg:gap-16 py-10">
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-sm font-bold text-sky-600 tracking-wider mb-2">PASSO 02</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Receba e Gerencie Pedidos</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Com o cardápio pronto, os pedidos são enviados em tempo real para a cozinha ou bar, eliminando erros e agilizando a entrega.</p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-start gap-8">
              <img src={empe} alt="Tela de pedidos do sistema" className="rounded-lg " width={270} height={480} />
              <img src={empe2} alt="Tela de detalhes de um pedido" className="hidden sm:block rounded-lg " width={270} height={480} />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-10">
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-sm font-bold text-sky-600 tracking-wider mb-2">PASSO 03</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Acompanhe seus Resultados</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Acesse o painel e veja relatórios de vendas, produtos mais vendidos e o desempenho da sua equipe para tomar decisões e crescer.</p>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end gap-8">
              <img src={empe3} alt="Tela de relatórios do sistema" className="rounded-lg " width={270} height={480} />
              <img src={empe4} alt="Dashboard de vendas do sistema" className="hidden sm:block rounded-lg " width={270} height={480} />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-50 to-sky-100 relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="inline-block bg-orange-100 p-3 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Dê o próximo passo para um verão mais tranquilo
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Deixe a papelada de lado e veja na prática como o SeaShade pode transformar seu negócio.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/cadastro"
                className="w-full sm:w-auto inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors shadow"
              >
                Cadastre-se gratuitamente
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
export default Home;