import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SubmissionPreview from "@/components/SubmissionPreview";
import { Button } from "@/components/ui/button";
import { loadSubmission } from "@/lib/submissionStorage";
import { SchedulePayload } from "@/data/scheduleData";
import { CheckCircle } from "lucide-react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<SchedulePayload | null>(null);

  useEffect(() => {
    setPayload(loadSubmission());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {payload ? (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success shrink-0" />
              <h2 className="text-xl font-bold text-foreground">Submission Successful</h2>
            </div>
            <SubmissionPreview payload={payload} />
            <Button onClick={() => navigate("/")} className="w-full" size="lg">
              Back to Form
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-center space-y-4">
            <p className="text-muted-foreground">No submission found. Please submit a schedule first.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              Go to Form
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuccessPage;
