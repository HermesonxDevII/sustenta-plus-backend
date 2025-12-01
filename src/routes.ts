import { Router } from 'express';
import AuthController from './controllers/AuthController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { AbilityMiddleware } from './middlewares/AbilityMiddleware';
import ReportControllerInstance from './controllers/ReportController';
import multer from 'multer';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = Router();

const authenticatedRoutes = Router().use(AuthMiddleware);

const adminRoutes = Router().use(AbilityMiddleware('admin'));
const userRoutes = Router().use(AbilityMiddleware('user'));
const collectorRoutes = Router().use(AbilityMiddleware('collector'));

routes.get('/', (req, res) => {
  return res.json({ message: 'API Sustenta Plus is running!' });
});

routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);

adminRoutes.get('/report', ReportControllerInstance.index);
adminRoutes.put('/report/:id', ReportControllerInstance.update);
adminRoutes.patch('/report/approve/:id', ReportControllerInstance.approve);

collectorRoutes.get('/teste', (req, res) => {
  return res.json({ message: 'OK collector' });
});

userRoutes.get('/report', ReportControllerInstance.index);
userRoutes.post('/report', upload.array('images'), ReportControllerInstance.store);

authenticatedRoutes.use('/admin', adminRoutes);
authenticatedRoutes.use('/user', userRoutes);
authenticatedRoutes.use('/collector', collectorRoutes);
routes.use(authenticatedRoutes);

export default routes;
