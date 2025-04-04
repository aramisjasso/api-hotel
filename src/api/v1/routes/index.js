import { Router } from 'express';
import config from '../../../config/config.js'; // Asegúrate de incluir la extensión .js
import hotelRoutes from './hotel.routes.js'; // Asegúrate de incluir la extensión .js

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);

    router.use('/hotels', hotelRoutes);

    return router;
};

export default routerAPI; // Cambia a export default para usar la sintaxis de ES Modules