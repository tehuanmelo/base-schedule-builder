export const COACHES = [
  { ps: "PS1418", name: "Rodrigo Ramos" },
  { ps: "PS1677", name: "Felipe Silveira" },
  { ps: "PS1861", name: "Diego Lameira" },
  { ps: "PS1986", name: "Eduardo Coutinho" },
  { ps: "PS2700", name: "Elias Souza" },
];

export const BASES = [
  "J15.02 INSTITUTE SWEIHAN",
  "J15.03 MAHAWI",
  "J15.05 UM AL ASHTAN",
  "J15.18 JABEL AL DHANNA",
  "J15.51 KHALIFA PORT",
  "J15.59 NGG RAK SEIH AL BANAH",
];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export interface DaySchedule {
  classes: number;
  startTimes: string[];
}

export interface SchedulePayload {
  coach: { ps: string; name: string };
  base: string;
  schedule: Record<DayOfWeek, DaySchedule>;
  submittedAt: string;
}
