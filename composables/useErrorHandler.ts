export type AppToast = {
  text: string;
  type: "success" | "warning" | "error" | "info";
  key: number;
};

/**
 * Messaggi per l'utente in un unico toast, montato nel layout.
 *
 * Prima gli errori finivano solo in console: un pagamento che non partiva
 * lasciava il cliente davanti a un bottone che "non faceva niente".
 */
export function useErrorHandler() {
  const toast = useState<AppToast>("app-toast", () => ({
    text: "",
    type: "info",
    key: 0,
  }));
  const { t } = useI18n();

  const notify = (text: string, type: AppToast["type"] = "info") => {
    toast.value = { text, type, key: toast.value.key + 1 };
  };

  /**
   * Registra l'errore e lo mostra. Se il server ha mandato un messaggio
   * leggibile (statusMessage) si usa quello, altrimenti uno generico.
   */
  const handleError = (message: string, error?: unknown, userMessage?: string) => {
    console.error(message, error);
    const fromServer =
      (error as any)?.data?.statusMessage ?? (error as any)?.statusMessage ?? "";
    notify(userMessage || fromServer || t("common.genericError"), "error");
  };

  return { toast, notify, handleError };
}
