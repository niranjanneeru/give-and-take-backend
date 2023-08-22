import RequestWithValidatedBody from "./request.validated";

interface RequestWithLogger extends RequestWithValidatedBody{
    req_id : string
}

export default RequestWithLogger;