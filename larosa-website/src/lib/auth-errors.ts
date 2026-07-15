const INVALID_CREDENTIALS_MESSAGE =
  "Invalid email or password. Please check your details and try again.";

/** Map login API / fetch errors to user-facing copy. */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error) || !error.message.trim()) {
    return INVALID_CREDENTIALS_MESSAGE;
  }

  const message = error.message.trim();

  if (
    message === "Invalid email or password" ||
    message === "Invalid credentials." ||
    message.toLowerCase().includes("invalid email or password")
  ) {
    return INVALID_CREDENTIALS_MESSAGE;
  }

  return message;
}

export { INVALID_CREDENTIALS_MESSAGE };
