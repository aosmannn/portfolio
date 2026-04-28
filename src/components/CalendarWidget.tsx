'use client';

import { useEffect, useState } from 'react';

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; otherMonth: boolean; isToday: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, otherMonth: true, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false, isToday: d === today });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, otherMonth: true, isToday: false });
  }

  return (
    <div className="cal-widget">
      <div className="cal-header">
        {MONTHS[month]} {year}
      </div>
      <div className="cal-grid">
        <div className="cal-day-header">
          {DAY_HEADERS.map((h) => <span key={h}>{h}</span>)}
        </div>
        <div className="cal-days">
          {cells.map((c, i) => (
            <div
              key={i}
              className={`cal-day${c.isToday ? ' today' : ''}${c.otherMonth ? ' other-month' : ''}`}
            >
              {c.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
