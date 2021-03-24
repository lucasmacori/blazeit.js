import { Database } from "./database";
import { Server } from "./server";

export interface Values {
    models?: any,
    server?: Server,
    database?: Database,
    cors?: boolean,
    logging?: any,
}