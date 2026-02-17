import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import CoachBaseForm from "@/components/CoachBaseForm";
import DayCard from "@/components/DayCard";
import SubmissionPreview from "@/components/SubmissionPreview";
import { Button } from "@/components/ui/button";
import {
  COACHES,
  DAYS_OF_WEEK,
  DayOfWeek,
  DaySchedule,
  DAY_LABELS,
  SchedulePayload,
} from "@/data/scheduleData";
import { CheckCircle } from "lucide-react";

const createEmptySchedule = (): Record<DayOfWeek, DaySchedule> => {
  const s = {} as Record<DayOfWeek, DaySchedule>;
  DAYS_OF_WEEK.forEach((d) => {
    s[d] = { classes: 0, startTimes: [] };
  });
  return s;
};

const Index = () => {
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [schedule, setSchedule] = useState<Record<DayOfWeek, DaySchedule>>(createEmptySchedule);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [lastSubmitted, setLastSubmitted] = useState<SchedulePayload | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateDay = useCallback((day: DayOfWeek, daySchedule: DaySchedule) => {
    setSchedule((prev) => ({ ...prev, [day]: daySchedule }));
    // Clear errors for this day on edit
    setErrors((prev) => {
      const next = { ...prev };
      delete next[day];
      return next;
    });
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
    const hasErrors = Object.keys(newErrors).length > 0;
    setGlobalError(hasErrors ? "Please fix the highlighted fields." : "");
    return !hasErrors;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const coach = COACHES.find((c) => c.ps === selectedCoach)!;
    const payload: SchedulePayload = {
      coach: { ps: coach.ps, name: coach.name },
      base: selectedBase,
      schedule: { ...schedule },
      submittedAt: new Date().toISOString(),
    };

    console.log(payload);
    setLastSubmitted(payload);
    setShowSuccess(true);
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

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
          <h2 className="text-base font-semibold text-foreground mb-3">Weekly Schedule</h2>
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
        </div>

        {globalError && (
          <p className="text-sm text-destructive font-medium">{globalError}</p>
        )}

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Submit Weekly Schedule
        </Button>

        {showSuccess && (
          <div className="flex items-center gap-2 bg-success/10 border border-success/30 rounded-lg p-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-success">
              Submission Completed
            </span>
          </div>
        )}

        {lastSubmitted && <SubmissionPreview payload={lastSubmitted} />}
      </main>
    </div>
  );
};

export default Index;
