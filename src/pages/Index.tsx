import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CoachBaseForm from "@/components/CoachBaseForm";
import DayCard from "@/components/DayCard";
import { Button } from "@/components/ui/button";
import { saveSubmission } from "@/lib/submissionStorage";
import {
  COACHES,
  DAYS_OF_WEEK,
  DayOfWeek,
  DaySchedule,
  SchedulePayload,
} from "@/data/scheduleData";

const createEmptySchedule = (): Record<DayOfWeek, DaySchedule> => {
  const s = {} as Record<DayOfWeek, DaySchedule>;
  DAYS_OF_WEEK.forEach((d) => {
    s[d] = { classes: 0, startTimes: [] };
  });
  return s;
};

const Index = () => {
  const navigate = useNavigate();
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [schedule, setSchedule] = useState<Record<DayOfWeek, DaySchedule>>(createEmptySchedule);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [noScheduleError, setNoScheduleError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateDay = useCallback((day: DayOfWeek, daySchedule: DaySchedule) => {
    setSchedule((prev) => ({ ...prev, [day]: daySchedule }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
    setNoScheduleError("");
  }, []);

  const repeatDay = useCallback(
    (sourceDay: DayOfWeek, targetDays: DayOfWeek[]) => {
      setSchedule((prev) => {
        const next = { ...prev };
        const source = prev[sourceDay];
        targetDays.forEach((d) => {
          next[d] = { classes: source.classes, startTimes: [...source.startTimes] };
        });
        return next;
      });
      setNoScheduleError("");
    },
    []
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string[]> = {};

    if (!selectedCoach) {
      newErrors.coach = ["Please select a coach"];
    }
    if (!selectedBase) {
      newErrors.base = ["Please select a base"];
    }

    const hasAnyClass = DAYS_OF_WEEK.some((day) => schedule[day].classes > 0);

    DAYS_OF_WEEK.forEach((day) => {
      const ds = schedule[day];
      if (ds.classes > 0) {
        const dayErrors: string[] = [];
        ds.startTimes.forEach((t, i) => {
          if (!t) {
            dayErrors.push(`Class ${i + 1} start time is required`);
          }
        });
        if (dayErrors.length > 0) {
          newErrors[day] = dayErrors;
        }
      }
    });

    setErrors(newErrors);

    if (!hasAnyClass) {
      setNoScheduleError("You must add at least one class in the week before submitting.");
    } else {
      setNoScheduleError("");
    }

    const hasErrors = Object.keys(newErrors).length > 0 || !hasAnyClass;
    setGlobalError(hasErrors ? "Please fix the highlighted fields." : "");
    return !hasErrors;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const coach = COACHES.find((c) => c.ps === selectedCoach)!;
    const payload: SchedulePayload = {
      coach: { ps: coach.ps, name: coach.name },
      base: selectedBase,
      schedule: { ...schedule },
      submittedAt: new Date().toISOString(),
    };

    console.log(payload);
    setSubmitting(true);
    setSubmitError("");

    const url = import.meta.env.VITE_APPSCRIPT_URL;

    if (!url) {
      // Test mode: no URL configured
      saveSubmission(payload);
      setSubmitting(false);
      navigate("/success");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Response not OK");
      }

      saveSubmission(payload);
      navigate("/success");
    } catch {
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <CoachBaseForm
          selectedCoach={selectedCoach}
          selectedBase={selectedBase}
          onCoachChange={(v) => {
            setSelectedCoach(v);
            setErrors((prev) => { const n = { ...prev }; delete n.coach; return n; });
          }}
          onBaseChange={(v) => {
            setSelectedBase(v);
            setErrors((prev) => { const n = { ...prev }; delete n.base; return n; });
          }}
          coachError={errors.coach?.[0]}
          baseError={errors.base?.[0]}
        />

        <div>
          <h2 className={`text-base font-semibold mb-3 ${noScheduleError ? "text-destructive" : "text-foreground"}`}>
            Weekly Schedule
          </h2>
          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => (
              <DayCard
                key={day}
                day={day}
                schedule={schedule[day]}
                onUpdate={(ds) => updateDay(day, ds)}
                onRepeatTo={(targets) => repeatDay(day, targets)}
                errors={errors[day]}
              />
            ))}
          </div>
          {noScheduleError && (
            <p className="text-sm text-destructive font-medium mt-2">{noScheduleError}</p>
          )}
        </div>

        {globalError && (
          <p className="text-sm text-destructive font-medium">{globalError}</p>
        )}

        {submitError && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">{submitError}</p>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Weekly Schedule"}
        </Button>
      </main>
    </div>
  );
};

export default Index;
