import React, { useState } from 'react';
import { Calendar, Clock, Plus, Minus } from 'lucide-react';
import { Holiday } from '../types/holiday';

interface HolidaySummaryProps {
  totalDays: number;
  holidays: Holiday[];
  onTotalDaysChange: (days: number) => void;
}

export function HolidaySummary({ totalDays, holidays, onTotalDaysChange }: HolidaySummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(totalDays.toString());
  
  const usedDays = holidays.filter((h) => h.type === 'annual-leave').length;
  const remainingDays = totalDays - usedDays;

  const handleIncrement = () => {
    onTotalDaysChange(totalDays + 1);
    setInputValue((totalDays + 1).toString());
  };

  const handleDecrement = () => {
    if (totalDays > usedDays) {
      onTotalDaysChange(totalDays - 1);
      setInputValue((totalDays - 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const newValue = Math.max(usedDays, parseInt(inputValue) || 0);
    onTotalDaysChange(newValue);
    setInputValue(newValue.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Total Days</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="p-1 rounded hover:bg-gray-100"
              disabled={totalDays <= usedDays}
            >
              <Minus className="w-4 h-4" />
            </button>
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-16 text-2xl font-bold text-center border rounded"
                autoFocus
              />
            ) : (
              <span 
                className="text-2xl font-bold cursor-pointer" 
                onClick={() => setIsEditing(true)}
              >
                {totalDays}
              </span>
            )}
            <button
              onClick={handleIncrement}
              className="p-1 rounded hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 text-green-600">
          <Clock className="w-5 h-5" />
          <h3 className="font-semibold">Days Used</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{usedDays}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 text-purple-600">
          <Calendar className="w-5 h-5" />
          <h3 className="font-semibold">Days Remaining</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{remainingDays}</p>
      </div>
    </div>
  );
}