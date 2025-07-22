// src/composables/useErrorHandler.ts
export function useErrorHandler() {
  const handleError = (message: string, error?: any) => {
    console.error(message, error);
    // todo: redirect to error page
  };

  return { handleError };
}
