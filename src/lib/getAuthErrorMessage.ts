export function getAuthErrorMessage(error: unknown): string {
  if (!error) return "An unexpected error occurred. Please try again.";

  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message || "An unexpected error occurred. Please try again.";
  }

  const err = error as Record<string, any>;
  const code = err.code as string | undefined;
  const message = err.message as string | undefined;

  const knownCodes: Record<string, string> = {
    invalid_request: "Invalid request. Please check your input.",
    invalid_credentials: "Invalid email or password.",
    unauthorized: "You are not authorized. Please try again.",
    user_not_found: "No account found with that email.",
    user_already_exists: "An account with that email already exists.",
    email_already_exists: "An account with that email already exists.",
    email_already_in_use: "An account with that email already exists.",
    weak_password: "Password is too weak. Please choose a stronger password.",
    network_error:
      "Unable to reach the server. Check your connection and try again.",
    unknown: "An unexpected error occurred. Please try again.",
  };

  if (code && knownCodes[code]) {
    return knownCodes[code];
  }

  if (message) {
    return message;
  }

  return "An unexpected error occurred. Please try again.";
}
