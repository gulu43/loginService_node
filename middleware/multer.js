import multer from "multer";
import path from "path"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadFolderPath = path.join(__dirname, '..', 'uploades');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolderPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname); 
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg, .webp formats are allowed and size must be below 2MB!'));
    }

  }

})

export { upload };

