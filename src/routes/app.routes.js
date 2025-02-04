import { Router } from "express";
import * as appControl from '../controllers/app.controller.js';

const router = Router();

router.get('/view', appControl.goView);

router.get('/layerReg', appControl.goLayerRegistration);

export default router;