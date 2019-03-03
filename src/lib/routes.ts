import {Route} from './classes/route';
import {validateCreate, validateDelete, validateGetById, validateUpdate} from "./validators";

/**
 * generateGet
 * Returns the GET '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateGet(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/',
        'GET',
        'GET ' + collection,
        (req, res) => {
            models.get(collection).find({})
                .exec(
                    (err: any, objects: Array<any>) => {
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
        }
    );
}

/**
 * generateGetById
 * Returns the GET '/:id' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateGetById(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/:id',
        'GET',
        'GET ' + collection + ' by id',
        (req, res) => {
            if (validateGetById(req, res)) {
                models.get(collection).findById(req.params.id)
                    .exec(
                        (err: any, object: any) => {
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
            }
        }
    )
}

/**
 * generateCreate
 * Returns the POST '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateCreate(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/',
        'POST',
        'POST ' + collection,
        (req, res) => {
            if (validateCreate(req, res)) {
                models.get(collection).create(
                    req.body,
                    (err: any) => {
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
            }
        }
    );

}

/**
 * Returns the POST '/search' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateSearch(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/search',
        'POST',
        'Search ' + collection,
        (req, res) => {
            models.get(collection).find(req.body)
                .exec(
                    (err: any, objects: Array<any>) => {
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
        }
    );
}

/**
 * generateUpdate
 * Returns the PUT '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateUpdate(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/',
        'PUT',
        'PUT ' + collection,
        (req, res) => {
            if (validateUpdate(req, res)) {
                models.get(collection).updateOne(
                    {_id: req.body._id},
                    req.body,
                    (err: any) => {
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
            }
        }
    );
}

/**
 * generateDelete
 * Returns the DELETE '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateDelete(models: Map<string, any>, collection: string): Route {
    return new Route(
        '/',
        'DELETE',
        'DELETE ' + collection,
        (req, res) => {
            if (validateDelete(req, res)) {
                models.get(collection).deleteOne({_id: req.body._id})
                    .exec(
                        (err: any) => {
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
            }
        }
    )
}