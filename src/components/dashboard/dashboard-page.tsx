"use client";

import { useMemo, useState } from "react";
import {
  activities as activitySeed,
  activityTypes,
  classes,
  Activity,
} from "@/lib/data";

const statusStyles: Record<Activity["status"], string> = {
  Scheduled: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-rose-100 text-rose-700",
};

type SortKey = "startDate" | "className" | "type";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "By Start Date", value: "startDate" },
  { label: "By Class", value: "className" },
  { label: "By Activity Type", value: "type" },
];

const formatDate = (dateIso: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(dateIso));

const formatTimeRange = (start: string, end: string) => `${start} - ${end}`;

const computeMetrics = (data: Activity[]) => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const weekAhead = new Date(today);
  weekAhead.setDate(weekAhead.getDate() + 7);

  const totals = data.reduce(
    (acc, activity) => {
      acc.total += 1;
      if (activity.status === "Completed") {
        acc.completed += 1;
      }
      if (
        activity.status === "Scheduled" &&
        new Date(activity.startDate) >= today &&
        new Date(activity.startDate) <= weekAhead
      ) {
        acc.upcomingThisWeek += 1;
      }
      acc.uniqueAdvisors.add(activity.advisor);
      return acc;
    },
    {
      total: 0,
      upcomingThisWeek: 0,
      completed: 0,
      uniqueAdvisors: new Set<string>(),
    },
  );

  return {
    total: totals.total,
    upcomingThisWeek: totals.upcomingThisWeek,
    completed: totals.completed,
    advisors: totals.uniqueAdvisors.size,
  };
};

export function DashboardPage() {
  const [selectedClass, setSelectedClass] = useState<string>("All Classes");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortKey>("startDate");

  const metrics = useMemo(() => computeMetrics(activitySeed), []);

  const filteredActivities = useMemo(() => {
    let data = [...activitySeed];

    if (selectedClass !== "All Classes") {
      data = data.filter((activity) => activity.className === selectedClass);
    }

    if (selectedType !== "All Types") {
      data = data.filter((activity) => activity.type === selectedType);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      data = data.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.advisor.toLowerCase().includes(query) ||
          activity.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    const sorter: Record<SortKey, (a: Activity, b: Activity) => number> = {
      startDate: (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      className: (a, b) => a.className.localeCompare(b.className),
      type: (a, b) => a.type.localeCompare(b.type),
    };

    data.sort(sorter[selectedSort]);
    return data;
  }, [selectedClass, selectedType, searchTerm, selectedSort]);

  const groupedByDate = useMemo(() => {
    return filteredActivities.reduce<Record<string, Activity[]>>(
      (acc, activity) => {
        acc[activity.startDate] ??= [];
        acc[activity.startDate].push(activity);
        return acc;
      },
      {},
    );
  }, [filteredActivities]);

  const uniqueDates = useMemo(
    () =>
      Object.keys(groupedByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime(),
      ),
    [groupedByDate],
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative isolate">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-emerald-500/40 via-sky-500/30 to-transparent blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-950" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-16 pt-12 text-slate-100 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35rem] text-emerald-200/70">
                Horizon Prep School
              </p>
              <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
                Activities & Programs Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Monitor class activities, upcoming events, and program coverage
                in one place. Use the filters to hone in on the classes or
                activity types you care about most.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                Reporting Window
              </p>
              <p className="text-lg font-medium text-white">April 2024</p>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Activities"
              value={metrics.total.toString()}
              trend="+3 vs last month"
              accent="from-sky-500/60 to-emerald-400/60"
            />
            <MetricCard
              label="Upcoming This Week"
              value={metrics.upcomingThisWeek.toString()}
              trend="4 scheduled"
              accent="from-emerald-500/60 to-teal-400/60"
            />
            <MetricCard
              label="Completed"
              value={metrics.completed.toString()}
              trend="82% completion rate"
              accent="from-indigo-500/60 to-sky-400/60"
            />
            <MetricCard
              label="Active Advisors"
              value={metrics.advisors.toString()}
              trend="Cross-grade coverage"
              accent="from-violet-500/60 to-fuchsia-400/60"
            />
          </section>

          <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Activity Overview
                </h2>
                <p className="text-sm text-slate-300">
                  Filter by class, activity type, or search keywords to surface
                  the most relevant programs.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  Class
                  <select
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm font-medium text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring focus:ring-emerald-400/30"
                    value={selectedClass}
                    onChange={(event) => setSelectedClass(event.target.value)}
                  >
                    <option>All Classes</option>
                    {classes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  Type
                  <select
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm font-medium text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring focus:ring-emerald-400/30"
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                  >
                    <option>All Types</option>
                    {activityTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-300 sm:col-span-2 lg:col-span-1">
                  Search
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm font-medium text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring focus:ring-emerald-400/30"
                    placeholder="Teachers, tags, keywords…"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                  Sort
                  <select
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 p-3 text-sm font-medium text-slate-100 outline-none transition focus:border-emerald-400/60 focus:ring focus:ring-emerald-400/30"
                    value={selectedSort}
                    onChange={(event) =>
                      setSelectedSort(event.target.value as SortKey)
                    }
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.25em] text-slate-300">
                    <tr>
                      <th className="px-6 py-4 font-medium">Activity</th>
                      <th className="px-6 py-4 font-medium">Class</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Advisor</th>
                      <th className="px-6 py-4 font-medium">Schedule</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-100">
                    {filteredActivities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="bg-transparent hover:bg-white/[0.04]"
                      >
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-white">
                                {activity.title}
                              </span>
                              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                                {activity.id}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              {activity.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {activity.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-300">
                          {activity.className}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-300">
                          {activity.type}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-300">
                          <span className="font-medium text-white">
                            {activity.advisor}
                          </span>
                          {activity.notes ? (
                            <span className="mt-1 block text-xs text-slate-400">
                              {activity.notes}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 align-top text-sm text-slate-300">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {formatDate(activity.startDate)}
                            </span>
                            <span>{formatTimeRange(activity.startTime, activity.endTime)}</span>
                            {activity.startDate !== activity.endDate ? (
                              <span className="text-xs text-slate-400">
                                Ends {formatDate(activity.endDate)}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[activity.status]}`}
                          >
                            <span className="size-2 rounded-full bg-current opacity-70" />
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 bg-white/[0.02] py-12 text-center text-sm text-slate-300">
                  <p className="text-base font-semibold text-white">
                    No activities match your filters.
                  </p>
                  <p>Adjust the class, type, or keywords to broaden the view.</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-[2fr,1fr]">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">
                  Upcoming Timeline
                </h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                  {uniqueDates.length} dates
                </span>
              </div>
              <div className="relative space-y-6">
                <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-emerald-500/60 via-white/20 to-transparent" />
                <ul className="space-y-6">
                  {uniqueDates.map((date) => (
                    <li key={date} className="relative pl-8">
                      <span className="absolute left-0 top-1.5 flex size-4 items-center justify-center rounded-full border border-emerald-200/70 bg-slate-950 text-emerald-200">
                        ●
                      </span>
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                        {formatDate(date)}
                      </p>
                      <div className="mt-2 space-y-3">
                        {groupedByDate[date].map((activity) => (
                          <div
                            key={activity.id}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-slate-300">
                                  {activity.className} •{" "}
                                  {formatTimeRange(
                                    activity.startTime,
                                    activity.endTime,
                                  )}
                                </p>
                              </div>
                              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                {activity.type}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-300">
                              {activity.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8">
              <h2 className="text-xl font-semibold text-white">
                Quick Highlights
              </h2>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Participation Pulse
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Arts programs represent 20% of monthly activities, giving
                    Grade 7 additional stage time.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Advisor Coverage
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Instructional Team and Ms. Patel lead cross-grade
                    initiatives spanning STEM and PD.
                  </p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Action Items
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Collect permission slips for the Science Museum visit and
                    finalize transportation rosters by Friday.
                  </p>
                </li>
              </ul>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  accent: string;
}

function MetricCard({ label, value, trend, accent }: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-emerald-500/5 backdrop-blur">
      <span
        className={`absolute inset-x-0 -top-[30%] h-[120%] bg-gradient-to-br ${accent} opacity-60 blur-3xl`}
      />
      <div className="relative flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-200/70">
          {label}
        </p>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="text-sm text-slate-300">{trend}</p>
      </div>
    </div>
  );
}
