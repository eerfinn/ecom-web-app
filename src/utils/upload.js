import toast from 'react-hot-toast';

/**
 * Fungsi untuk upload gambar ke Cloudinary (Gratis & Tanpa Billing)
 * @param {File} file - Objek file dari input
 * @returns {Promise<string>} - URL gambar publik
 */
export const uploadImage = async (file) => {
    if (!file) return null;

    // 1. Validasi Ukuran (2MB)
    if (file.size > 2 * 1024 * 1024) {
        toast.error("File terlalu besar (Maks 2MB)");
        throw new Error("File too large");
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        toast.error("Konfigurasi Cloudinary belum lengkap di .env");
        throw new Error("Missing Cloudinary config");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gagal upload ke Cloudinary");
        }

        const data = await response.json();
        return data.secure_url; // Mengembalikan URL HTTPS gambar
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        toast.error("Gagal mengupload gambar ke Cloud.");
        throw error;
    }
};
