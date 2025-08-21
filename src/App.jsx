/*
    Arquivo: App.jsx
    Função: Componente principal da aplicação
*/

import { useState, useEffect } from 'react';
import { Plus, Hash, Book, Code, Home, Image as ImageIcon } from 'lucide-react';
import NoteCard from './components/NoteCard'; // Importando componente (card de anotação)

// Dados iniciais (mock) para o nosso protótipo
const initialData = {
  categories: [
    { id: 1, name: 'Projetos Pessoais', icon: <Code className="w-4 h-4" /> },
    { id: 2, name: 'Estudos', icon: <Book className="w-4 h-4" /> },
    { id: 3, name: 'Trabalho', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 4, name: 'Casa', icon: <Home className="w-4 h-4" /> },
  ],
  notes: [
    { id: 101, categoryId: 1, title: 'App de Teste', text: 'Continuar a partir de - instalação de requisitos. Preciso verificar a documentação do framework para ver se todas as dependências foram instaladas corretamente antes de prosseguir.', imageUrl: 'https://placehold.co/600x400/1e293b/94a3b8?text=Print+da+Tela', author: 'Seu Nome', updatedAt: '2025-08-20T18:30:00Z' },
    { id: 102, categoryId: 1, title: 'Portfolio', text: 'Ajustar o alinhamento do footer em telas menores. O problema parece ocorrer apenas em resoluções abaixo de 380px.', imageUrl: null, author: 'Seu Nome', updatedAt: '2025-08-19T11:00:00Z' },
    { id: 103, categoryId: 2, title: 'Curso de React Avançado', text: 'Aula 5 - Hooks customizados. Parei nos 15 minutos, logo após a explicação sobre o hook useMemo.', imageUrl: null, author: 'Seu Nome', updatedAt: '2025-08-20T09:15:00Z' },
  ],
};

function App() {
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);

  useEffect(() => {
    setCategories(initialData.categories);
    setNotes(initialData.notes);
  }, []);

  const filteredNotes = notes.filter(note => note.categoryId === selectedCategoryId);
  const getCategoryNameById = (id) => categories.find(cat => cat.id === id)?.name || '';

  const handleDeleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Hash className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight">Parei Aqui</h1>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-lg shadow-indigo-600/30">
            <Plus className="w-5 h-5" />
            <span>Nova Anotação</span>
          </button>
        </header>

        <main className="grid md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 bg-slate-800/50 p-4 rounded-lg self-start sticky top-8">
            <h2 className="text-lg font-semibold mb-4 text-slate-300">Categorias</h2>
            <ul className="space-y-2">
              {categories.map(category => {
                const count = notes.filter(note => note.categoryId === category.id).length;
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-md transition-colors duration-200 ${selectedCategoryId === category.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        {category.icon}
                        {category.name}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategoryId === category.id ? 'bg-white/20' : 'bg-slate-700'}`}>{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="md:col-span-3">
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    categoryName={getCategoryNameById(note.categoryId)}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-8 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-300">Nenhuma anotação aqui!</h3>
                <p className="text-slate-400 mt-2">Crie sua primeira anotação nesta categoria clicando em "Nova Anotação".</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;