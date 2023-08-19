import * as dotenv from "dotenv";
import get_path from "./utils/path";
dotenv.config({ path: get_path() + "/.env" });
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import dataSource from "./db/postgres.db";
import loggerMiddleware from "./middleware/logger.middleware";
import employeeRoute from "./route/employee.route";
import errorMiddleware from "./middleware/error.middleware";
import { departmentRoute } from "./route/department.route";
import roleRoute from "./route/role.route";
import monitor from "./middleware/monitor.middleware";
import statusRoute from "./route/status.route";
import cors from "cors";
import taskRoute from "./route/task.route";
import commentRoute from "./route/comment.route";

const server = express();

server.use(cors());

server.use(monitor);

server.use(express.json());

server.use(loggerMiddleware);

server.use("/api/employees", employeeRoute);
server.use("/api/departments", departmentRoute);
server.use("/api/roles", roleRoute);
server.use("/api/status", statusRoute);
server.use("/api/tasks", taskRoute);
server.use("/api/tasks/:id/comments", commentRoute);

server.all("*", (req: Request, res: Response) => {
    res.status(404).send();
});

server.use(errorMiddleware);

(async () => {
    await dataSource.initialize();
    server.listen(8000);
})();
