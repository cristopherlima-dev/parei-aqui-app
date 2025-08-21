/*
    Arquivo: NoteFormModal.jsx
    Função: Modal que é aberto ao clicar no botão 'Nova Anotação'   
*/
import { useState } from 'react';
import { X } from 'lucide-react';
import ImageDropzone from './ImageDropzone'; // Importando o componente de upload

export default function NoteFormModal({ categories, onSave, onClose, initialCategory }) {
    // Estados para controlar os campos do formulário
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState({ file: null, preview: null });
    const [categoryId, setCategoryId] = useState(initialCategory);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !text.trim()) {
            alert('Título e texto são obrigatórios!'); // Usaremos um sistema de notificação melhor depois
            return;
        }

        const newNoteData = {
            categoryId: parseInt(categoryId),
            title,
            text,
            imageUrl: image.preview, // Por enquanto, salvaremos apenas a URL de pré-visualização
        };

        onSave(newNoteData); // Chama a função de salvar que virá do App.jsx
    };

    return (
        // Fundo escuro do modal
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4">
            {/* Conteúdo do modal */}
            <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold mb-6">Criar nova anotação</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Categoria</label>
                        <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Título</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Ex: App de Finanças" />
                    </div>
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-slate-300 mb-1">Onde parei?</label>
                        <textarea id="text" value={text} onChange={e => setText(e.target.value)} rows="3" className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="Ex: Parei na configuração do banco de dados..."></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Imagem (Opcional)</label>
                        <ImageDropzone image={image} setImage={setImage} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}