import { ValidationError } from "class-validator";
import HttpException from "./http.exception";

class ValidationException extends HttpException {
    public errors: ValidationError[];

    constructor(status: number, message: string, errors: ValidationError[]) {
        super(status, message);
        this.errors = errors;
    }

    getMessage() {
        return ValidationException.extractMessages(this.errors);
    }

    static extractMessages(errors: ValidationError[]) {
        const result = {}
        errors.forEach(error => {
            console.log(error);
            if (error.children.length > 0) {
                result[error.property] = ValidationException.extractMessages(error.children);
            } else {
                result[error.property] = Object.values(error.constraints);
            }
        })
        return result;

    }
}

export default ValidationException;