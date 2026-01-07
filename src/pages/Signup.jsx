import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Konfirmasi password tidak cocok!");
        }
        if (formData.password.length < 6) {
            return toast.error("Password minimal 6 karakter.");
        }

        setLoading(true);
        try {
            await signup(formData);
            toast.success('Akun Anda berhasil dibuat! Silakan masuk.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
            } else {
                toast.error("Gagal mendaftar. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="h-screen w-full flex bg-white relative overflow-hidden">
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

                <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-white h-full overflow-y-auto no-scrollbar">
                    <div className="w-full max-w-sm">
                        <div className="mb-6 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-1">Buat Akun</h2>
                            <p className="text-gray-400 font-bold text-sm">Hanya butuh beberapa detik</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Pilih Peran Anda</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'USER' })}
                                        className={`relative p-4 rounded-[20px] border-2 transition-all flex items-center space-x-3 group ${formData.role === 'USER' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400 bg-gray-50'}`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">🍔</span>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase tracking-wider">Pembeli</p>
                                            <p className="text-[8px] font-bold opacity-60">Pesan Makan</p>
                                        </div>
                                        {formData.role === 'USER' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full"></div>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'RESTAURANT' })}
                                        className={`relative p-4 rounded-[20px] border-2 transition-all flex items-center space-x-3 group ${formData.role === 'RESTAURANT' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400 bg-gray-50'}`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">🏪</span>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase tracking-wider">Restoran</p>
                                            <p className="text-[8px] font-bold opacity-60">Jualan Menu</p>
                                        </div>
                                        {formData.role === 'RESTAURANT' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full"></div>}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 shadow-sm text-sm"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-14 pr-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 shadow-sm text-sm"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all" size={16} />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 text-xs shadow-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Konfirmasi</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all" size={16} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 outline-none transition-all font-bold text-gray-700 text-xs shadow-sm"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 bg-gray-900 text-white font-black rounded-[20px] shadow-xl shadow-gray-200 hover:bg-primary hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-3 uppercase text-[10px] tracking-[3px] mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <UserPlus size={18} />
                                        <span>Daftar Akun</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center border-t border-gray-100 pt-6">
                            <p className="text-gray-400 font-bold mb-3 italic text-xs">Sudah punya akun?</p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 w-full bg-gray-50 text-gray-700 font-black rounded-[20px] border-2 border-gray-100 hover:bg-gray-100 transition-all uppercase text-[9px] tracking-[2px]"
                            >
                                Masuk Disini
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
