import {Request, Response} from 'express';
import {Route} from './classes/route';
import {validateCreate, validateDelete, validateGetById, validateUpdate} from "./validators";
import { Database } from './database';

/**
 * generateGet
 * Returns the GET '/' route
 * @param database: Database
 * @param collection: string
 */
export function generateGet(database: Database, collection: string): Route {
    return new Route(
        '/',
        'GET',
        'GET ' + collection,
        (req: Request, res: Response) => {
            if (database.type === 'mongodb') {
                database.models.get(collection).find({})
                    .exec(
                        (err: NodeJS.ErrnoException, objects: Array<any>) => {
                            if (!err) {
                                res.json(objects);
                            } else {
                                res.status(500);
                                res.json({
                                    message: 'Could not get ' + collection + ': ' + err
                                });
                            }
                        }
                    );
            } else {
                database.models.get(collection).findAll()
                    .then((objects: Array<any>) => {
                        res.json(objects);
                    })
                    .catch((err: NodeJS.ErrnoException) => {
                        res.status(500);
                        res.json({
                            message: 'Could not get ' + collection + ': ' + err
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
                                    res.json((object) ? object : {});
                                } else {
                                    res.status(500);
                                    res.json({
                                        message: 'Could not get ' + collection + ': ' + err
                                    });
                                }
                            }
                        );
                } else {
                    database.models.get(collection).findByPk(req.params.id)
                        .then((object: any) => {
                            res.json(object);
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                            res.json({
                                message: 'Could not get ' + collection + ': ' + err
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
                                res.json({status: 'OK'});
                            } else {
                                res.status(500);
                                res.json({
                                    message: 'Could not create ' + collection + ': ' + err
                                });
                            }
                        }
                    );
                } else {
                    database.models.get(collection).create(req.body)
                        .then(() => {
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                                res.json({
                                    message: 'Could not create ' + collection + ': ' + err
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
                                    message: 'Could not search for ' + collection + ': ' + err
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
                            message: 'Could not search for ' + collection + ': ' + err
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
        '/',
        'PUT',
        'PUT ' + collection,
        (req: Request, res: Response) => {
            if (validateUpdate(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).updateOne(
                        {_id: req.body._id},
                        req.body,
                        (err: NodeJS.ErrnoException) => {
                            if (!err) {
                                res.json({status: 'OK'});
                            } else {
                                res.status(500);
                                res.json({
                                    message: 'Could not update ' + collection + ': ' + err
                                });
                            }
                        }
                    );
                } else {
                    database.models.get(collection).update(req.body, { where: { id: req.body.id } })
                        .then(() => {
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                            res.json({
                                message: 'Could not update ' + collection + ': ' + err
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
        '/',
        'DELETE',
        'DELETE ' + collection,
        (req: Request, res: Response) => {
            if (validateDelete(req, res)) {
                if (database.type === 'mongodb') {
                    database.models.get(collection).deleteOne({_id: req.body._id})
                        .exec(
                            (err: NodeJS.ErrnoException) => {
                                if (!err) {
                                    res.json({status: 'OK'});
                                } else {
                                    res.status(500);
                                    res.json({
                                        message: 'Could not delete ' + collection + ': ' + err
                                    });
                                }
                            }
                        );
                } else {
                    database.models.get(collection).destroy({ where: { id: req.body.id } })
                        .then(() => {
                            res.json({status: 'OK'});
                        })
                        .catch((err: NodeJS.ErrnoException) => {
                            res.status(500);
                            res.json({
                                message: 'Could not delete ' + collection + ': ' + err
                            });
                        });
                } 
            }
        }
    )
}