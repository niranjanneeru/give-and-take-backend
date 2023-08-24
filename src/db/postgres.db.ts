import * as dotenv from "dotenv";
import get_path from "../utils/path";
dotenv.config({path: get_path()+'/.env'});

import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


const dataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ["dist/entity/*.js"],
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: ["dist/db/migrations/*.js"]
    // synchronize: true
});

export default dataSource;