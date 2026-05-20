import { Response } from 'express';
import { Lead } from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types/express.types';
import { ILeadQuery } from '../types/lead.types';

// GET /api/leads
export const getLeads = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    status,
    source,
    search,
    sort = 'latest',
    page = '1',
    limit = '10',
  } = req.query as ILeadQuery & Record<string, string>;

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, totalLeads] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalLeads / limitNum);

  sendResponse(res, 200, 'Leads fetched successfully', leads, {
    totalLeads,
    totalPages,
    currentPage: pageNum,
    limit: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
  });
});

// GET /api/leads/:id
export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }
  sendResponse(res, 200, 'Lead fetched successfully', lead);
});

// POST /api/leads
export const createLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user.id,
  });

  sendResponse(res, 201, 'Lead created successfully', lead);
});

// PUT /api/leads/:id
export const updateLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  // Sales users can only update leads they created; admins can update any
  if (req.user?.role !== 'admin' && String(lead.createdBy) !== req.user?.id) {
    throw new ApiError(403, 'You are not authorized to update this lead');
  }

  const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, 200, 'Lead updated successfully', updated);
});

// DELETE /api/leads/:id
export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  // Only admins can delete leads
  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Only admins can delete leads');
  }

  await Lead.findByIdAndDelete(req.params.id);
  sendResponse(res, 200, 'Lead deleted successfully');
});

// GET /api/leads/export/csv
export const exportLeadsCSV = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { status, source, search } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

    const header = 'Name,Email,Status,Source,Notes,AssignedTo,CreatedAt\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.name}","${l.email}","${l.status}","${l.source}","${l.notes || ''}","${l.assignedTo || ''}","${new Date(l.createdAt).toISOString()}"`
      )
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(header + rows);
  }
);
