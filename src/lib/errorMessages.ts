export const errorCodeMessageMap: Record<number, string> = {
  1001: "Some submitted fields are invalid. Review your input and retry.",
  1002: "Query parameters are invalid or missing.",
  1003: "No high-confidence matches were found for this target.",
  1004: "An external intelligence source failed. Try again shortly.",
  1005: "You reached the rate limit. Please wait and retry.",
  1006: "The requested resource could not be found.",
  1007: "Report generation failed. Try creating the report again.",
  1099: "Unexpected server error. Please retry."
};

export const getErrorMessageFromCode = (code?: number, fallback = "Request failed. Please try again.") =>
  (code && errorCodeMessageMap[code]) || fallback;

