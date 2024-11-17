import express from 'express';

import { getAllForms, getFormById, updateIPStatus, submitFormDB } from '../controllers/IPValuation.js';
import { getAllLawyers, getLawyersBySpecialization } from '../controllers/Users.js';
import { postLoginFlow, onboardUser } from '../controllers/Authentication.js';
import { getDueDiligence } from '../controllers/DueDiligence.js'
import { getMyIPs } from '../controllers/IPTokenization.js';

const router = express.Router();

// Signup & Onboarding
router.post('/postLoginFlow', postLoginFlow);

// Signup & Onboarding
router.post('/onboardUser', onboardUser);

// IP Valuation
router.get('/ipValuation/getAllForms', getAllForms);
router.get('/ipValuation/getFormById', getFormById);
router.post('/ipValuation/submitForm', submitFormDB);
router.post('/ipValuation/updateIPStatus', updateIPStatus);
router.get('/ipValuation/getDueDiligence', getDueDiligence);

// Legal
router.get('/legal/getAllLawyers', getAllLawyers);
router.get('/legal/getLawyersBySpecialization', getLawyersBySpecialization);

// IP Tokenization
router.get('/ipTokenization/getMyIPs', getMyIPs);

export default router;
