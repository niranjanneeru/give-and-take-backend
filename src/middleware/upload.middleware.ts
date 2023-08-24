import multer from "multer";
import util from 'util'
import get_path from "../utils/path";
import path from 'path'

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(get_path(), "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;