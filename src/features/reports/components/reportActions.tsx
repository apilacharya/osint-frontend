import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateReport } from "../../../hooks/useReports";
import type { ApiClientError } from "../../../lib/apiClient";
import { getErrorMessageFromCode } from "../../../lib/errorMessages";
import { triggerReportDownload } from "../../../lib/reportDownload";
import { Button } from "../../../components/ui/button";

type Props = {
  searchRunId: string;
};

export const ReportActions = ({ searchRunId }: Props) => {
  const mutation = useCreateReport();
  const queryClient = useQueryClient();

  const create = async (format: "markdown" | "pdf") => {
    try {
      const report = await mutation.mutateAsync({ searchRunId, format });
      triggerReportDownload(report);
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch (error) {
      const apiError = error as ApiClientError;
      toast.error(getErrorMessageFromCode(apiError.code, apiError.message));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={() => create("markdown")} disabled={mutation.isPending}>
        Export Markdown
      </Button>
      <Button type="button" onClick={() => create("pdf")} disabled={mutation.isPending}>
        Export PDF
      </Button>
    </div>
  );
};
