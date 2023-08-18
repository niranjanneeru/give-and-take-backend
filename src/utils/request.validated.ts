import RequestWithUser from "./request.user";

interface RequestWithValidatedBody extends RequestWithUser{
    dto : any
}

export default RequestWithValidatedBody;