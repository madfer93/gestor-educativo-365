export const uploadImage = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'c3c1d876dab311915412555dba18f2d3';
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            return data.data.url;
        } else {
            throw new Error(data.error.message || 'Error al subir la imagen');
        }
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
};
