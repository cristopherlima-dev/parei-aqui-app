/*
  Arquivo: Auth.jsx
  Função: Componente para autenticar no sistema   
*/
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Hash } from 'lucide-react';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Controla se é o formulário de Login ou Registo

    const handleAuth = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            let error;
            if (isLogin) {
                // Lógica de Login
                const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
                error = loginError;
            } else {
                // Lógica de Registo
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                error = signUpError;
            }
            if (error) throw error;
            
            if (!isLogin) {
                alert('Registo bem-sucedido! Por favor, verifique o seu email para confirmar a sua conta.');
            }
        } catch (error) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-center items-center gap-3 mb-6">
                    <Hash className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-3xl font-bold">Parei Aqui</h1>
                </div>
                <p className="text-center text-slate-400 mb-8">
                    {isLogin ? 'Faça login para continuar' : 'Crie uma conta para começar'}
                </p>
                <form onSubmit={handleAuth}>
                    <div className="mb-4">
                        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <button 
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'A carregar...' : (isLogin ? 'Entrar' : 'Registar')}
                        </button>
                    </div>
                    <p className="text-center text-sm text-slate-400">
                        {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-bold text-indigo-400 hover:underline ml-2"
                        >
                            {isLogin ? 'Registe-se' : 'Faça login'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
