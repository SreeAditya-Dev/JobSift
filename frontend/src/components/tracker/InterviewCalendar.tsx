'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addMinutes } from 'date-fns';
import { Application, ApplicationStatus } from '@/types';
import { applicationsApi } from '@/lib/api';
import {
  EventCalendar,
  type EventCalendarApi,
} from '@/components/reui/event-calendar/event-calendar';
import { EventCalendarContent } from '@/components/reui/event-calendar/event-calendar-content';
import { EventCalendarNav } from '@/components/reui/event-calendar/event-calendar-nav';
import type { CalendarEvent, CalendarView, EventCalendarProposedUpdate } from '@/components/reui/event-calendar/event-calendar-types';
import { Card, CardContent } from '@/components/ui/card';

interface InterviewCalendarProps {
  applications: Application[];
  onRefresh: () => void;
}

const STATUS_COLOR: Record<ApplicationStatus, string> = {
  bookmarked: 'var(--color-stone-400)',
  applied: 'var(--color-blue-500)',
  screening: 'var(--color-purple-500)',
  interview: 'var(--color-amber-500)',
  offer: 'var(--color-emerald-500)',
  rejected: 'var(--color-rose-500)',
};

const CALENDAR_VIEWS: CalendarView[] = ['month', 'week', 'agenda'];

interface EventData {
  appId: number;
  status: ApplicationStatus;
}

const buildEvents = (applications: Application[]): CalendarEvent<EventData>[] =>
  applications
    .filter((app) => !!app.interview_date)
    .map((app) => {
      const start = new Date(app.interview_date as string);
      return {
        id: String(app.id),
        title: `${app.job?.company || 'Company'} — ${app.job?.title || 'Interview'}`,
        start,
        end: addMinutes(start, 60),
        color: STATUS_COLOR[app.status],
        resizable: false,
        data: { appId: app.id, status: app.status },
      };
    });

export const InterviewCalendar: React.FC<InterviewCalendarProps> = ({ applications, onRefresh }) => {
  const router = useRouter();
  const apiRef = useRef<EventCalendarApi<EventData> | null>(null);
  const initialEvents = useMemo(() => buildEvents(applications), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Kept fresh without ever changing identity, so onEventUpdate below can stay
  // permanently stable — see the same fix in KanbanBoard.tsx for why an inline
  // callback here would otherwise re-trigger the calendar's internal effects
  // on every render.
  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Resync the calendar's (uncontrolled) event list whenever the source
  // applications data changes, e.g. after a refetch.
  useEffect(() => {
    apiRef.current?.setEvents(buildEvents(applications));
  }, [applications]);

  const handleEventUpdate = useCallback((update: EventCalendarProposedUpdate<EventData>) => {
    const appId = update.event.data?.appId;
    const status = update.event.data?.status;
    if (appId == null || !status) return false;
    // status is required by the backend even though only interview_date is
    // actually changing here — omitting it would 422.
    applicationsApi
      .updateStatus(appId, { status, interview_date: update.start.toISOString() })
      .catch(() => {})
      .finally(() => onRefreshRef.current());
    return true;
  }, []);

  const handleEventClick = useCallback((occurrence: { event: CalendarEvent<EventData> }) => {
    const appId = occurrence.event.data?.appId;
    if (appId == null) return;
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    router.push(
      `/ai-copilot?tab=interview&jobTitle=${encodeURIComponent(app.job?.title || '')}&company=${encodeURIComponent(app.job?.company || '')}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <Card className="w-full py-0">
      <CardContent className="p-0">
        <EventCalendar
          defaultEvents={initialEvents}
          defaultView="month"
          views={CALENDAR_VIEWS}
          apiRef={apiRef}
          onEventUpdate={handleEventUpdate}
          onEventClick={handleEventClick}
          interactions={{ drag: true, resize: false, selectSlot: false }}
          eventTooltip
          className="h-[640px] w-full"
        >
          <div className="px-2 pt-2">
            <EventCalendarNav />
          </div>
          <EventCalendarContent />
        </EventCalendar>
      </CardContent>
    </Card>
  );
};
