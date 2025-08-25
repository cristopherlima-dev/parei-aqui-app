/*
    Arquivo: ImageCarouselModal.jsx
    Função: Modal para visualização de múltiplas imagens de uma nota, em formato carrossel  
*/
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarouselModal({ images, initialIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const goToPrevious = () => {
        const isFirstImage = currentIndex === 0;
        const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentIndex === images.length - 1;
        const newIndex = isLastImage ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    // Permite a navegação com as setas do teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex]); // Recria o listener quando o índice muda para ter a função atualizada

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={onClose}>
            {/* Botão de Fechar */}
            <button className="absolute top-4 right-4 text-white hover:text-slate-300 z-[70]" onClick={onClose}>
                <X size={32} />
            </button>

            {/* Botão Anterior */}
            <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 z-[70]" 
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            >
                <ChevronLeft size={32} />
            </button>

            {/* Conteúdo da Imagem */}
            <div className="relative w-full h-full flex items-center justify-center p-16" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={images[currentIndex]} 
                    alt={`Imagem ${currentIndex + 1}`} 
                    className="max-w-full max-h-full object-contain"
                />
            </div>

            {/* Botão Próximo */}
            <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/60 z-[70]" 
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
            >
                <ChevronRight size={32} />
            </button>

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-lg text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
