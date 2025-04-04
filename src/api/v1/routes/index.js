import { Router } from 'express';
<<<<<<< HEAD
import config from '../../../config/config.js'; // Asegúrate de incluir la extensión .js
import hotelRoutes from './hotel.routes.js'; // Asegúrate de incluir la extensión .js
=======
import config from '../../../config/config'


//import hotelRoutes from './hotel.routes';
import roomRoutes from './room.routes'
>>>>>>> ae0745ad9059ecc01f53901de9c8996116b21f85

const routerAPI = (app) => {
    const router = Router();
    const api = config.API_URL;

    app.use(api, router);
<<<<<<< HEAD

    router.use('/hotels', hotelRoutes);

=======
    //router.use('/hotels', hotelRoutes);
    router.use('/hotels/:hotelId/rooms', roomRoutes);
>>>>>>> ae0745ad9059ecc01f53901de9c8996116b21f85
    return router;
};

export default routerAPI; // Cambia a export default para usar la sintaxis de ES Modules