import multer from "multer";

const storage = multer.memoryStorage();

const imageFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(
    new Error(
      "Only JPEG, PNG, and WebP images are allowed.",
    ),
  );
};

const pdfFileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF files are allowed."));
};

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});

export const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: pdfFileFilter,
});