import { PiUmbrellaFill } from "react-icons/pi"; 
const IconList = ({ guardaSois = [], onGuardaSolClick, selectedGuardaSolId }) => {

    return (
        <div className="flex flex-wrap gap-4"> 
            {guardaSois.map((guardaSol) => {
                const isLivre = guardaSol.status === 'LIVRE';
                const isSelected = guardaSol.id === selectedGuardaSolId;

                const iconColor = isLivre ? 'text-green-600' : 'text-red-600';
                const hoverEffect = isLivre ? 'hover:bg-green-100 hover:border-green-400' : 'hover:bg-red-100'; 
                const borderColor = isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'; 
                const cursor = isLivre ? 'cursor-pointer' : 'cursor-not-allowed';

                return (
                    <div 
                        key={guardaSol.id} 
                        onClick={() => isLivre && onGuardaSolClick(guardaSol)} 
                        className={`flex flex-col items-center p-1 rounded border-2 ${borderColor} ${cursor} ${hoverEffect} transition-all`} 
                        title={isLivre ? `Guarda-sol ${guardaSol.identificacao} (Disponível)` : `Guarda-sol ${guardaSol.identificacao} (Ocupado)`}
                        >
                        <PiUmbrellaFill 
                            className={`${iconColor} text-4xl md:text-5xl`} 
                        />
                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}> 
                            {guardaSol.identificacao}
                        </span>
                    </div>
                );
            })}
             {guardaSois.length === 0 && (
                <p className='col-span-full text-center text-slate-500 w-full'>Nenhum guarda-sol cadastrado.</p>
             )}
        </div>
    );
}

export default IconList;