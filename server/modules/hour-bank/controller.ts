import { type Response } from "express";
import { HourBankService } from "./service";
import { AuthService } from "../auth/service";
import { z } from "zod";
import type { 
  AuthenticatedRequest,
  HourBanksResponse,
  TimeEntryResponse
} from "./types";

// Simple validation schemas
const createHourBankSchema = z.object({
  customerId: z.string(),
  totalHours: z.string(), // decimal field stored as string
  hourlyRate: z.string().optional(), // decimal field stored as string
  expiresAt: z.string().optional(),
});

const createTimeEntrySchema = z.object({
  ticketId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.string().optional(), // decimal field stored as string
  description: z.string().optional(),
  hourBankId: z.string().optional(),
});

export class HourBankController {
  private service: HourBankService;
  private authService: AuthService;

  constructor() {
    this.service = new HourBankService();
    this.authService = new AuthService();
  }

  async getHourBanks(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const hourBanks = await this.service.getHourBanksByTenant(user.tenantId);
      return res.json({ hourBanks });
    } catch (error) {
      console.error("Hour banks fetch error:", error);
      return res.status(500).json({ message: "Failed to fetch hour banks" });
    }
  }

  async createHourBank(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const validatedData = createHourBankSchema.parse(req.body);
      const hourBankData = {
        ...validatedData,
        tenantId: user.tenantId,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : undefined,
      };
      const hourBank = await this.service.createHourBank(hourBankData);
      
      return res.json({ hourBank });
    } catch (error) {
      console.error('Erro ao criar banco de horas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async createTimeEntry(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.id;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      const validatedData = createTimeEntrySchema.parse(req.body);
      const timeEntryData = {
        ...validatedData,
        userId: userId,
        startTime: new Date(validatedData.startTime),
        endTime: validatedData.endTime ? new Date(validatedData.endTime) : undefined,
      };

      const timeEntry = await this.service.createTimeEntry(timeEntryData);
      return res.json({ timeEntry });
    } catch (error) {
      console.error('Erro ao criar entrada de tempo:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateTimeEntry(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const timeEntry = await this.service.updateTimeEntry(id, updates);
      return res.json(timeEntry);
    } catch (error) {
      console.error("Time entry update error:", error);
      return res.status(500).json({ message: "Failed to update time entry" });
    }
  }
}