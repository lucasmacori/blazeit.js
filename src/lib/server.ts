import {Route} from "./classes/route";
import {EntryPoint} from './classes/entryPoint';

import * as Express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from 'cors';

export class Server {
    
    private app: any;

    constructor(
        private _port: number,
        private _entryPoints: Array<EntryPoint>,
        private _bodyType: string,
        private cors: boolean = true,
        private _server = undefined
    ) {
        this.init();
    }

    // Getters and setters
    public get port(): number {
        return this._port;
    }
    public set port(value: number) {
        this._port = value;
    }

    public get entryPoints(): Array<EntryPoint> {
        return this._entryPoints;
    }
    public set entryPoints(value: Array<EntryPoint>) {
        this._entryPoints = value;
    }

    get bodyType(): string {
        return this._bodyType;
    }

    set bodyType(value: string) {
        this._bodyType = value;
    }

    get server(): any {
        return this._server;
    }

    set server(value: any) {
        this._server = value;
    }

    /**
     * serve
     * Starts the server on the given port
     */
    public serve(): void {
        const portStr: number = (this.port) ? this.port : 3000;
        this.app.listen(
            portStr,
            (err: any) => {
                if (!err) {
                    console.log('Server is listening on port ' + portStr);
                } else {
                    throw err;
                }
            }
        );
    }

    /**
     * initRoutes
     * Initialize the routes of the server
     */
    private initRoutes(): void {
        if (!this.entryPoints) {
            throw 'You must provide routes. Please check the docs to see how to use them';
        }
        
        // Browsing the entrypoints and creating the routes
        this.entryPoints.forEach(
            (entryPoint: EntryPoint) => {
                this.createEntryPoint(entryPoint);
            }
        );
    }

    /**
     * createEntryPoint
     * Create an entrypoint in the server
     * @param {any} entryPoint : the entry point to create
     */
    private createEntryPoint(entryPoint: EntryPoint): void {
        entryPoint.routes.forEach(
            (route: Route) => {
                this.createRoute(entryPoint, route);
            }
        );
    }

    /**
     * createRoute
     * Create a route in the server
     * @param {any} entryPoint : the route to create
     */
    private createRoute(entryPoint: EntryPoint, route: Route): void {
        // Setting up the router
        const router = new Express.Router();
        switch (route.method.toUpperCase()) {

            case "GET":
                router.get(
                    route.endpoint,
                    route.action
                );
                break;

            case "POST":
                router.post(
                    route.endpoint,
                    route.action
                );
                break;

            case "PUT":
                router.put(
                    route.endpoint,
                    route.action
                );
                break;

            case "DELETE":
                router.delete(
                    route.endpoint,
                    route.action
                );
                break;
        }

        // Using the router
        this.app.use(
            entryPoint.name,
            router
        );
    }

    /**
     * init
     * Initialize the server
     */
    private init(): void {
        if (this.server) {
            this.app = this.server;
        } else {
            this.app = new Express();
        }

        // Cors
        if (this.cors) {
            this.app.use(cors());
        }

        if (this.bodyType.toLowerCase() === 'json') {
            this.app.use(BodyParser.json());
        } else {
            this.app.use(BodyParser.urlencoded({extended: false}))
        }
        this.initRoutes();
    }
}
