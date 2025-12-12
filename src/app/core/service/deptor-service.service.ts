import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/interface/ApiResponse.model';
import {
  ILoanApplication,
  ILoanApplicationResponse,
} from '../model/interface/application.model';
import {
  ILoanRefund,
  ILoanRefundRequest,
} from '../model/interface/LoanRefund.model';

@Injectable({
  providedIn: 'root',
})
export class DeptorServiceService {
  // this is the base url for the api
  private API_URL_REFUND = 'http://localhost:8080/api/v1/refund-application';
  private API_URL_LOAN =
    'http://localhost:8080/api/v1/loan-applications/by-refund-status';

  constructor() {}
  private http = inject(HttpClient);

  fetch<T>(url: string): Observable<ApiResponse<T[]>> {
    return this.http.get<ApiResponse<T[]>>(url);
  }

  getAllLoanApplicationsThatAreInProgress(): Observable<
    ApiResponse<ILoanApplication[]>
  > {
    return this.http.get<ApiResponse<ILoanApplication[]>>(
      `${this.API_URL_LOAN}`
    );
  }

  getLoanRefundByloanApplicationId(
    id: number
  ): Observable<ApiResponse<ILoanRefund[]>> {
    return this.http.get<ApiResponse<ILoanRefund[]>>(
      `${this.API_URL_REFUND}/loan/${id}`
    );
  }

  // make refund request
  createLoanRefund(
    request: ILoanRefundRequest
  ): Observable<ApiResponse<ILoanRefund>> {
    const url = 'http://localhost:8080/api/v1/refund-application';
    return this.http.post<ApiResponse<ILoanRefund>>(url, request);
  }
}
