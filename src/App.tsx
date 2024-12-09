import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { HolidayForm } from './components/HolidayForm';
import { HolidaySummary } from './components/HolidaySummary';
import { FirestoreStatus } from './components/FirestoreStatus';
import { HolidayType } from './types/holiday';
import { DEFAULT_TOTAL_DAYS } from './lib/constants';
import { useHolidays } from './hooks/useHolidays';
import type { DateRange } from 'react-day-picker';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [totalDays, setTotalDays] = useState(DEFAULT_TOTAL_DAYS);
  const { holidays, addHoliday, addHolidayRange } = useHolidays();

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedRange(undefined);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    if (range?.from && range?.to) {
      setSelectedDate(undefined);
    }
  };

  const handleHolidaySubmit = async (type: HolidayType, description: string) => {
    if (selectedRange?.from && selectedRange?.to) {
      await addHolidayRange(selectedRange.from, selectedRange.to, type, description);
      setSelectedRange(undefined);
    } else if (selectedDate) {
      await addHoliday(selectedDate, type, description);
      setSelectedDate(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Holiday Tracker</h1>
          <p className="mt-2 text-gray-600">Academic Year 2024-2025</p>
        </div>

        <HolidaySummary 
          totalDays={totalDays} 
          holidays={holidays}
          onTotalDaysChange={setTotalDays}
        />

        <div className="grid grid-cols-1 gap-8">
          <Calendar
            holidays={holidays}
            onDayClick={handleDayClick}
            selectedDate={selectedDate}
            selectedRange={selectedRange}
            onRangeSelect={handleRangeSelect}
          />
          
          {(selectedDate || (selectedRange?.from && selectedRange?.to)) && (
            <HolidayForm
              selectedDate={selectedDate}
              selectedRange={selectedRange}
              onSubmit={handleHolidaySubmit}
              onCancel={() => {
                setSelectedDate(undefined);
                setSelectedRange(undefined);
              }}
            />
          )}
        </div>
      </div>
      <FirestoreStatus />
    </div>
  );
}

export default App;