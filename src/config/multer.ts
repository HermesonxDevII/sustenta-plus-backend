import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads', 'reports');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

export default {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename: (req, file, callback) => {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileExt = path.extname(file.originalname);
      const fileName = `${fileHash}${fileExt}`;

      return callback(null, fileName);
    },
  }),
};
