export interface ILoanRefund {
  loanRefundId: number;
  loanApplicationId: number;
  refundAmount: number;
  totalLoanAmount: number;
  paidAmount: number;
  remainAmount: number | null;
  refundRequestedDate: string;
  refundInitiatedDate: string;
  refundReadyDate: string | null;
  refundCompletedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILoanRefundRequest {
  loanApplicationId: number;
  refundAmount: number;
}
