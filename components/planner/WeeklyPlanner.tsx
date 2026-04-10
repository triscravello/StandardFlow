"use client";
import React, { FormEvent, useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import DayColumn from "./DayColumn";
import {
  plannerService,
  PlannerEntryDTO,
} from "@/services/plannerClientService";
import { lessonService, LessonDTO } from "@/services/lessonClientService";
import Modal from "../common/Modal";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";
import Link from "next/link";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function toPlannerByDay(entries: PlannerEntryDTO[] = []) {
  const grouped: Record<string, PlannerEntryDTO[]> = {};

  for (const day of daysOfWeek) {
    grouped[day] = [];
  }

  for (const entry of entries) {
    const dayName = format(new Date(entry.date), "EEEE");
    if (grouped[dayName]) {
      grouped[dayName].push(entry);
    }
  }

  return grouped;
}

export default function WeeklyPlanner({ initialEntries = [] }: { initialEntries?: PlannerEntryDTO[] }) {
  const [planner, setPlanner] = useState<Record<string, PlannerEntryDTO[]>>(
    toPlannerByDay(initialEntries)
  );
  const [isSyncing, setIsSyncing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [lessons, setLessons] = useState<LessonDTO[]>([]);
  const [activeDragEntryId, setActiveDragEntryId] = useState<string | null>(null);

  const hasPlannerEntries = useMemo(
    () => Object.values(planner).some((entries) => entries.length > 0),
    [planner]
  );

  useEffect(() => {
    async function fetchPlanner() {
      setError(null);
      try {
        const entries = await plannerService.user();

        // Ensure entries is always an array
        const entriesArray: PlannerEntryDTO[] = Array.isArray(entries) ? entries : [];
        setPlanner(toPlannerByDay(entriesArray));

        const lessonOptions = await lessonService.getLessons();
        setLessons(lessonOptions);
      } catch (error) {
        console.error("Error fetching planner user entries:", error);
        setError("Failed to load planner entries. Please refresh and try again.");
      } finally {
        setIsSyncing(false);
      }
    }

    void fetchPlanner();
  }, []);

  const openAddTaskModal = (day: string) => {
    setError(null);
    setSuccessMessage(null);
    setSelectedDay(day);
    setSelectedLessonId("");
    setIsAddModalOpen(true);
  };

  const toDateForDay = (day: string) => {
    const today = new Date();
    const dayIndex = daysOfWeek.indexOf(day);
    const mondayBasedIndex = (today.getDay() + 6) % 7;
    const diff = dayIndex - mondayBasedIndex;
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    target.setHours(9, 0, 0, 0);
    return target;
  }

  const addTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedDay || !selectedLessonId) {
      setError("Please select a lesson.")
      return;
    }

    const isDuplicateForDay = (planner[selectedDay] || []).some(
      (entry) => entry.lesson._id === selectedLessonId
    );
    if (isDuplicateForDay) {
      setError("This lesson is already scheduled for that day.");
      return;
    }

    setIsSubmitting(true);

    try {
      const targetDate = toDateForDay(selectedDay).toISOString();
      const createdEntry = await plannerService.create(selectedLessonId, targetDate);

      setPlanner((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), createdEntry]
      }));

      setIsAddModalOpen(false);
      setSelectedLessonId("");
      setSuccessMessage(`Added "${createdEntry.lesson.title} to ${selectedDay}`);
    } catch (addError) {
      console.error("Error adding planner entry:", addError);
      const message = addError instanceof Error ? addError.message : "Failed to add planner entry.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      await plannerService.remove(entryId);
      setPlanner((prev) => {
        const next: Record<string, PlannerEntryDTO[]> = {};
        for (const day of daysOfWeek) {
          next[day] = prev[day].filter((entry) => entry._id !== entry._id);
        }
        return next;
      })
    } catch (deleteError) {
      console.error("Error deleting planner entry:", deleteEntry);
      setError("Failed to delete planner entry.");
    }
  };

  const handleDropEntry = async (day: string) => {
    if (!activeDragEntryId) return;

    try {
      const newDate = toDateForDay(day).toISOString();
      const updatedEntry = await plannerService.reschedule(activeDragEntryId, newDate);

      setPlanner((prev) => {
        const next = toPlannerByDay(
          Object.values(prev)
            .flat()
            .map((entry) => (entry._id === activeDragEntryId ? updatedEntry : entry))
        );
        return next;
      });
      setSuccessMessage(`Moved "${updatedEntry.lesson.title} to ${day}.`);
    } catch (dropError) {
      console.error("Error reordering planner entry:", dropError);
      setError("Failed to move planner entry.");
    } finally {
      setActiveDragEntryId(null);
    }
  };

  return (
    <div className="planner-page">
      <div className="planner-container">
        <h1 className="planner-title">
          Weekly Planner
        </h1>
        <p className="planner-subtitle">
          {isSyncing
            ? "Syncing planner entries..."
            : hasPlannerEntries
              ? "Drag and drop lessons to organize your week!"
              : "No planner entries."}
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
        <div className="mb-3 flex gap=2">
          <Link href="/lessons"><Button size="sm" variant="secondary">Add Lesson</Button></Link>
          <Link href="/units"><Button size="sm" variant="secondary">Add Unit</Button></Link>
        </div>

        {isSyncing ? (
          <div className="flex justify-center py-6">
            <LoadingSpinner label="Syncing planner entries..." />
          </div>
        ) : (
          <div className="planner-grid">
            {daysOfWeek.map((day) => (
              <DayColumn
                key={day}
                day={day}
                entries={planner[day] || []}
                onAddTask={openAddTaskModal}
                onDeleteEntry={deleteEntry}
                onDropEntry={handleDropEntry}
                onDragEntryStart={setActiveDragEntryId}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        title={selectedDay ? `Add Lesson to ${selectedDay}` : "Add Lesson"}
        onClose={() => setIsAddModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" form="add-planner-lesson-form" disabled={!selectedLessonId || isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Lesson"}
            </Button>
          </>
        }
      >
        <form id="add-planner-lesson-form" onSubmit={addTask} className="space-y-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="planner-lesson-title">
            Select lesson
          </label>
          <select
            id="planner-lesson-title"
            value={selectedLessonId}
            onChange={(event) => setSelectedLessonId(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Choose a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </form>
      </Modal>
    </div>
  );
}