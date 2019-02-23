import { Route } from "./classes/route";
import { EntryPoint } from './classes/entryPoint';

import * as Express from 'express';
import * as BodyParser from 'body-parser';

export class Server {
    
    private app: any;

    constructor(
        private _port: number,
        private _entryPoints: Array<EntryPoint>
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

    /**
     * init
     * Initialize the server
     */
    private init(): void {
        this.app = new Express();
        this.app.use(
            BodyParser.urlencoded(
                {
                    extended: false
                }
            )
        );
        this.initRoutes();
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
     * @param entryPoint : the entry point to create
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
     * @param route : the route to create
     */
    private createRoute(entryPoint: EntryPoint, route: Route): void {
        console.log('entrypoint', entryPoint);

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
     * serve
     * Starts the server on the given port
     */
    public serve(): void {
        const portStr: number = (this.port) ? this.port : 3000;
        this.app.listen(
            this.port,
            (err: any) => {
                if (!err) {
                   console.log('Server is listening on port ' + this.port);
                } else {
                    throw err;
                }
            }
        );
    }
}