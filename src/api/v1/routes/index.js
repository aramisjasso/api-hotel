import { Router } from 'express';
import config from '../../../config/config'


import hotelRoutes from './hotel.routes';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);


    router.use('/hotels', hotelRoutes);

    return router;
};

module.exports = routerAPI;
