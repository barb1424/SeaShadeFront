import { Undo2, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const HeaderLogged = ({ hasUndo }) => {
    const navigate = useNavigate();
    const handleVoltar = () => {
    navigate(-1);
    }
    return (
        <header className="flex flex-col gap-7 mb-5">
            <div className={`flex ${ hasUndo ? "justify-between" : "justify-end"}`}>
             {hasUndo && <button onClick={handleVoltar} className="text-slate-600 cursor-pointer"><Undo2 size="30" strokeWidth={2.5}/></button>}
            <Link to = "/novo-pedido" className ="hover: bg-orange-500 text-slate-50 font-medium rounded px-3 py-2 shadow-sm flex gap-2 items-center justify-center"><PenLine size="16" strokeWidth={3}/>Novo Pedido</Link>
            </div>
            
        </header>                
    )   
}
export default HeaderLogged;