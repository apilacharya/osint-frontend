export const downloadTextFile = (name: string, content: string) => {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadPdfFromBase64 = (name: string, base64: string) => {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

export const triggerReportDownload = (report: { format: "MARKDOWN" | "PDF"; fileName: string; content: string }) => {
  if (report.format === "PDF") {
    downloadPdfFromBase64(report.fileName, report.content);
    return;
  }
  downloadTextFile(report.fileName, report.content);
};
