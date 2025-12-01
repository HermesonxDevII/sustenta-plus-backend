import { Router } from 'express'
import AuthController from './controllers/AuthController'
import { AuthMiddleware } from './middlewares/AuthMiddleware'
import { AbilityMiddleware } from './middlewares/AbilityMiddleware'
import ReportControllerInstance from './controllers/ReportController'
import CollectionControllerInstance from './controllers/CollectionController'
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
adminRoutes.patch('/report/accept/:id', ReportControllerInstance.accept);
adminRoutes.patch('/report/refuse/:id', ReportControllerInstance.refuse);
adminRoutes.get('/collection', CollectionControllerInstance.index);
adminRoutes.put('/collection/:id', CollectionControllerInstance.update);

collectorRoutes.get('/collection', CollectionControllerInstance.index);
collectorRoutes.get('/my-collections', CollectionControllerInstance.myCollections);
collectorRoutes.patch('/scheduling/accept/:id', CollectionControllerInstance.accept);

userRoutes.get('/report', ReportControllerInstance.index);
userRoutes.post('/report', upload.array('images'), ReportControllerInstance.store);
userRoutes.delete('/report/:id', ReportControllerInstance.destroy);
userRoutes.get('/collection', CollectionControllerInstance.index);
userRoutes.post('/collection', upload.array('images'), CollectionControllerInstance.store);

authenticatedRoutes.use('/admin', adminRoutes);
authenticatedRoutes.use('/user', userRoutes);
authenticatedRoutes.use('/collector', collectorRoutes);
routes.use(authenticatedRoutes);

export default routes;
