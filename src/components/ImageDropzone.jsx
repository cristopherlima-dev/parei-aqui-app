/*
    Arquivo: ImageDropzone.jsx
    Função: Componente para upload de imagens (anexos)    
*/
import { useState, useCallback } from 'react';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

// Componente para a miniatura da imagem com botão de remover
const ImagePreview = ({ image, onRemove }) => (
    <div className="relative group w-24 h-24 border border-slate-600 rounded-md overflow-hidden">
        <img src={image.preview} alt="Pré-visualização" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => onRemove(image.preview)}
                className="text-white hover:text-red-400 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    </div>
);

export default function ImageDropzone({ images, setImages }) {
    const [isDragging, setIsDragging] = useState(false);

    // Função para adicionar múltiplos arquivos de uma vez
    const addFiles = useCallback((files) => {
        const newImages = [];
        for (let file of files) {
            if (file.type.startsWith("image/")) {
                newImages.push({
                    file: file,
                    preview: URL.createObjectURL(file),
                });
            }
        }
        // Adiciona as novas imagens à lista existente
        setImages(prevImages => [...prevImages, ...newImages]);
    }, [setImages]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            addFiles(e.target.files);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            addFiles(e.dataTransfer.files);
        }
    }, [addFiles]);
    
    const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);

    // Função para remover uma imagem da lista
    const handleRemoveImage = (previewToRemove) => {
        setImages(prevImages => prevImages.filter(img => img.preview !== previewToRemove));
        URL.revokeObjectURL(previewToRemove); // Libera memória
    };

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden" // Ocultamos para usar um label customizado
                onChange={handleFileChange}
                accept="image/*"
                multiple // Permite selecionar múltiplos arquivos
            />
            {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {images.map((image) => (
                        <ImagePreview key={image.preview} image={image} onRemove={handleRemoveImage} />
                    ))}
                    {/* Botão para adicionar mais imagens */}
                    <label htmlFor="file-upload" className="cursor-pointer w-24 h-24 flex flex-col items-center justify-center space-y-1 text-slate-400 border-2 border-dashed border-slate-600 rounded-md hover:bg-slate-700/50 hover:border-indigo-500 transition-all">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs">Adicionar</span>
                    </label>
                </div>
            ) : (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-slate-400 min-h-[10rem]">
                    <ImageIcon className="w-10 h-10" />
                    <span className="font-semibold">Arraste e solte imagens</span>
                    <span className="text-sm">ou clique para selecionar</span>
                    <span className="text-xs mt-2 p-1 bg-slate-700 rounded">Cole com CTRL+V em qualquer lugar do modal</span>
                </label>
            )}
        </div>
    );
};
