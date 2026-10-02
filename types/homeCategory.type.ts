/** Una categoria del negozio, come la mostra la home ("Cosa stai cercando?"). */
export type HomeCategory = {
  label: string;
  to: string;
  image?: string;
  products: number;
};
