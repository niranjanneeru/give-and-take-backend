import { Request } from "express";
import winston from "winston";
import RequestWithUser from "./request.user";
import RequestWithValidatedBody from "./request.validated";

interface RequestWithLogger extends RequestWithValidatedBody{
    req_id : string
}

export default RequestWithLogger;