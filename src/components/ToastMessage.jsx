import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ToastMessage = () => {
    const { toastMsg, setToastMsg } = useAppContext();
    
    useEffect(() => {
        if (!toastMsg) return;
        const timer = setTimeout(() => {
            setToastMsg(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toastMsg, setToastMsg]);

    if (!toastMsg) return null;

    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-2 fade-in zoom-in duration-300 pointer-events-none w-[90%] max-w-sm flex justify-center">
            <div className="bg-[#FF1457]/95 backdrop-blur-sm text-white text-xs font-bold py-3 px-6 rounded-full shadow-[0_10px_25px_rgba(255,20,87,0.5)] border border-[#FF1457]/50 text-center flex items-center gap-2">
                <Check size={16} className="text-white" /> {toastMsg}
            </div>
        </div>
    );
};
