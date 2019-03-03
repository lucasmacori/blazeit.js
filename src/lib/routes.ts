import {Route} from './classes/route';

/**
 * generateGet
 * Returns the GET '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateGet(models: Map<string, any>, collection: string) {
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
                                message: 'Could not get ' + collection + '\n' + err
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
export function generateGetById(models: Map<string, any>, collection: string) {
    return new Route(
        '/:id',
        'GET',
        'GET ' + collection + ' by id',
        (req, res) => {
            models.get(collection).findById(req.params.id)
                .exec(
                    (err: any, object: any) => {
                        if (!err) {
                            res.json(object);
                        } else {
                            res.status(500);
                            res.json({
                                message: 'Could not get ' + collection + '\n' + err
                            });
                        }
                    }
                );
        }
    )
}

/**
 * generateCreate
 * Returns the POST '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateCreate(models: Map<string, any>, collection: string) {
    return new Route(
        '/',
        'POST',
        'POST ' + collection,
        (req, res) => {
            models.get(collection).create(
                req.body,
                (err: any) => {
                    if (!err) {
                        res.json({status: 'OK'});
                    } else {
                        res.status(500);
                        res.json({
                            message: 'Could not create ' + collection + '\n' + err
                        });
                    }
                }
            );
        }
    );

}

/**
 * Returns the POST '/search' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateSearch(models: Map<string, any>, collection: string) {
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
                                message: 'Could not search for ' + collection + '\n' + err
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
export function generateUpdate(models: Map<string, any>, collection: string) {
    return new Route(
        '/',
        'PUT',
        'PUT ' + collection,
        (req, res) => {
            models.get(collection).updateOne(
                req.body,
                (err: any) => {
                    if (!err) {
                        res.json({status: 'OK'});
                    } else {
                        res.status(500);
                        res.json({
                            message: 'Could not update ' + collection + '\n' + err
                        });
                    }
                }
            );
        }
    );
}

/**
 * generateDelete
 * Returns the DELETE '/' route
 * @param models: Map<string, any>
 * @param collection: string
 */
export function generateDelete(models: Map<string, any>, collection: string) {
    return new Route(
        '/',
        'DELETE',
        'DELETE ' + collection,
        (req, res) => {
            models.get(collection).deleteOne(req.body)
                .exec(
                    (err: any) => {
                        if (!err) {
                            res.json({status: 'OK'});
                        } else {
                            res.status(500);
                            res.json({
                                message: 'Could not delete ' + collection + '\n' + err
                            });
                        }
                    }
                );
        }
    )
}