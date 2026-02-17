import { SchedulePayload } from "@/data/scheduleData";

const STORAGE_KEY = "ng_last_submission";

export const saveSubmission = (payload: SchedulePayload): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const loadSubmission = (): SchedulePayload | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
