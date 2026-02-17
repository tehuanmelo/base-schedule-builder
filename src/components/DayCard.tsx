import { useState } from "react";
import { DayOfWeek, DaySchedule, DAY_LABELS, DAYS_OF_WEEK } from "@/data/scheduleData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";

interface DayCardProps {
  day: DayOfWeek;
  schedule: DaySchedule;
  onUpdate: (schedule: DaySchedule) => void;
  onRepeatTo: (targetDays: DayOfWeek[]) => void;
  errors?: string[];
}

const DayCard = ({ day, schedule, onUpdate, onRepeatTo, errors }: DayCardProps) => {
  const [showRepeat, setShowRepeat] = useState(false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

  const otherDays = DAYS_OF_WEEK.filter((d) => d !== day);

  const setClassCount = (count: number) => {
    const clamped = Math.max(0, Math.min(10, count));
    const newTimes = [...schedule.startTimes];
    if (clamped > newTimes.length) {
      for (let i = newTimes.length; i < clamped; i++) {
        newTimes.push("");
      }
    } else {
      newTimes.length = clamped;
    }
    onUpdate({ classes: clamped, startTimes: newTimes });
  };

  const setTime = (index: number, value: string) => {
    const newTimes = [...schedule.startTimes];
    newTimes[index] = value;
    onUpdate({ ...schedule, startTimes: newTimes });
  };

  const toggleDay = (d: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleRepeat = () => {
    if (selectedDays.length > 0) {
      onRepeatTo(selectedDays);
      setSelectedDays([]);
      setShowRepeat(false);
    }
  };

  const hasErrors = errors && errors.length > 0;

  return (
    <div
      className={`bg-card rounded-lg border p-4 shadow-sm ${
        hasErrors ? "border-destructive" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{DAY_LABELS[day]}</h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setShowRepeat(!showRepeat)}
          >
            <Copy className="h-3 w-3" />
            Repeat
            {showRepeat ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Repeat panel */}
      {showRepeat && (
        <div className="mb-3 p-3 bg-muted rounded-md border border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Copy <strong>{DAY_LABELS[day]}</strong>'s schedule to:
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {otherDays.map((d) => (
              <label key={d} className="flex items-center gap-1.5 text-sm cursor-pointer">
                <Checkbox
                  checked={selectedDays.includes(d)}
                  onCheckedChange={() => toggleDay(d)}
                />
                <span className="text-foreground">{DAY_LABELS[d].slice(0, 3)}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleRepeat}
              disabled={selectedDays.length === 0}
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowRepeat(false);
                setSelectedDays([]);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Number of classes stepper */}
      <div className="mb-3">
        <label className="block text-sm text-muted-foreground mb-1">Number of classes</label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setClassCount(schedule.classes - 1)}
            disabled={schedule.classes <= 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-medium text-foreground">
            {schedule.classes}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setClassCount(schedule.classes + 1)}
            disabled={schedule.classes >= 10}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Time inputs */}
      {schedule.classes > 0 && (
        <div className="space-y-2">
          {schedule.startTimes.map((time, i) => {
            const timeError = errors?.find((e) => e.includes(`Class ${i + 1}`));
            return (
              <div key={i}>
                <label className="block text-sm text-muted-foreground mb-0.5">
                  Class {i + 1} start time
                </label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(i, e.target.value)}
                  className={timeError ? "border-destructive" : ""}
                />
                {timeError && (
                  <p className="text-xs text-destructive mt-0.5">{timeError}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {schedule.classes === 0 && (
        <p className="text-sm text-muted-foreground italic">No classes scheduled</p>
      )}
    </div>
  );
};

export default DayCard;
