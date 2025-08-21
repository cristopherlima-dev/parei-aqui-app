/*
    Arquivo: ImageDropzone.jsx
    Função: Componente para upload de imagens (anexos)    
*/

import { useState, useCallback } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

export default function ImageDropzone({ image, setImage }) {
    const [isDragging, setIsDragging] = useState(false);

    // Lida com a seleção de arquivo pelo clique
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage({
                file: file,
                preview: URL.createObjectURL(file),
            });
        }
    };

    // Lida com o arquivo arrastado e solto na área
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImage({
                file: file,
                preview: URL.createObjectURL(file),
            });
        }
    }, [setImage]);

    // Efeitos visuais ao arrastar sobre a área
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    // Lida com a imagem colada com CTRL+V
    const handlePaste = useCallback((e) => {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            const file = e.clipboardData.files[0];
            if (file.type.startsWith("image/")) {
                setImage({
                    file: file,
                    preview: URL.createObjectURL(file),
                });
            }
        }
    }, [setImage]);

    return (
        <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${isDragging ? 'border-indigo-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onPaste={handlePaste}
        >
            <input
                type="file"
                id="file-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept="image/*"
            />
            {image.preview ? (
                <>
                    <img src={image.preview} alt="Pré-visualização" className="mx-auto max-h-48 rounded-md" />
                    <button
                        onClick={() => setImage({ file: null, preview: null })}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </>
            ) : (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2 text-slate-400">
                    <ImageIcon className="w-10 h-10" />
                    <span className="font-semibold">Arraste e solte uma imagem</span>
                    <span className="text-sm">ou clique para selecionar</span>
                    <span className="text-xs mt-2 p-1 bg-slate-700 rounded">Você também pode colar com CTRL+V</span>
                </label>
            )}
        </div>
    );
};