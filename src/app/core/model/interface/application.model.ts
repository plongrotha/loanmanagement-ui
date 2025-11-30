import {
  EApplicationStatus,
  EEmploymentStatus,
  ELoanType,
} from '../enum/loanType';

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

export interface IApplication {
  applicationId?: number | null;
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
  applicationResponse: IApplication;
}

export interface PaginatedLoanApplication<T> {
  content: T[];
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
export interface ILoanApplicationResponse {
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
