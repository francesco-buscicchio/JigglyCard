/** Chiave di sessione: l'intro della home si vede una volta sola. */
export const INTRO_STORAGE_KEY = "jc-intro-seen";

/** Classe su <html> mentre l'intro è a schermo. */
export const INTRO_HTML_CLASS = "jc-intro";

/**
 * Script inline per l'<head> della home: decide se mostrare l'intro prima del
 * primo paint, così non c'è il lampo della pagina sotto (o dell'intro, per chi
 * l'ha già vista).
 */
export const INTRO_HEAD_SCRIPT = `try{if(!sessionStorage.getItem("${INTRO_STORAGE_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${INTRO_HTML_CLASS}")}}catch(e){}`;
