import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { CalendarIcon } from "@heroicons/react/24/outline";
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  date: Date;
  changeDate: (date: Date) => void;
  className?: string;
}

export const DatePicker = ({ date, changeDate, className = "" }: DatePickerProps) => {
  const [show, setShow] = useState(false);

  const handleSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      changeDate(selectedDate);
      setShow(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`relative w-80 max-[60rem]:w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={formatDate(date)}
          onClick={() => setShow(!show)}
          className="w-full h-12 px-5 text-center font-work-sans text-lg border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {show && (
        <>
          {/* Overlay to close calendar when clicking outside */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShow(false)}
          />
          
          {/* Calendar */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20">
            <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
              <DayPicker
                mode="single"
                onSelect={handleSelect}
                selected={date}
                required={false}
                className="rdp-custom"
              />
            </div>
          </div>
        </>
      )}
      
      <style>{`
        .rdp-custom {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #3b82f6;
          --rdp-background-color: #dbeafe;
          --rdp-accent-color-dark: #1d4ed8;
          --rdp-background-color-dark: #bfdbfe;
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 2px solid var(--rdp-accent-color);
        }
      `}</style>
    </div>
  );
};