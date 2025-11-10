import { LayoutPanelLeft, NotebookPen, BookOpenText, PackageOpen, ChartSpline, ChefHat, Info, ChevronFirst, ChevronLast, User, EllipsisVertical, Settings, Users } from "lucide-react";
import { useState } from "react";
import logo from "../assets/darklogo.svg";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Sidebar = ({noturno}) => {

    const { user } = useAuth(); 

    const hasAdminOrBasicRole = () => {
        if (!user || !user.roles) return false;
        return user.roles.some(role => role.name === 'ADMIN' || role.name === 'BASIC');
    };
   
    const getInitials = (name) => {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const[expanded, setExpanded] = useState(false);
    // Cores dinâmicas
    const bgColor = noturno ? "bg-slate-900" : "bg-slate-50";
    const textColor = noturno ? "text-slate-300" : "text-slate-600";
    const borderColor = noturno ? "border-slate-700" : "border-slate-300";
    const hoverBg = noturno ? "hover:bg-slate-800" : "hover:bg-azul-100";
    const hoverBg2 = noturno ? "hover:bg-slate-800" : "hover:bg-slate-200";
    const hoverText = noturno ? "hover:text-slate-50" : "hover:text-azul-600";
    return (
        <aside className={`z-40 fixed transition-all duration-200 border-b ${borderColor} border-r h-full flex ${bgColor} shadow-sm flex-col ${expanded? "w-2/3 md:w-1/3 lg:w-1/5" : "w-16"}`}>
        <header className={`${textColor} w-full flex flex-col  font-medium  h-full`}>
            <div className={`flex justify-center items-center ${textColor} mb-2`}>

                <div className={`flex overflow-hidden transition-all duration-300${expanded? "p-4 pl-6 flex-grow" : "justify-center w-0"} `}>
                    <img src={logo} alt="Logo do Seashade" className="w-28"/>
                </div>

                <button onClick={() => setExpanded(!expanded)} className={`py-4 px-4 flex cursor-pointer ${hoverBg2} transition-all duration-300 ${expanded ? "" : ""}`}>
                    {expanded? <ChevronFirst size="28"/>: <ChevronLast size="28"/>}
                </button>

            </div>
            <nav className={`text-lg flex flex-col gap-2 ${expanded? "px-3" : "items-center"}`}>
                <ul className={`flex flex-col flex-3 border-b ${borderColor} pb-2`}>
                    
                    <Link to="/inicio"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><LayoutPanelLeft/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Início</div></li></Link>

                    <Link to = "/comandas"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><NotebookPen/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Comandas</div></li></Link>
                    
                    <Link to = "/cardapio"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><BookOpenText/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Cardápio</div></li></Link>
                    
                    <Link to = "/estoque"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><PackageOpen/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Estoque</div></li></Link>
                    
                    <Link to = "/relatorios"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><ChartSpline/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Relatórios</div></li></Link>
                    
                    <Link to = "/modo-producao"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><ChefHat/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Cozinha</div></li></Link>
                
                </ul>
                <ul className="flex flex-col flex-1 justify-around">
                    <Link to = "/funcionarios"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><Users /></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all duration-300 w-0"}`}>Funcionários</div></li></Link>

                    <Link to = "/ajuda"><li className={`cursor-pointer h-full flex p-2 items-center ${hoverBg} ${hoverText} rounded transition-all duration-200 truncate`}><div className={`flex min-w-10 ${!expanded && "justify-center"}`}><Info/></div><div className={`${expanded? "flex-grow" : "overflow-hidden transition-all w-0"}`}>Ajuda</div></li></Link>
                </ul>
        </nav>
    </header>
    {user && (
    <Link to="/conta">
       <div className={`relative px-4 cursor-pointer ${hoverBg2} transition-all duration-300 flex border-t ${borderColor} ${hoverText} items-center justify-center py-4 ${textColor}`}>
            <div className={`flex items-center overflow-hidden transition-all duration-200 ${expanded ? "flex-1 gap-3" : "w-0"}`}>
                <div className={`rounded aspect-square ${noturno? "bg-azul-900" : "bg-azul-200"} flex justify-center items-center font-extrabold text-azul-600 w-9 md:w-13`}>
                    
                    {user.name ? getInitials(user.name) : <User size="auto"/>}
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="font-bold text-sm md:text-lg truncate">{user.name || 'Usuário'}</div>
                    <div className="text-xs md:text-sm truncate">{user.email || 'Email não disponível'}</div>
                </div>
            </div>
            <button onClick={() => setExpanded(!expanded)} className="cursor-pointer">
             <EllipsisVertical size={22}/>
            </button>
        </div>
        </Link>
        )}
    </aside>
    );
};

export default Sidebar;


