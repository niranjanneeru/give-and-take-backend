import { NextFunction, Request, Response, Router } from "express";
import uploadFileMiddleware from "../middleware/upload.middleware";
import ValidationException from "../exception/validation.exception";
import { StatusCodes } from "../utils/status.code.enum";
import ResponseBody from "../utils/response.body";
import { StatusMessages } from "../utils/status.message.enum";
import get_path from "../utils/path";
import path from "path";
import fs from 'fs'
import mime from "mime";
import HttpException from "../exception/http.exception";


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

        if (fs.existsSync(filePath)) {
            const contentType = mime.lookup(filePath);
        
            if (contentType) {
              res.setHeader('Content-disposition', `attachment; filename=${filename}`);
              res.setHeader('Content-type', contentType);
        
              const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
            } else {
                throw new HttpException(StatusCodes.UNSUPPORTED_MEDIA_TYPE, StatusMessages.UNSUPPORTED_MEDIA_TYPE);
            }
          } else {
            throw new HttpException(StatusCodes.NOT_FOUND, StatusMessages.NOT_FOUND)
          }
    }

    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log(req);
            await uploadFileMiddleware(req, res);


            if(!req.file){
                throw new ValidationException(StatusCodes.BAD_REQUEST, "No File Provided", []);
            }

            const { originalname, filename } = req.file;

            console.log(originalname, filename);

            const responseBody = new ResponseBody({"url": `${process.env.SITE_URL}/api/uploads/${req.file.filename}`}, null, StatusMessages.CREATED);
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