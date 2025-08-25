import { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';

export default function CategoryManager({ categories, onSave, onDelete, onClose, isSaving }) {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        onSave(newCategoryName);
        setNewCategoryName('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gerenciar Categorias</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                    {categories.length > 0 ? categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
                            <span className="text-white">{cat.name}</span>
                            <button onClick={() => onDelete(cat.id)} className="text-red-500 hover:text-red-400">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    )) : (
                        <p className="text-slate-400 text-center py-4">Nenhuma categoria criada.</p>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nova Categoria</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            placeholder="Ex: Finanças"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                            disabled={isSaving || !newCategoryName.trim()}
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
    