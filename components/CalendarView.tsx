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

  // Get upcoming sessions for the current month
  const upcomingSessions = useMemo(() => {
    const now = new Date();
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.sessionDetails.dateTime);
        // Sessions in the current viewed month that are in the future or today
        return sessionDate.getMonth() === currentDate.getMonth() &&
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
      })
      .sort((a, b) => new Date(a.sessionDetails.dateTime).getTime() - new Date(b.sessionDetails.dateTime).getTime());
  }, [sessions, currentDate]);

  return (
    <div className="space-y-6">
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

      {/* Upcoming Appointments List */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold dark:text-white mb-4">
            📅 Upcoming This Month ({upcomingSessions.length})
          </h3>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map(session => {
                const sessionDate = new Date(session.sessionDetails.dateTime);
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="text-center bg-brand-primary/10 dark:bg-brand-primary/20 rounded-lg p-2 min-w-[60px]">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          {sessionDate.toLocaleDateString('default', { weekday: 'short' })}
                        </div>
                        <div className="text-xl font-bold text-brand-primary dark:text-brand-accent">
                          {sessionDate.getDate()}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {session.sessionDetails.type}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.clientName || 'Client TBD'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {sessionDate.toLocaleTimeString('default', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.sessionDetails.location || 'Location TBD'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No upcoming appointments this month.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalendarView;
