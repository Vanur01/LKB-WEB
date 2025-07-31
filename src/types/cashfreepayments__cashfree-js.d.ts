declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank';
    // Add more properties as needed
  }
  export interface CashfreeSDK {
    checkout: (options: CashfreeCheckoutOptions) => Promise<void>;
  }
  export function load(options: { mode: 'sandbox' | 'production' }): Promise<CashfreeSDK>;
}
