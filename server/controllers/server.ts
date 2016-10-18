import * as express from 'express';
import { IServer } from '../models/server';
import * as config from '../configs/config'
const pkg = require('../../package.json');

export function getInfo(req: express.Request, res: express.Response, next: express.NextFunction) {
    let server: IServer = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        url: config.setting.$server.$url
    };
    return res.json(server);
};