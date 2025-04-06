import { Router } from 'express';
import config from '../../../config/config.js';
import hotelRoutes from './hotel.routes.js';

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);

    router.use('/hotels', hotelRoutes);

    return router;
};

export default routerAPI;