// src/composables/useErrorHandler.ts
export function useErrorHandler() {
  const handleError = (message: string, error?: Error) => {
    console.error(message, error);
    // todo: redirect to error page
  };

  return { handleError };
}
