  import multer from 'multer';
  import path from 'path';
  import fs from 'fs';

  const uploadsDir = path.join(__dirname, '../../../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (_req, _file, callback) {
      callback(null, uploadsDir);
    },
    filename: function (_req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callback(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  export const upload = multer({ storage: storage });