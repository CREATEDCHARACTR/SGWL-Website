import React, { useState, useMemo } from 'react';
import { Session } from '../types';
import Card from './ui/Card';

interface CalendarViewProps {
  sessions: Session[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ sessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const daysInMonth = useMemo(() => {
    const days = [];
    const startingDay = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday...

    // Add blank days for the first week
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, Session[]>();
    sessions.forEach(session => {
      const dateKey = new Date(session.sessionDetails.dateTime).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(session);
    });
    return map;
  }, [sessions]);

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold dark:text-white">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="space-x-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button>
            <button onClick={() => setCurrentDate(new Date())} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Today</button>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-500 dark:text-gray-400 py-2">{day}</div>
          ))}
          {daysInMonth.map((day, index) => (
            <div key={index} className={`border dark:border-gray-700 h-24 sm:h-32 p-1.5 overflow-y-auto ${day ? '' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
              {day && (
                <>
                  <span className={`font-semibold text-sm ${new Date().toDateString() === day.toDateString() ? 'bg-brand-primary text-white rounded-full px-2 py-1' : ''}`}>
                    {day.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {(sessionsByDate.get(day.toDateString()) || []).map(session => (
                        <div key={session.id} className="bg-brand-primary/20 text-brand-primary dark:text-brand-accent p-1 rounded-md text-xs truncate">
                            {session.sessionDetails.type}
                        </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CalendarView;
