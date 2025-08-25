import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';

import { Plus, Hash, Book, Code, Home, Image as ImageIcon, LogOut, Settings } from 'lucide-react';
import NoteCard from './components/NoteCard';
import NoteFormModal from './components/NoteFormModal';
import ConfirmModal from './components/ConfirmModal';
import NoteViewModal from './components/NoteViewModal';
import CategoryManager from './components/CategoryManager'; // 1. Importamos o novo componente

function NotesApp({ session }) {
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToView, setNoteToView] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false); // 2. Novo estado para o modal de categorias

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData);

      if (categoriesData.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesData[0].id);
      } else if (categoriesData.length === 0) {
        setSelectedCategoryId(null);
      }

      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*');
      if (notesError) throw notesError;
      const formattedNotes = notesData.map(note => ({...note, updatedAt: note.created_at}));
      setNotes(formattedNotes);

    } catch (error) {
      console.error("Erro ao buscar dados do Supabase:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Novas funções para gerenciar categorias
  const handleSaveCategory = async (categoryName) => {
    setIsSaving(true);
    try {
        const { error } = await supabase.from('categories').insert([{
            name: categoryName,
            user_id: session.user.id
        }]);
        if (error) throw error;
        fetchData(); // Atualiza a lista de categorias
    } catch (error) {
        console.error("Erro ao salvar categoria:", error);
        alert("Erro ao salvar categoria.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const notesInCategory = notes.filter(note => note.categoryId === categoryId);
    if (notesInCategory.length > 0) {
        alert("Não é possível apagar uma categoria que possui anotações vinculadas.");
        return;
    }
    try {
        const { error } = await supabase.from('categories').delete().match({ id: categoryId });
        if (error) throw error;
        fetchData(); // Atualiza a lista de categorias
    } catch (error) {
        console.error("Erro ao apagar categoria:", error);
        alert("Erro ao apagar categoria.");
    }
  };


  const handleSaveNote = async (newNoteData) => {
    if (categories.length === 0) {
        alert("Por favor, crie uma categoria antes de adicionar uma anotação.");
        return;
    }
    setIsSaving(true);
    try {
      let imageUrls = [];
      if (newNoteData.images && newNoteData.images.length > 0) {
        imageUrls = await Promise.all(
          newNoteData.images.map(async (imageObj) => {
            const file = imageObj.file;
            const filePath = `${session.user.id}/${Date.now()}-${file.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('images')
              .upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('images').getPublicUrl(uploadData.path);
            return data.publicUrl;
          })
        );
      }

      const noteToInsert = {
        categoryId: parseInt(newNoteData.categoryId),
        title: newNoteData.title,
        text: newNoteData.text,
        imageUrls: imageUrls,
        user_id: session.user.id,
      };

      const { error: insertError } = await supabase.from('notes').insert([noteToInsert]);
      if (insertError) throw insertError;
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Erro detalhado ao salvar a anotação:", error);
      alert(`Ocorreu um erro ao salvar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;
    try {
      const { error } = await supabase.from('notes').delete().match({ id: noteId });
      if (error) throw error;
      
      setNoteToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Erro ao apagar a anotação:", error);
    }
  };

  const openDeleteConfirm = (noteId) => setNoteToDelete(noteId);
  const openViewModal = (noteId) => setNoteToView(notes.find(n => n.id === noteId));

  const filteredNotes = selectedCategoryId ? notes.filter(note => note.categoryId === selectedCategoryId) : [];
  const getCategoryNameById = (id) => categories.find(cat => cat.id === id)?.name || '';

  if (isLoading) {
    return (
        <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
            <p className="text-xl">Carregando dados...</p>
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Anotação</span>
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </header>

        <main className="grid md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 bg-slate-800/50 p-4 rounded-lg self-start sticky top-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-300">Categorias</h2>
                {/* 4. Botão para abrir o gerenciador de categorias */}
                <button onClick={() => setShowCategoryManager(true)} className="text-slate-400 hover:text-white">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
            <ul className="space-y-2">
              {categories.length > 0 ? categories.map(category => {
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
              }) : (
                <p className="text-sm text-slate-400 text-center py-4">Crie sua primeira categoria clicando no ícone de engrenagem.</p>
              )}
            </ul>
          </aside>

          <section className="md:col-span-3">
            {categories.length === 0 ? (
                 <div className="text-center py-16 px-8 bg-slate-800/50 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-300">Bem-vindo!</h3>
                    <p className="text-slate-400 mt-2">Para começar, crie sua primeira categoria no menu à esquerda.</p>
                </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    categoryName={getCategoryNameById(note.categoryId)}
                    onDelete={openDeleteConfirm}
                    onView={openViewModal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-8 bg-slate-800/50 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-300">Nenhuma anotação aqui!</h3>
                <p className="text-slate-400 mt-2">Crie sua primeira anotação nesta categoria.</p>
              </div>
            )}
          </section>
        </main>
        
        {/* 5. Renderização condicional de todos os modais */}
        {showCategoryManager && (
            <CategoryManager 
                categories={categories}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}
                onClose={() => setShowCategoryManager(false)}
                isSaving={isSaving}
            />
        )}

        {showForm && (
          <NoteFormModal
            categories={categories}
            onSave={handleSaveNote}
            onClose={() => setShowForm(false)}
            initialCategory={selectedCategoryId}
            isSaving={isSaving}
          />
        )}

        {noteToDelete && (
            <ConfirmModal 
                title="Apagar Anotação"
                message="Tem certeza de que quer apagar esta anotação? Esta ação não pode ser desfeita."
                onConfirm={() => handleDeleteNote(noteToDelete)}
                onCancel={() => setNoteToDelete(null)}
                confirmText="Sim, Apagar"
            />
        )}

        {noteToView && (
            <NoteViewModal 
                note={noteToView}
                categoryName={getCategoryNameById(noteToView.categoryId)}
                onClose={() => setNoteToView(null)}
            />
        )}
      </div>
    </div>
  );
}

// Componente "pai" que gerencia a autenticação
export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      {!session ? <Auth /> : <NotesApp key={session.user.id} session={session} />}
    </div>
  );
}
