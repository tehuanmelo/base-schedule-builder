import { SchedulePayload, DAY_LABELS, DAYS_OF_WEEK } from "@/data/scheduleData";

interface SubmissionPreviewProps {
  payload: SchedulePayload;
}

const SubmissionPreview = ({ payload }: SubmissionPreviewProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <h3 className="font-semibold text-foreground mb-3">Last Submitted Schedule</h3>
      <div className="space-y-1 text-sm">
        <p>
          <span className="text-muted-foreground">Coach:</span>{" "}
          <span className="font-medium text-foreground">
            {payload.coach.ps} – {payload.coach.name}
          </span>
        </p>
        <p>
          <span className="text-muted-foreground">Base:</span>{" "}
          <span className="font-medium text-foreground">{payload.base}</span>
        </p>
      </div>
      <div className="mt-3 space-y-1">
        {DAYS_OF_WEEK.map((day) => {
          const ds = payload.schedule[day];
          return (
            <div key={day} className="flex gap-2 text-sm">
              <span className="w-24 text-muted-foreground font-medium">
                {DAY_LABELS[day]}:
              </span>
              <span className="text-foreground">
                {ds.classes === 0
                  ? "No classes"
                  : `${ds.classes} class${ds.classes > 1 ? "es" : ""} — ${ds.startTimes.join(", ")}`}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Submitted at {new Date(payload.submittedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default SubmissionPreview;
