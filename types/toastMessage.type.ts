export enum ToastMessageType {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "errror",
  INFO = "info",
}

export type ToastMessage = {
  text: string;
  type: ToastMessageType;
};
