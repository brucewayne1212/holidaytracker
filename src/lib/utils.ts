import { Holiday } from '../types/holiday';
import { eachDayOfInterval, isWeekend, isWithinInterval } from 'date-fns';

export function getWorkingDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end })
    .filter(date => !isWeekend(date));
}

export function calculateUsedDays(holidays: Holiday[]): number {
  return holidays.filter(h => h.type === 'annual-leave').length;
}

export function calculateRemainingDays(totalDays: number, usedDays: number): number {
  return totalDays - usedDays;
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end });
}