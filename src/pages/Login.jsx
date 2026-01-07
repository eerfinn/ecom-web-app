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
                {/* Bagian Kiri: Visual/Branding (Minimalist) */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-[#0a0a0b] text-white relative h-full">
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center space-x-2 text-white/50 hover:text-white transition-all group mb-20">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[11px] font-bold uppercase tracking-[2px]">Kembali</span>
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <UtensilsCrossed size={20} className="text-white" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">FoodKart</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter leading-[1.1] pt-4">
                                Explore <br />
                                Thousands of <br />
                                <span className="text-primary">Flavors</span>.
                            </h1>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[4px]">© 2026 FoodKart</p>
                    </div>

                    {/* Subtle Gradient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,71,87,0.08)_0%,transparent_70%)] pointer-events-none"></div>
                </div>

                {/* Bagian Kanan: Modern Form UI */}
                <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative h-full overflow-y-auto no-scrollbar">
                    <div className="w-full max-w-[340px] relative z-10">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-gray-400 font-medium text-sm">Sign in to continue your culinary journey.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="text-[10px] font-bold text-primary uppercase tracking-wider hover:opacity-70 transition-opacity"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 bg-gray-950 text-white font-bold rounded-xl shadow-lg shadow-gray-200 hover:bg-primary hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-3 text-xs tracking-[2px] mt-8 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>SIGN IN</span>
                                        <ArrowLeft size={16} className="rotate-180" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-gray-400 text-sm font-medium mb-4">Don't have an account?</p>
                            <Link
                                to="/signup"
                                className="text-gray-950 font-black hover:text-primary transition-colors text-sm underline underline-offset-4"
                            >
                                Register Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Lupa Password */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[380px] rounded-[32px] shadow-2xl p-8 border border-gray-50">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Lock size={24} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-950 tracking-tight">Reset Password</h3>
                            <p className="text-gray-400 font-medium text-sm">We'll send recovery link to your inbox.</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold text-sm"
                                    placeholder="Enter your email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 py-3.5 bg-gray-50 text-gray-400 font-bold rounded-xl text-[11px] uppercase tracking-wider hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="flex-[1.5] py-3.5 bg-gray-950 text-white font-bold rounded-xl shadow-lg shadow-gray-200 text-[11px] uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50"
                                >
                                    {resetLoading ? 'Sending...' : 'Send Link'}
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
