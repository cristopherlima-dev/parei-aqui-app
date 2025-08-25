/*
    Arquivo: NoteCard.jsx
    Função: É o molde para cada card de anotação.    
*/
import { Eye, Edit, Trash2, Paperclip } from 'lucide-react';

const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ' às ' + date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Adicionamos a nova propriedade 'onEdit'
export default function NoteCard({ note, categoryName, onDelete, onView, onEdit }) {
    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const attachmentCount = note.imageUrls ? note.imageUrls.length : 0;

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-indigo-400">{categoryName}</span>
                <div className="flex items-center gap-2 text-slate-400">
                    <button onClick={() => onView(note.id)} className="hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                    {/* O botão de edição agora chama a função onEdit */}
                    <button onClick={() => onEdit(note.id)} className="hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-white mb-2">{note.title}</h3>
                <p className="text-slate-300 text-sm">{truncateText(note.text)}</p>
            </div>
            <div className="p-4 bg-slate-800/50 border-t border-slate-700 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                    <Paperclip className="w-3 h-3" />
                    <span>{attachmentCount} anexo(s)</span>
                </div>
                <div className="flex flex-col">
                    {/* A coluna 'author' não existe mais, podemos remover ou ajustar no futuro */}
                    {/* <span>Criado por: {note.author}</span> */}
                    <span>Atualizado em: {formatDate(note.updatedAt)}</span>
                </div>
            </div>
            <div className="p-2 bg-slate-900/50 flex justify-end">
                <button onClick={() => onDelete(note.id)} className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};



