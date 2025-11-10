import darkLogo from '../assets/darklogo.svg';

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo e descrição */}
        <div className="p-6 rounded-lg flex flex-col items-start">
          <img src={darkLogo} alt="SeaShade Logo" className="h-12 mb-3" />
          <p className="text-sm leading-relaxed">
            Gerenciador completo de quiosques de praia: controle de pedidos, mesas, estoque e muito mais.
          </p>
        </div>

        {/* Ferramentas */}
        <div className="p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Ferramentas</h2>
          <ul className="text-sm space-y-2">
            <li>Java 21</li>
            <li>Spring Boot</li>
            <li>Tailwind CSS</li>
            <li>PostgreSQL</li>
            <li>Docker</li>
          </ul>
        </div>

        {/* Links */}
        <div className="p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Links</h2>
          <ul className="text-sm space-y-2">
            <li><a href="/" className="hover:underline transition-colors duration-200">Home</a></li>
            <li><a href="/sobre" className="hover:underline transition-colors duration-200">Sobre</a></li>
            <li><a href="/contato" className="hover:underline transition-colors duration-200">Contato</a></li>
          </ul>
        </div>

        {/* Contato */}
        <div className="p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Contato</h2>
          <ul className="text-sm space-y-2">
            <li>Email: <a href="mailto:contato@seashade.com" className="hover:underline">contato@seashade.com</a></li>
            <li>Telefone: <a href="tel:+5511999999999" className="hover:underline">+55 11 99999-9999</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-10 border-t border-sky-900 pt-6">
        © {new Date().getFullYear()} SeaShade. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;