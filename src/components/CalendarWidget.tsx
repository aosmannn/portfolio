'use client';

import { useEffect, useRef, useState } from 'react';

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarWidget() {
  const [now, setNow] = useState<Date | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setNow(new Date());

    // Load saved position or default to bottom-right
    const saved = localStorage.getItem('calendar-pos');
    if (saved) {
      try {
        setPos(JSON.parse(saved));
      } catch {
        setPos(getDefaultPos());
      }
    } else {
      setPos(getDefaultPos());
    }
  }, []);

  function getDefaultPos() {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    return { x: w - 200, y: h - 290 };
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - (pos?.x ?? 0),
      y: e.clientY - (pos?.y ?? 0),
    };
    e.preventDefault();

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const newPos = {
        x: ev.clientX - dragOffset.current.x,
        y: ev.clientY - dragOffset.current.y,
      };
      setPos(newPos);
    };

    const onMouseUp = (ev: MouseEvent) => {
      dragging.current = false;
      const finalPos = {
        x: ev.clientX - dragOffset.current.x,
        y: ev.clientY - dragOffset.current.y,
      };
      localStorage.setItem('calendar-pos', JSON.stringify(finalPos));
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!now || !pos) return null;

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
    <div
      className="cal-widget"
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 50 }}
    >
      <div
        className="cal-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab' }}
      >
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
