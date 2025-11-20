import { Router } from 'express';
import AuthController from './controllers/AuthController'; 

const routes = Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'API Sustenta Plus is running!' });
});

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

export default routes;