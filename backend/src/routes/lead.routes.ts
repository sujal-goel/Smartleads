import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';
import { validate } from '../middlewares/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validator';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

router.get('/export/csv', exportLeadsCSV);
router.get('/', validate(leadQuerySchema), getLeads);
router.get('/:id', getLeadById);
router.post('/', validate(createLeadSchema), createLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
