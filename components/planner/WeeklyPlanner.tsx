// /components/planner/WeeklyPlanner.tsx
"use client";
import React, { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<Record<string, string[]>>({
    Monday: ["Complete project proposal"],
    Tuesday: ["Team meeting at 10 AM"],
  });

  const addTask = (day: string) => {
    const newTask = prompt(`Add a task for ${day}`);
    if (!newTask) return;

    setTasks((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newTask],
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-black dark:text-white">
          Weekly Planner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  {day}
                </h2>

                <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                  {(tasks[day] || []).map((task, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 w-2 h-2 bg-indigo-500 rounded-full" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => addTask(day)}
                className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
              >
                Add Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}