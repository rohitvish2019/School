const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeMatch = allowedTypes.test(file.mimetype);
  const extMatch = allowedTypes.test(ext);

  if (mimeMatch && extMatch) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const compressAndSave = async (file, uploadDir = "uploads") => {
  if (!file || !file.buffer) {
    throw new Error("No file buffer found for compression.");
  }

  await fs.promises.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${Date.now()}${ext}`;
  const filepath = path.join(uploadDir, filename);

  let transformer = sharp(file.buffer).resize({
    width: 1000,
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    transformer = transformer.png({ quality: 70, compressionLevel: 9 });
  } else if (ext === ".webp") {
    transformer = transformer.webp({ quality: 60 });
  } else {
    transformer = transformer.jpeg({ quality: 60, mozjpeg: true });
  }

  await transformer.toFile(filepath);
  return filename;
};

upload.compressAndSave = compressAndSave;

module.exports = upload;
