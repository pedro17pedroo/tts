import { type Response } from "express";
import { HourBankService } from "./service";
import { AuthService } from "../auth/service";
import { insertHourBankSchema, insertTimeEntrySchema } from "@shared/schema";
import type { 
  AuthenticatedRequest,
  HourBanksResponse,
  TimeEntryResponse
} from "./types";

export class HourBankController {
  private service: HourBankService;
  private authService: AuthService;

  constructor() {
    this.service = new HourBankService();
    this.authService = new AuthService();
  }

  async getHourBanks(req: AuthenticatedRequest, res: Response<HourBanksResponse>) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const hourBanks = await this.service.getHourBanksByTenant(user.tenantId);
      res.json({ hourBanks });
    } catch (error) {
      console.error("Hour banks fetch error:", error);
      res.status(500).json({ message: "Failed to fetch hour banks" });
    }
  }

  async createHourBank(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user.claims.sub;
      const user = await this.authService.getUserById(userId);
      
      if (!user?.tenantId) {
        return res.status(400).json({ message: "User not associated with tenant" });
      }

      const data = insertHourBankSchema.parse({
        ...req.body,
        tenantId: user.tenantId,
      });

      const hourBank = await this.service.createHourBank(data);
      res.json(hourBank);
    } catch (error) {
      console.error("Hour bank creation error:", error);
      res.status(500).json({ message: "Failed to create hour bank" });
    }
  }

  async createTimeEntry(req: AuthenticatedRequest, res: Response<TimeEntryResponse>) {
    try {
      const userId = req.user.claims.sub;
      
      const data = insertTimeEntrySchema.parse({
        ...req.body,
        userId,
      });

      const timeEntry = await this.service.createTimeEntry(data);
      res.json({ timeEntry });
    } catch (error) {
      console.error("Time entry creation error:", error);
      res.status(500).json({ message: "Failed to create time entry" });
    }
  }

  async updateTimeEntry(req: AuthenticatedRequest, res: Response<TimeEntryResponse>) {
    try {
      const timeEntry = await this.service.updateTimeEntry(req.params.id, req.body);
      res.json({ timeEntry });
    } catch (error) {
      console.error("Time entry update error:", error);
      res.status(500).json({ message: "Failed to update time entry" });
    }
  }
}