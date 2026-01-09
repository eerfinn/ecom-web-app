import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, UtensilsCrossed, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match. Please check again.");
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        setLoading(true);
        try {
            await signup(formData);
            toast.success('Your account has been created successfully! Please sign in.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("This email is already registered. Please use a different one.");
            } else {
                toast.error("An error occurred during sign up. Please try again.");
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
                            <span className="text-[11px] font-bold uppercase tracking-[2px]">Back to Home</span>
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
                                    <div className="relative group/pass">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/pass:text-primary transition-colors" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            className="w-full pl-7 pr-8 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] ml-1">Confirm</label>
                                    <div className="relative group/conf">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/conf:text-primary transition-colors" size={16} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            className="w-full pl-7 pr-8 py-3 bg-transparent border-b border-gray-100 focus:border-primary outline-none transition-all font-semibold text-gray-800 text-sm"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
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

                        <div className="mt-16 text-center">
                            <div className="relative flex items-center justify-center mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <span className="relative px-4 bg-white text-[11px] font-bold text-gray-300 uppercase tracking-widest leading-none">Already a Member?</span>
                            </div>
                            <Link
                                to="/login"
                                className="group relative inline-flex items-center justify-center px-10 py-4 font-black transition-all duration-300 ease-in-out border-2 border-gray-950 rounded-xl hover:bg-gray-950 hover:text-white"
                            >
                                <span className="relative text-xs tracking-[3px] uppercase">Sign In Instead</span>
                                <LogIn size={16} className="ml-3 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
