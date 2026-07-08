export type CreateVirtualAccountPayload = {
  /** Optional — the server generates a unique customer reference when omitted. */
  accountRef?: string;
  name: string;
  email?: string;
  phone?: string;
  expectedAmountKobo?: number;
  expiryDateUtc?: string;
  subMerchantRef?: string;
};
