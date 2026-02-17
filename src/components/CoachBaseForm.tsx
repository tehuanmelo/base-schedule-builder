import { COACHES, BASES } from "@/data/scheduleData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CoachBaseFormProps {
  selectedCoach: string;
  selectedBase: string;
  onCoachChange: (value: string) => void;
  onBaseChange: (value: string) => void;
  coachError?: string;
  baseError?: string;
}

const CoachBaseForm = ({
  selectedCoach,
  selectedBase,
  onCoachChange,
  onBaseChange,
  coachError,
  baseError,
}: CoachBaseFormProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Coach (PS + Name)
        </label>
        <Select value={selectedCoach} onValueChange={onCoachChange}>
          <SelectTrigger className={coachError ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your Ps and Name" />
          </SelectTrigger>
          <SelectContent>
            {COACHES.map((c) => (
              <SelectItem key={c.ps} value={c.ps}>
                {c.ps} – {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {coachError && (
          <p className="text-sm text-destructive mt-1">{coachError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Base
        </label>
        <Select value={selectedBase} onValueChange={onBaseChange}>
          <SelectTrigger className={baseError ? "border-destructive" : ""}>
            <SelectValue placeholder="Select your base" />
          </SelectTrigger>
          <SelectContent>
            {BASES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {baseError && (
          <p className="text-sm text-destructive mt-1">{baseError}</p>
        )}
      </div>
    </div>
  );
};

export default CoachBaseForm;
