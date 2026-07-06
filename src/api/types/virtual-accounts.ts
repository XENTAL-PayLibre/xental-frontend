export type CreateVirtualAccountPayload = {
  accountRef: string;
  name: string;
  email?: string;
  phone?: string;
  expectedAmountKobo?: number;
  expiryDateUtc?: string;
  subMerchantRef?: string;
};
