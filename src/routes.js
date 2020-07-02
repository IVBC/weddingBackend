import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import FamilyController from './app/controllers/FamilyController';
import GuestController from './app/controllers/GuestController';

import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/files/:code/photo', upload.single('file'), FileController.store);

/**
 * Families
 */
routes.get('/families', FamilyController.index);
routes.get('/families/:code', FamilyController.show);
routes.post('/families', FamilyController.store);
routes.put('/families/:code', FamilyController.update);
routes.delete('/families/:code', FamilyController.delete);

/**
 * Guests
 */

routes.get('/guests', GuestController.index);
routes.get('/guests/:id', GuestController.show);
routes.post('/guests', GuestController.store);
routes.put('/guests/:id', GuestController.update);
routes.delete('/guests/:id', GuestController.delete);

export default routes;
