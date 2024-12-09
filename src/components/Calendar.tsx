import React from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, isWeekend, addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Holiday } from '../types/holiday';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
  holidays: Holiday[];
  onDayClick: (date: Date) => void;
  selectedRange: DateRange | undefined;
  onRangeSelect: (range: DateRange | undefined) => void;
  selectedDate?: Date;
}

export function Calendar({ holidays, onDayClick, selectedDate, selectedRange, onRangeSelect }: CalendarProps) {
  const modifiers = {
    annualLeave: holidays
      .filter((h) => h.type === 'annual-leave')
      .map((h) => new Date(h.date)),
    publicHoliday: holidays
      .filter((h) => h.type === 'public-holiday')
      .map((h) => new Date(h.date)),
    workplaceClosure: holidays
      .filter((h) => h.type === 'workplace-closure')
      .map((h) => new Date(h.date)),
    weekend: (date: Date) => isWeekend(date),
  };

  const modifiersStyles = {
    annualLeave: { backgroundColor: '#22c55e' },
    publicHoliday: { backgroundColor: '#3b82f6' },
    workplaceClosure: { backgroundColor: '#f59e0b' },
    weekend: { color: '#94a3b8' },
  };

  const css = `
    .rdp {
      width: 100%;
      margin: 0;
    }
    .rdp-months {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1rem;
    }
    @media (min-width: 768px) {
      .rdp-months {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .rdp-months {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .rdp-month {
      width: 100%;
    }
    .rdp-table {
      width: 100%;
      table-layout: fixed;
    }
    .rdp-cell {
      border: 1px solid #e5e7eb;
      width: calc(100% / 7);
      position: relative;
      padding: 0;
    }
    .rdp-cell::before {
      content: '';
      display: block;
      padding-bottom: 100%;
    }
    .rdp-day {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
    }
    .rdp-day:hover:not([disabled]) {
      background-color: #f3f4f6;
    }
    .rdp-head_cell {
      font-weight: 600;
      color: #4b5563;
      padding: 0.75rem 0;
      text-align: center;
    }
    .rdp-caption {
      padding: 1rem;
    }
    .rdp-nav {
      margin-left: auto;
      margin-right: auto;
    }
    .rdp-day_range_start:not(.rdp-day_range_end),
    .rdp-day_range_end:not(.rdp-day_range_start) {
      border-radius: 0;
    }
    .rdp-day_range_middle {
      border-radius: 0;
      background-color: #e5e7eb;
    }
  `;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      <style>{css}</style>
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold">Academic Calendar</h2>
      </div>
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onRangeSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="w-full border rounded-md p-4"
        fromDate={new Date('2024-09-01')}
        toDate={new Date('2025-08-31')}
        showOutsideDays={true}
        disabled={[{ dayOfWeek: [0, 6] }]}
        numberOfMonths={3}
      />
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
          <span>Annual Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3b82f6]" />
          <span>Public Holiday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f59e0b]" />
          <span>Workplace Closure</span>
        </div>
      </div>
    </div>
  );
}