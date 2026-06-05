import { Hono } from 'hono';
import { requireAuth, type AuthVariables } from '../middleware/auth';
import { randomBytes } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const uploadRoute = new Hono<{ Variables: AuthVariables }>();

// Direktori untuk menyimpan file upload
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Pastikan folder uploads ada
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Utility untuk generate nama file unik
function generateFileName(extension: string): string {
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  return `${timestamp}-${random}${extension}`;
}

// Validasi tipe file gambar
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

uploadRoute.post('/image', requireAuth, async (c) => {
  try {
    await ensureUploadDir();

    const body = await c.req.parseBody();
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'File tidak ditemukan' }, 400);
    }

    // Validasi tipe file
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return c.json(
        {
          error: 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP',
        },
        400
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      return c.json(
        {
          error: 'Ukuran file terlalu besar. Maksimal 5MB',
        },
        400
      );
    }

    // Simpan file
    const extension = path.extname(file.name) || '.jpg';
    const fileName = generateFileName(extension);
    const filePath = path.join(UPLOAD_DIR, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Return URL file
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const fileUrl = `${baseUrl}/uploads/${fileName}`;

    return c.json({
      url: fileUrl,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Gagal mengupload file' }, 500);
  }
});

// Endpoint untuk upload multiple images
uploadRoute.post('/images', requireAuth, async (c) => {
  try {
    await ensureUploadDir();

    const body = await c.req.parseBody();
    const files = body['files'];

    if (!files) {
      return c.json({ error: 'File tidak ditemukan' }, 400);
    }

    // Handle multiple files
    const fileArray = Array.isArray(files) ? files : [files];
    const uploadedFiles = [];

    for (const file of fileArray) {
      if (!(file instanceof File)) continue;

      // Validasi tipe file
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        continue;
      }

      // Validasi ukuran file
      if (file.size > MAX_FILE_SIZE) {
        continue;
      }

      // Simpan file
      const extension = path.extname(file.name) || '.jpg';
      const fileName = generateFileName(extension);
      const filePath = path.join(UPLOAD_DIR, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(filePath, buffer);

      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const fileUrl = `${baseUrl}/uploads/${fileName}`;

      uploadedFiles.push({
        url: fileUrl,
        fileName,
        size: file.size,
        type: file.type,
      });
    }

    return c.json({
      files: uploadedFiles,
      count: uploadedFiles.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Gagal mengupload file' }, 500);
  }
});

export default uploadRoute;
