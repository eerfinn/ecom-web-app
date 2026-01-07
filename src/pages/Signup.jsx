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
                                Join the <br />
                                Culinary <br />
                                <span className="text-primary">Ecosystem</span>.
                            </h1>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[4px]">© 2026 FoodKart</p>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,71,87,0.08)_0%,transparent_70%)] pointer-events-none"></div>
                </div>

                {/* Bagian Kanan: Modern Form UI */}
                <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative h-full overflow-y-auto no-scrollbar">
                    <div className="w-full max-w-[400px] relative z-10">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-gray-950 tracking-tight mb-2">Create Account</h2>
                            <p className="text-gray-400 font-medium text-sm">Join us and start exploring flavors today.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'USER' })}
                                        className={`relative p-4 rounded-xl border transition-all flex items-center space-x-3 group ${formData.role === 'USER' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        <span className="text-xl">🍔</span>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-wider">Buyer</p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'RESTAURANT' })}
                                        className={`relative p-4 rounded-xl border transition-all flex items-center space-x-3 group ${formData.role === 'RESTAURANT' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        <span className="text-xl">🏪</span>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-wider">Kitchen</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Confirm</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            required
                                            className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
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
                                className={`w-full py-4 bg-gray-950 text-white font-bold rounded-xl shadow-lg shadow-gray-200 hover:bg-primary hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-3 text-xs tracking-[2px] mt-8 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>CREATE ACCOUNT</span>
                                        <UserPlus size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-gray-400 text-sm font-medium mb-4">Already have an account?</p>
                            <Link
                                to="/login"
                                className="text-gray-950 font-black hover:text-primary transition-colors text-sm underline underline-offset-4"
                            >
                                Login Here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
