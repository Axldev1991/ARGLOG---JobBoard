/**
 * Utility functions for Cloudinary operations
 * Used for parsing URLs and managing image assets
 */

/**
 * Extracts the public_id from a Cloudinary URL
 * @param cloudinaryUrl - Full Cloudinary URL (e.g., https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg)
 * @returns The public_id (without extension) or null if invalid
 */
export function extractPublicId(cloudinaryUrl: string | null | undefined): string | null {
    if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
        return null;
    }

    try {
        // Check if it's a Cloudinary URL
        if (!cloudinaryUrl.includes('cloudinary.com')) {
            return null;
        }

        // Parse URL to extract path
        const url = new URL(cloudinaryUrl);
        
        // Get pathname: /image/upload/v{version}/{public_id}.{format}
        const pathname = url.pathname;
        
        // Split by "/" and filter empty parts
        const parts = pathname.split('/').filter(p => p.length > 0);
        
        // Find "upload" segment and get everything after it
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1 || uploadIndex >= parts.length - 1) {
            return null;
        }

        // Get parts after "upload"
        const afterUpload = parts.slice(uploadIndex + 1);
        
        // Filter out version prefix (vXXXXXXXX) and get public_id
        // Format: v{version}/{public_id} or v{version}/{folder}/{public_id}
        const publicIdParts: string[] = [];
        
        for (const part of afterUpload) {
            // Skip version prefix (starts with 'v' followed by numbers)
            if (/^v\d+$/.test(part)) {
                continue;
            }
            // Skip transformation parameters (c_fill, w_200, etc)
            if (/^[a-z]/.test(part) && part.includes('_')) {
                continue;
            }
            // Skip file extension
            if (part.includes('.')) {
                publicIdParts.push(part.split('.')[0]);
            } else {
                publicIdParts.push(part);
            }
        }

        if (publicIdParts.length === 0) {
            return null;
        }

        // Join folder + public_id if multiple parts
        return publicIdParts.join('/');

    } catch {
        return null;
    }
}

export default extractPublicId;