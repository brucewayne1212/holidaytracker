export type HolidayType = 'annual-leave' | 'public-holiday' | 'workplace-closure';

export interface Holiday {
  id: string;
  date: string;
  type: HolidayType;
  description?: string;
}

export interface HolidaySettings {
  totalDays: number;
  academicYear: {
    start: string;
    end: string;
  };
}