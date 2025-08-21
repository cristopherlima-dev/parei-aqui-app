/*
    Arquivo: App.jsx
    Função: Componente principal da aplicação
*/
import { useState, useEffect } from 'react';
// Novo: importamos addDoc para adicionar documentos e serverTimestamp para datas
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from './firebase';

import { Plus, Hash, Book, Code, Home, Image as ImageIcon } from 'lucide-react';
import NoteCard from './components/NoteCard';
import NoteFormModal from './components/NoteFormModal';

function App() {
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar os dados iniciais
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const categoriesCollection = collection(db, "categories");
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesList);

      if (categoriesList.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesList[0].id);
      }

      const notesCollection = collection(db, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
          }
      });
      setNotes(notesList);

    } catch (error) {
      console.error("Erro ao buscar dados do Firestore:", error);
    }
    setIsLoading(false);
  };

  // Busca os dados quando o componente é montado
  useEffect(() => {
    fetchData();
  }, []);

  // Nova: Função handleSaveNote atualizada para salvar no Firestore
  const handleSaveNote = async (newNoteData) => {
    try {
      // Cria um novo objeto de anotação com os dados do formulário
      const noteToAdd = {
        ...newNoteData,
        author: 'Seu Nome', // Provisório, virá do usuário logado no futuro
        updatedAt: serverTimestamp(), // Usa o timestamp do servidor do Firebase
      };
      
      // Adiciona o novo documento à coleção "notes"
      await addDoc(collection(db, "notes"), noteToAdd);
      
      console.log("Anotação salva com sucesso!");
      setShowForm(false); // Fecha o modal
      
      // Atualiza a lista de anotações na tela buscando os dados novamente
      fetchData(); 

    } catch (error) {
      console.error("Erro ao salvar a anotação:", error);
    }
  };


  const handleDeleteNote = (noteId) => {
    console.log("Deletar nota:", noteId);
  }

  const filteredNotes = notes.filter(note => note.categoryId === selectedCategoryId);
  const getCategoryNameById = (id) => categories.find(cat => cat.id === id)?.name || '';

  if (isLoading) {
    return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
            <p className="text-xl">A carregar dados...</p>
        </div>
    )
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Hash className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold tracking-tight">Parei Aqui</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-lg shadow-indigo-600/30"
          >
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
                        <Book className="w-4 h-4" />
                        {category.name}
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedCategoryId === category.id ? 'bg-white/20' : 'bg-slate-700'}`}>{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="md-col-span-3">
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
                <p className="text-slate-400 mt-2">Crie a sua primeira anotação nesta categoria.</p>
              </div>
            )}
          </section>
        </main>

        {showForm && (
          <NoteFormModal
            categories={categories}
            onSave={handleSaveNote}
            onClose={() => setShowForm(false)}
            initialCategory={selectedCategoryId}
          />
        )}
      </div>
    </div>
  );
}

export default App;
