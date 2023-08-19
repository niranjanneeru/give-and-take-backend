import { NextFunction, Request, Response, Router } from "express";
import uploadFileMiddleware from "../middleware/upload.middleware";
import HttpException from "../exception/http.exception";
import ValidationException from "../exception/validation.exception";
import { StatusCodes } from "../utils/status.code.enum";
import { ValidationError } from "class-validator";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import get_path from "../utils/path";
import path from "path";


export class UploadController {
    router: Router;
    constructor(
    ) {
        this.router = Router();
        this.router.post('/', this.upload);
        this.router.get('/:filename', this.getFile);
    }

    getFile = async (req: Request, res: Response, next: NextFunction) => {
        const filename = req.params.filename;
        const filePath = path.join(get_path(), ".." , "uploads", filename);

        res.download(filePath, filename, (err) => {
            console.log(err);
        })
    }

    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await uploadFileMiddleware(req, res);

            const { originalname, filename } = req.file;

            console.log(originalname, filename);

            if(!req.file){
                throw new ValidationException(StatusCodes.BAD_REQUEST, "No File Provided", []);
            }

            const responseBody = new ResponseBody({"url": `http:localhost:8000/upload/${req.file.filename}`}, null, StatusMessages.CREATED);
            responseBody.set_meta(1);

            res.status(StatusCodes.CREATED).send(responseBody);
        } catch (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                throw new ValidationException(StatusCodes.BAD_REQUEST, "File size cannot be larger than 2MB!", []);
              }
            next(err);
        }
    }
}