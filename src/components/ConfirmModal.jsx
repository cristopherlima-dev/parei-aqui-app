/*
    Arquivo: ConfirmModal.jsx
    Função: Modal que solicita confirmação na deleção de notas   
*/
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-500/10 p-2 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                <p className="text-slate-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
