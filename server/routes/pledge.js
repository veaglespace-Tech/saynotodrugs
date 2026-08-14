import express from 'express';
import { 
  createPledge, 
  initDonation, 
  donationSuccess, 
  donationFailure, 
  completePledge, 
  verifyCertificate,
  downloadCertificate
} from '../controllers/pledgeController.js';

const router = express.Router();

router.post('/create', createPledge);
router.post('/donate/init', initDonation);
router.post('/donate/success', donationSuccess);
router.post('/donate/failure', donationFailure);
router.post('/complete', completePledge);
router.get('/verify/:certId', verifyCertificate);
router.get('/download/:certId', downloadCertificate);

export default router;
