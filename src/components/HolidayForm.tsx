import React, { useState } from 'react';
import { format, differenceInBusinessDays } from 'date-fns';
import { HolidayType } from '../types/holiday';
import type { DateRange } from 'react-day-picker';

interface HolidayFormProps {
  selectedDate: Date | undefined;
  selectedRange: DateRange | undefined;
  onSubmit: (type: HolidayType, description: string) => void;
  onCancel: () => void;
}

export function HolidayForm({ selectedDate, selectedRange, onSubmit, onCancel }: HolidayFormProps) {
  const [type, setType] = useState<HolidayType>('annual-leave');
  const [description, setDescription] = useState('');

  if (!selectedDate && !selectedRange?.from && !selectedRange?.to) return null;

  const businessDays = selectedRange?.from && selectedRange?.to
    ? differenceInBusinessDays(selectedRange.to, selectedRange.from) + 1
    : 1;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {selectedDate ? (
          `Add Holiday - ${format(selectedDate, 'dd MMMM yyyy')}`
        ) : (
          selectedRange?.from && selectedRange?.to ? (
            `Add Holiday - ${format(selectedRange.from, 'dd MMM yyyy')} to ${format(selectedRange.to, 'dd MMM yyyy')} (${businessDays} working days)`
          ) : ''
        )}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as HolidayType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="annual-leave">Annual Leave</option>
            <option value="public-holiday">Public Holiday</option>
            <option value="workplace-closure">Workplace Closure</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Optional description"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(type, description)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}