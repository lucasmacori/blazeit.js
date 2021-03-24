export function validateBody(req: any, res: any): boolean {
    if (!req.body) {
        res.status(400);
        res.json({message: 'No body was provided'});
        return false;
    } else {
        return true;
    }
}

/**
 * validateGetById
 * Validates the request for getting a row by id
 * @param req
 * @param res
 * @returns : 'true' if valid, 'false' if not. HTTP response is automatically taken care of
 */
export function validateGetById(req: any, res: any): boolean {
    if (!req.params.id) {
        res.status(400);
        res.json({message: 'No \'id\' was provided'});
        return false;
    } else {
        return true;
    }
}

/**
 * validateCreate
 * Validates the request for creating a new row
 * @param req
 * @param res
 * @returns : 'true' if valid, 'false' if not. HTTP response is automatically taken care of
 */
export function validateCreate(req: any, res: any): boolean {
    if (validateBody(req, res)) {
        if (req.body.id) {
            res.status(400);
            res.json({message: 'No \'id\' can be provided when creating a new row'});
            return false;
        } else {
            return true;
        }
    }
}

/**
 * validateUpdate
 * Validates the request for updating a existing row
 * @param req
 * @param res
 * @returns : 'true' if valid, 'false' if not. HTTP response is automatically taken care of
 */
export function validateUpdate(req: any, res: any): boolean {
    return validateBody(req, res);
}

/**
 * validateDelete
 * Validates the request for deleting a existing row
 * @param req
 * @param res
 * @returns : 'true' if valid, 'false' if not. HTTP response is automatically taken care of
 */
export function validateDelete(req: any, res: any): boolean {
    return validateBody(req, res);
}