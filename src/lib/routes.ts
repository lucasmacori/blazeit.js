import {Request, Response} from 'express';
import {Route} from './classes/route';
import {validateCreate, validateDelete, validateGetById, validateUpdate} from "./validators";
import { Database } from './database';

// TODO: Use a generic method that gets the data from Mongoose or Sequelize depending on the mode

/**
 * generateGet
 * Returns the GET '/' route
 * @param database: Database
 * @param collection: string
 */
export function generateGet(database: Database, collection: string, models: Map<string, any>): Route {
    return new Route(
        '/',
        'GET',
        'GET ' + collection,
        (req: Request, res: Response) => {

            let includeModels = [];
            getIncludeList(database.models)
                .then((includes) => {
                    includeModels = includes;
                })
                .catch(err => { throw err; });

            if (database.type === 'mongodb') {
                database.models.get(collection).find({})
                    .exec(
                        (err: NodeJS.ErrnoException, objects: Array<any>) => {
                            if (!err) {
                                res.json(objects);
                            } else {
                                res.status(500);
                                res.json({
                                    message: `Could not get ${collection}: ${err}`
                                });
                            }
                        }
                    );
            } else {
                database.models.get(collection).findAll({ include: includeModels })
                    .then((objects: Array<any>) => {
                        res.json(objects);
                    })
                    .catch((err: NodeJS.ErrnoException) => {
                        res.json({
                            message: `Could not get ${collection}: ${err}`
                        });
                    });
            }
        }
    );
}

/**
 * generateGetById
 * Returns the GET '/:id' route
 * @param database: Database
 * @param collection: string
 */
export function generateGetById(database: Database, collection: string): Route {
    return new Route(
        '/:id',
        'GET',
        'GET ' + collection + ' by id',
        (req: Request, res: Response) => {
            if (validateGetById(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).findById(req.params.id)
                        .exec(
                            (err: NodeJS.ErrnoException, object: any) => {
                                if (!err) {
                                    if (!object) {
                                        res.status(404);
                                        res.json({
                                            message: `${collection} with id '${req.params.id}' does not exist: ${err}`
                                        });
                                    } else {
                                        res.json((object) ? object : {});
                                    }
                                } else {
                                    res.status(500);
                                    res.json({
                                        message: `Could not get ${collection}: ${err}`
                                    });
                                }
                            }
                        );
                } else {
                    database.models.get(collection).findByPk(req.params.id)
                        .then((object: any) => {
                            if (!object) {
                                res.status(404);
                                res.json({
                                    message: `${collection} with id '${req.params.id}' does not exist`
                                });
                            } else {
                                res.json((object) ? object : {});
                            }
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                            res.json({
                                message: `Could not get ${collection}: ${err}`
                            });
                        });
                } 
            }
        }
    )
}

/**
 * generateCreate
 * Returns the POST '/' route
 * @param database: Database
 * @param collection: string
 */
export function generateCreate(database: Database, collection: string): Route {
    return new Route(
        '/',
        'POST',
        'POST ' + collection,
        (req: Request, res: Response) => {
            if (validateCreate(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).create(
                        req.body,
                        (err: NodeJS.ErrnoException) => {
                            if (!err) {
                                res.status(201);
                                res.json({status: 'OK'});
                            } else {
                                res.status(500);
                                res.json({
                                    message: `Could not create ${collection}: ${err}`
                                });
                            }
                        }
                    );
                } else {
                    database.models.get(collection).create(req.body)
                        .then(() => {
                            res.status(201);
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                            res.json({
                                message: `Could not create ${collection}: ${err}`
                            });
                        });
                }
            }
        }
    );

}

/**
 * Returns the POST '/search' route
 * @param database: Database
 * @param collection: string
 */
export function generateSearch(database: Database, collection: string): Route {
    return new Route(
        '/search',
        'POST',
        'Search ' + collection,
        (req: Request, res: Response) => {
            if (database.type === 'mongodb') {
                database.models.get(collection).find(req.body)
                    .exec(
                        (err: NodeJS.ErrnoException, objects: Array<any>) => {
                            if (!err) {
                                res.json(objects);
                            } else {
                                res.status(500);
                                res.json({
                                    message: `Could not search for ${collection}: ${err}`
                                });
                            }
                        }
                    );
            } else {
                database.models.get(collection).findAll({ where: req.body })
                    .then((objects: Array<any>) => {
                        res.json(objects);
                    })
                    .catch((err: NodeJS.ErrnoException) => {
                        res.status(500);
                        res.json({
                            message: `Could not search for ${collection}: ${err}`
                        });
                    });
            } 
        }
    );
}

/**
 * generateUpdate
 * Returns the PUT '/' route
 * @param database: Database
 * @param collection: string
 */
export function generateUpdate(database: Database, collection: string): Route {
    return new Route(
        '/:id',
        'PUT',
        'PUT ' + collection,
        (req: Request, res: Response) => {
            if (validateUpdate(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).updateOne(
                        {_id: req.params.id},
                        req.body,
                        (err: NodeJS.ErrnoException) => {
                            if (!err) {
                                res.json({status: 'OK'});
                            } else {
                                // TODO: Send 404 status code when entity is not found
                                res.status(500);
                                res.json({
                                    message: `Could not update ${collection}: ${err}`
                                });
                            }
                        }
                    );
                } else {
                    database.models.get(collection).update(req.body, { where: { id: req.params.id } })
                        .then(() => {
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            // TODO: Send 404 status code when entity is not found
                            res.status(500);
                            res.json({
                                message: `Could not update ${collection}: ${err}`
                            });
                        });
                }  
            }
        }
    );
}

/**
 * generateDelete
 * Returns the DELETE '/' route
 * @param database: Database
 * @param collection: string
 */
export function generateDelete(database: Database, collection: string): Route {
    return new Route(
        '/:id',
        'DELETE',
        'DELETE ' + collection,
        (req: Request, res: Response) => {
            if (validateDelete(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).deleteOne({_id: req.params.id})
                        .exec(
                            (err: NodeJS.ErrnoException) => {
                                if (!err) {
                                    res.json({status: 'OK'});
                                } else {
                                    // TODO: Send 404 status code when entity is not found
                                    res.status(500);
                                    res.json({
                                        message: `Could not delete ${collection}: ${err}`
                                    });
                                }
                            }
                        );
                } else {
                    database.models.get(collection).destroy({ where: { id: req.params.id } })
                        .then(() => {
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            // TODO: Send 404 status code when entity is not found
                            res.status(500);
                            res.json({
                                message: `Could not delete ${collection}: ${err}`
                            });
                        });
                } 
            }
        }
    )
}

async function getIncludeList(models: Map<string, any>)
{
    const includes = new Array<any>();
    models.forEach((value: any, key: string) => {
        includes.push(value);
    });
    return includes;
}