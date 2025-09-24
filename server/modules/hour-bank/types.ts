import { type Request } from "express";
import type { HourBank, InsertHourBank, TimeEntry, InsertTimeEntry } from "@shared/schema";

export type HourBankData = HourBank;
export type CreateHourBankData = InsertHourBank;
export type TimeEntryData = TimeEntry;
export type CreateTimeEntryData = InsertTimeEntry;

// Request types
export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
  };
}

// Response types
export interface HourBanksResponse {
  hourBanks: HourBankData[];
}

export interface TimeEntryResponse {
  timeEntry: TimeEntryData;
}