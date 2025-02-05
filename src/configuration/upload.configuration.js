import multer from "multer";

const storage = multer.memoryStorage();
export const fileUpload = multer({ storage: storage });