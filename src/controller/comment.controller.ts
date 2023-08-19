import { Router } from "express";
import CommentService from "../service/comment.service";

export default class CommentController{
    constructor(
        private commentService: CommentService,
        private router: Router
    ){}
}