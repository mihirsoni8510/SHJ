'use server';

import cloudinary from '@/lib/cloudinary';
import { getCurrentUser } from '@/lib/auth';

export async function uploadImageAction(base64Image: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
            folder: 'shj_products',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        return { success: true, url: uploadResponse.secure_url };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return { error: 'Failed to upload image to Cloudinary' };
    }
}
