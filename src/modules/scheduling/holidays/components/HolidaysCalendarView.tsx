"use client";

import React from 'react';
import { IHoliday } from '../types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { useLanguage } from '@/providers/language-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface HolidaysCalendarViewProps {
  holidays: IHoliday[];
}

const cellSize = 112;

const HolidaysCalendarView: React.FC<HolidaysCalendarViewProps> = ({ holidays }) => {
  const { isRTL } = useLanguage();
  const [current, setCurrent] = React.useState<Date>(new Date());

  const dateMap = React.useMemo(() => {
    const m = new Map<string, IHoliday[]>();
    holidays.forEach(h => {
      const from = h.from_date ? new Date(h.from_date) : null;
      const to = h.to_date ? new Date(h.to_date) : null;
      if (!from) return;
      const end = to || from;
      for (let d = new Date(from); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        const arr = m.get(key) || [];
        arr.push(h);
        m.set(key, arr);
      }
    });
    return m;
  }, [holidays]);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = calendarStart; d <= calendarEnd; d = addDays(d, 1)) {
    days.push(new Date(d));
  }

  const title = format(current, 'MMMM yyyy');

  const prevMonth = () => setCurrent((d) => subMonths(d, 1));
  const nextMonth = () => setCurrent((d) => addMonths(d, 1));

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={nextMonth} aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">Large square calendar view</div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3 mt-3" style={{ gridAutoRows: `${cellSize}px` }}>
        {days.map((day) => {
          const key = day.toISOString().split('T')[0];
          const items = dateMap.get(key) || [];
          const inMonth = isSameMonth(day, current);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={key} className={`relative-lg overflow-hidden ${inMonth ? 'bg-card' : 'bg-muted/10'} ${isToday ? 'ring-2 ring-primary' : ''}`}>
              <div className="p-3 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className={`text-sm font-semibold ${inMonth ? 'text-card-foreground' : 'text-muted-foreground'}`}>{format(day, 'd')}</div>
                  {items.length > 0 && (
                    <div className="text-[11px] text-muted-foreground">{items.length} {items.length===1? 'holiday' : 'holidays'}</div>
                  )}
                </div>

                <div className="mt-2 flex-1 flex flex-col gap-2">
                  {items.slice(0,3).map(h => (
                    <Popover key={h.holiday_id}>
                      <PopoverTrigger asChild>
                        <button className="w-full text-left bg-accent/5 dark:bg-accent/10 rounded-md px-2 py-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-sm text-card-foreground">{h.holiday_eng}</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="space-y-1">
                          <div className="font-medium">{h.holiday_eng}</div>
                          {h.remarks && <div className="text-xs text-muted-foreground">{h.remarks}</div>}
                          <div className="text-xs text-muted-foreground">{h.from_date ? format(parseISO(h.from_date), 'MMM dd') : ''}{h.to_date && h.to_date !== h.from_date ? ` - ${format(parseISO(h.to_date), 'MMM dd')}` : ''}</div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}

                  {items.length > 3 && (
                    <div className="text-xs text-muted-foreground mt-auto">+{items.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-2">Legend</h4>
        <div className="flex flex-wrap gap-2">
          {holidays.slice(0, 8).map(h => (
            <div key={h.holiday_id} className="flex items-center gap-2 bg-card/50 p-2 rounded-md">
              <div className="text-sm font-medium">{isRTL ? h.holiday_arb : h.holiday_eng}</div>
              <div className="text-xs text-muted-foreground">{format(parseISO(h.from_date), 'MMM dd')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolidaysCalendarView;
