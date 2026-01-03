import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { User, Mail, Shield, Calendar, Edit3, Save, X, Package, Lock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { name });
            toast.success("Profil diperbarui!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Gagal memperbarui profil");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (newEmail === user.email) {
            setIsEditingEmail(false);
            return;
        }
        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Mengirim email verifikasi ke alamat baru
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

            // Kita tidak langsung update Firestore di sini karena email belum benar-benar berubah
            // Pengguna harus klik link verifikasi dulu.

            toast.success("Link verifikasi telah dikirim ke " + newEmail + ". Silakan cek kotak masuk Anda.");
            setIsEditingEmail(false);
            setPassword('');
        } catch (error) {
            console.error("Update email error:", error);
            if (error.code === 'auth/wrong-password') {
                toast.error("Password konfirmasi salah!");
            } else if (error.code === 'auth/requires-recent-login') {
                toast.error("Sesi Anda sudah lama. Silakan logout dan login kembali.");
            } else if (error.code === 'auth/operation-not-allowed') {
                toast.error("Fitur ganti email belum diizinkan di Firebase Console. (Authentication -> Settings -> User Actions)");
            } else {
                toast.error("Gagal mengirim verifikasi: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header Card */}
                <div className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <div className="h-48 bg-gradient-to-r from-primary to-orange-400 relative">
                        <div className="absolute -bottom-16 left-12">
                            <div className="w-32 h-32 bg-white rounded-[40px] p-2 shadow-xl">
                                <div className="w-full h-full bg-gray-100 rounded-[32px] flex items-center justify-center text-primary">
                                    <User size={64} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 p-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                                        {user?.name}
                                    </h1>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">
                                        {user?.role}
                                    </span>
                                </div>
                                <p className="text-gray-400 font-medium flex items-center">
                                    <Mail size={16} className="mr-2" />
                                    {user?.email}
                                </p>
                            </div>

                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-xl shadow-gray-900/10 uppercase text-xs tracking-widest"
                                >
                                    <Edit3 size={18} />
                                    <span>Edit Profil</span>
                                </button>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="flex items-center space-x-2 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs tracking-widest uppercase"
                                    >
                                        <Save size={18} />
                                        <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-gray-800 tracking-tight">Informasi Dasar</h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        ) : (
                                            <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-700">
                                                {user?.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                                        {!isEditingEmail ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-1 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-500">
                                                    {user?.email}
                                                </div>
                                                <button
                                                    onClick={() => setIsEditingEmail(true)}
                                                    className="p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all"
                                                >
                                                    <RefreshCw size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 p-6 bg-gray-50 rounded-3xl border border-primary/20 animate-in fade-in zoom-in duration-300">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-bold text-primary uppercase">Email Baru</p>
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                                        value={newEmail}
                                                        onChange={(e) => setNewEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <p className="text-[10px] font-bold text-primary uppercase">Konfirmasi Password</p>
                                                        <span className="text-[9px] text-gray-400">Diperlukan untuk keamanan</span>
                                                    </div>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex space-x-2 pt-2">
                                                    <button
                                                        onClick={handleUpdateEmail}
                                                        disabled={loading}
                                                        className="flex-1 py-3 bg-primary text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                                                    >
                                                        {loading ? 'Proses...' : 'Update Email'}
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditingEmail(false)}
                                                        className="px-6 py-3 bg-white text-gray-400 font-black rounded-xl text-xs uppercase tracking-widest border border-gray-200"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-xl font-black text-gray-800 tracking-tight">Keamanan & Sesi</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-50">
                                                <Shield size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Status Akun</p>
                                                <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Terverifikasi</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-50">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Member Sejak</p>
                                                <p className="text-xs text-gray-400 font-bold tracking-widest">
                                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Januari 2026'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
