import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const { login, resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success('Selamat Datang Kembali!');

            if (user?.role === 'ADMIN') {
                navigate('/admin', { replace: true });
            } else if (user?.role === 'RESTAURANT') {
                navigate('/restaurant-dashboard', { replace: true });
            } else {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                toast.error("Email atau password Anda salah.");
            } else {
                toast.error("Gagal masuk. Silakan coba lagi nanti.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        try {
            await resetPassword(resetEmail);
            toast.success("Instruksi reset password telah dikirim ke email Anda.");
            setShowResetModal(false);
        } catch (error) {
            toast.error("Gagal mengirim email reset. Pastikan email terdaftar.");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-white relative overflow-hidden">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Bagian Kiri: Visual/Branding (Full Height) */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-900 text-white relative h-full">
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 mb-12 hover:bg-white/20 transition-all group">
                            <ArrowLeft size={16} className="text-white group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[3px]">Kembali</span>
                        </Link>

                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                                <UtensilsCrossed size={28} className="text-white" />
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter leading-[0.9]">
                                Satu Aplikasi, <br />
                                <span className="text-primary italic">Ribuan</span> Rasa.
                            </h1>
                            <p className="text-white/40 font-medium max-w-[260px] text-base leading-relaxed">
                                Pilihan kuliner terbaik, langsung ke pintu Anda.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[4px]">© 2026 FoodKart Premium</p>
                    </div>

                    {/* Ilustrasi Dekoratif - Glow effect */}
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
                </div>

                {/* Bagian Kanan: Form (Full Height Scrollable) */}
                <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative h-full overflow-y-auto no-scrollbar">
                    {/* Floating Decorative Elements on Mobile */}
                    <div className="lg:hidden absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>

                    <div className="w-full max-w-sm relative z-10">
                        <div className="mb-8 text-center lg:text-left">
                            <div className="lg:hidden inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                                <UtensilsCrossed size={24} className="text-primary" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">Masuk</h2>
                            <p className="text-gray-400 font-bold text-sm">Senang melihat Anda kembali!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 shadow-sm text-sm"
                                        placeholder="nama@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px]">Kata Sandi</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                    >
                                        Lupa?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 shadow-sm text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 bg-gray-900 text-white font-black rounded-[20px] shadow-xl shadow-gray-200 hover:bg-primary hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3 uppercase text-[10px] tracking-[3px] mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        <span>Masuk Sekarang</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center border-t border-gray-100 pt-8">
                            <p className="text-gray-400 font-bold mb-4 italic text-sm">Baru di FoodKart?</p>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-8 py-4 w-full bg-primary/5 text-primary font-black rounded-[20px] border-2 border-primary/20 hover:bg-primary/10 transition-all uppercase text-[9px] tracking-[2px]"
                            >
                                Buat Akun Premium
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Lupa Password */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                <Lock size={32} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tight">Lupa Password?</h3>
                            <p className="text-gray-400 font-medium">Kami akan mengirimkan instruksi reset ke email Anda.</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                    placeholder="nama@email.com"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 py-4 bg-gray-50 text-gray-400 font-black rounded-2xl uppercase text-[10px] tracking-widest"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 uppercase text-[10px] tracking-widest"
                                >
                                    {resetLoading ? 'Mengirim...' : 'Kirim Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
