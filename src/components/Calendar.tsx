import React, { useState } from 'react';
import Button from './Button';
import Input from './Input/Input';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Colors } from '@/styles/styles';
import { MONTH_NAMES, WEEK_DAYS } from '@/lib/utils/DateUtils';

export default function DatePicker1() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const formatDate = (day: number, month: number, year: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    return `${dayStr}/${monthStr}/${year}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(new Date(Number(event.target.value), month, 1));
  };

  const handleSelectDate = (day: number) => {
    setSelectedDate(formatDate(day, month, year));
    setIsCalendarOpen(false);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
    setIsCalendarOpen(false);
  };

  const handleDone = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative">
      <div onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
        <Input
          type="text"
          placeholder="Selecciona una fecha"
          value={selectedDate || ''}
          icon={CalendarIcon}
          iconColor={Colors.textLowContrast}
          iconPosition="right"
          borderSize="1px"
          borderColor={Colors.stroke}
        />
      </div>

      {isCalendarOpen && (
        <div className="absolute mt-2 h-[532px] w-[509px] rounded-md bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between px-4">
            <button
              onClick={handlePrevMonth}
              className="rounded-md p-2 text-lg hover:bg-gray-200"
            >
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-xl font-medium">{MONTH_NAMES[month]}</span>
              <input
                type="number"
                value={year}
                onChange={handleYearChange}
                className="w-16 appearance-none bg-transparent text-center text-lg font-medium outline-none"
                min="1900"
                max="2100"
              />
            </div>
            <button
              onClick={handleNextMonth}
              className="rounded-md p-2 text-lg hover:bg-gray-200"
            >
              <ChevronRightIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-2 text-center font-semibold">
            {WEEK_DAYS.map((day, index) => (
              <div key={index} className="text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="h-12 w-12"></div>
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const dayNumber = i + 1;
              const currentFormattedDate = formatDate(dayNumber, month, year);
              return (
                <button
                  key={dayNumber}
                  onClick={() => handleSelectDate(dayNumber)}
                  className={`h-12 w-12 rounded-md text-lg font-medium ${
                    selectedDate === currentFormattedDate
                      ? 'bg-[#1C2143] text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              variant="gray"
              paddingX={6}
              paddingY={3}
              textSize="base"
              width="215px"
              height="50px"
              onClick={handleClearDate}
            >
              Quitar
            </Button>

            <Button
              variant="submit"
              paddingX={6}
              paddingY={3}
              textSize="base"
              width="215px"
              height="50px"
              onClick={handleDone}
            >
              Hecho
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
