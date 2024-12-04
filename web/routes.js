import express from 'express';
import { claimsget, insurnacePercentageget, orderget } from './controller.js';

const router = express.Router();

router.get("/getproduct" ,orderget )

router.get("/cretaeclaims" ,claimsget )

router.get('/insuranceget',insurnacePercentageget)

export { router as routes };