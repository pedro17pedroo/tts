import type { HourBank, InsertHourBank, TimeEntry, InsertTimeEntry } from "../../schema";
import type { AuthenticatedRequest as BaseAuthenticatedRequest } from "../../shared/base-types";

export type AuthenticatedRequest = BaseAuthenticatedRequest;
export type HourBankData = HourBank;
export type CreateHourBankData = InsertHourBank;
export type TimeEntryData = TimeEntry;
export type CreateTimeEntryData = InsertTimeEntry;

// Response types
export interface HourBanksResponse {
  hourBanks: HourBankData[];
}

export interface TimeEntryResponse {
  timeEntry: TimeEntryData;
}