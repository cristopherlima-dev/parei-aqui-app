/*
    Arquivo: NoteViewModal.jsx
    Função: Modal para visualiação de notas. 
*/
import { useState } from 'react';
import { X, Paperclip, Calendar } from 'lucide-react';
import ImageCarouselModal from './ImageCarouselModal'; // Importamos o nosso novo componente

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

export default function NoteViewModal({ note, categoryName, onClose }) {
    // Novo estado para controlar o carrossel
    const [carouselState, setCarouselState] = useState({ isOpen: false, startIndex: 0 });

    if (!note) return null;

    const attachmentCount = note.imageUrls ? note.imageUrls.length : 0;

    const openCarousel = (index) => {
        setCarouselState({ isOpen: true, startIndex: index });
    };

    const closeCarousel = () => {
        setCarouselState({ isOpen: false, startIndex: 0 });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold uppercase text-indigo-400">{categoryName}</span>
                            <h2 className="text-2xl font-bold text-white mt-1">{note.title}</h2>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="overflow-y-auto pr-2 flex-grow">
                        <p className="text-slate-300 whitespace-pre-wrap mb-6">{note.text}</p>
                        
                        {attachmentCount > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Anexos</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {note.imageUrls.map((url, index) => (
                                        // Alterado de <a> para <button> para abrir o carrossel
                                        <button key={index} onClick={() => openCarousel(index)} className="group relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg">
                                            <img 
                                                src={url} 
                                                alt={`Anexo ${index + 1}`} 
                                                className="rounded-lg object-cover w-full h-32"
                                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/1e293b/94a3b8?text=Imagem+Inválida'; }}
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <span className="text-white text-sm">Ver imagem</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-700 mt-6 pt-4 text-xs text-slate-400 space-y-2">
                         <div className="flex items-center gap-2">
                            <Paperclip className="w-3 h-3" />
                            <span>{attachmentCount} anexo(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>Atualizado em: {formatDate(note.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renderização condicional do nosso novo carrossel */}
            {carouselState.isOpen && (
                <ImageCarouselModal 
                    images={note.imageUrls}
                    initialIndex={carouselState.startIndex}
                    onClose={closeCarousel}
                />
            )}
        </>
    );
}
