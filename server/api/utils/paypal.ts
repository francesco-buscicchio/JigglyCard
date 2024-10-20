import { type $Fetch, ofetch } from "ofetch";

class PayPal {
  protected api: string;
  public fetch: $Fetch;
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    sandbox?: boolean
  ) {
    if (!clientId) throw new Error("Missing Client ID");
    if (!clientSecret) throw new Error("Missing Client Secret");

    this.clientId = clientId;
    this.clientSecret = clientSecret;

    //DETERMINA L'ENDPOINT API
    this.api = sandbox
      ? "https://api.sandbox.paypal.com"
      : "https://api.paypal.com";

    this.fetch = ofetch.create({
      baseURL: this.api,
    });
  }

  async getAccessToken() {
    const result = await this.fetch<{
      scope: string;
      access_token: string;
      token_type: string;
      app_id: string;
      expires_in: number;
      nonce: string;
    }>("/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    return result.access_token;
  }

  async initialize() {
    const accessToken = await this.getAccessToken();
    this.fetch = ofetch.create({
      baseURL: this.api,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": "7b92603e-77ed-4896-8e78-5dea2050476c",
      },
    });
  }
}

export async function createPayPalClient() {
  const runtimeConfig = useRuntimeConfig();
  const client = new PayPal(
    runtimeConfig.public.paypalClientId as string,
    runtimeConfig.paypalClientSecret,
    runtimeConfig.env !== "production"
  );
  await client.initialize();
  return client;
}
