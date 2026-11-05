// Eskiz (SMS provider) domain types (recovered from usage in the build).
export interface EskizAccount {
  id: string;
  username: string;
  originator: string | null;
  isActive: boolean;
  updatedAt: string;
  lastVerifyOk: boolean | null;
  lastVerifyError: string | null;
  lastVerifiedAt: string | null;
}

export interface EskizBalance {
  balance: number | null;
}

export interface CreateEskizAccountPayload {
  username: string;
  password: string;
  originator: string | null;
}

export interface UpdateEskizAccountPayload {
  id: string;
  username: string;
  originator: string | null;
}

export interface TestSendPayload {
  phoneNumber: string;
  message: string;
}

export interface TestSendResult {
  username: string;
  status: string;
  messageId: string;
  balanceAfter: number | null;
}
