import multer from "multer";

const storage = multer.memoryStorage();

const imageFileFilter: multer.Options["fileFilter"] = (
	_req,
	file,
	cb,
) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/webp"
	) {
		cb(null, true);
		return;
	}

	cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
};

const documentFileFilter: multer.Options["fileFilter"] = (
	_req,
	file,
	cb,
) => {
	const allowedTypes = [
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"text/plain",
	];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
		return;
	}

	cb(
		new Error(
			"Only PDF, Word, Excel, and text documents are allowed.",
		),
	);
};

export const uploadImage = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: imageFileFilter,
});

export const uploadDocument = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: documentFileFilter,
});