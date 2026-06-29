export type SipNature = 'monthly' | 'onetime';

export type SipStatus =
  | 'NotStarted'
  | 'Chosen'
  | 'Active'
  | 'Completed'
  | 'Cancelled';

export type SipProcess =
  | 'Ongoing'
  | 'Finished'
  | 'Over'
  | 'Matured'
  | 'Reinvest';

export type UserStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  status: UserStatus;
  role: string;
  sips?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Sip {
  _id: string;
  userId: string;
  previousSipId?: string | null;
  nature: SipNature;
  totalMonths: number;
  amountPerMonth?: number;
  oneTimeAmount?: number;
  monthsPaid: number;
  monthsLeft?: number;
  totalPaid: number;
  totalReturns?: number | null;
  skippedMonths?: number;
  isskippedMonth?: boolean;
  status: SipStatus;
  process: SipProcess;
  chosen?: string;
  firstPaymentDate?: string;
  lastPaymentDate?: string;
  dueDate?: string;
  maturityDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface ChooseSipPayload {
  nature: SipNature;
  totalMonths: number;
  amountPerMonth?: number;
  oneTimeAmount?: number;
}

export interface AfterMaturedPayload {
  option: 'Over' | 'Reinvest';
  type?: SipNature;
  totalMonths?: number;
  amountPerMonth?: number;
  oneTimeAmount?: number;
}


/** A user object as populated on admin SIP listings. */
export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

/** A SIP a user has chosen and is awaiting an admin payment (status "Chosen"). */
export interface ChosenSip {
  _id: string;
  nature: SipNature;
  totalMonths: number;
  amountPerMonth?: number;
  oneTimeAmount?: number;
  userId: PopulatedUser;
}

/** A SIP whose user has requested a reinvest (process "Reinvest"). */
export interface ReinvestSip {
  _id: string;
  totalPaid: number;
  amountPerMonth?: number;
  totalMonths: number;
  userId: PopulatedUser;
}
