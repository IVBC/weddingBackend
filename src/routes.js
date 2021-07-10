import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import FamilyController from './app/controllers/FamilyController';
import GuestController from './app/controllers/GuestController';

import FileController from './app/controllers/FileController';
import StatisticController from './app/controllers/StatisticController';
import ConfirmationGuestsController from './app/controllers/ConfirmationGuestsController';
import SetPresentGuestsController from './app/controllers/SetPresentGuestsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/files/:code/photo', upload.single('file'), FileController.store);
routes.get('/photos', FileController.index);
routes.delete('/photos/:id', FileController.delete);

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

routes.put('/guests/confirmation', ConfirmationGuestsController.update);
routes.put('/guests/present', SetPresentGuestsController.update);

routes.get('/guests', GuestController.index);
routes.get('/guests/:id', GuestController.show);
routes.post('/guests', GuestController.store);
routes.put('/guests/:id', GuestController.update);
routes.delete('/guests/:id', GuestController.delete);

/**
 * Receptionnist
 */

routes.get('/receptionist/statistic', StatisticController.index);
routes.get('/receptionist/statistic/:numberTable', StatisticController.show);

export default routes;
