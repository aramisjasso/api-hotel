import { Router } from 'express';
import config from '../../../config/config'


//import hotelRoutes from './hotel.routes';
import roomRoutes from './room.routes'

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);
    //router.use('/hotels', hotelRoutes);
    router.use('/hotels/:hotelId/rooms', roomRoutes);
    return router;
};

module.exports = routerAPI;
