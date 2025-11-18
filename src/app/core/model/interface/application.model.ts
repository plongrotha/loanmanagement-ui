import {
  EApplicationStatus,
  EEmploymentStatus,
  ELoanType,
} from '../enum/loanType';

export interface IApplication {
  applicationId: number;
  applicantFullName: string;
  address: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ILoanApplication {
  loanApplicationId: number;
  loanType: string;
  employmentStatus: string;
  applicationStatus: string;
  loanRefundStatus: string;
  loanAmount: number;
  paidAmount: number;
  loanDurationInMonths: number;
  loanPurpose: string;
  createdAt: string | null;
  updatedAt: string | null;
  application: IApplication;
}

export interface IApplicationRequest {
  applicantFullName: string;
  address: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
}

export interface ILoanApplicationRequest {
  loanType: string;
  employmentStatus: string;
  loanAmount: number;
  loanDurationInMonths: number;
  loanPurpose: string;
  applicationRequest: IApplicationRequest;
}
