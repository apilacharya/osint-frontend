export const errorCodeMessageMap: Record<number, string> = {
  400: "Some submitted fields are invalid. Review your input and retry.",
  404: "The requested resource could not be found.",
  422: "No high-confidence matches were found for this target.",
  429: "You reached the rate limit. Please wait and retry.",
  500: "Unexpected server error. Please retry.",
  502: "An external intelligence source failed. Try again shortly."
};

export const getErrorMessageFromCode = (
  code?: number,
  fallback = "Request failed. Please try again."
) => (code && errorCodeMessageMap[code]) || fallback;
