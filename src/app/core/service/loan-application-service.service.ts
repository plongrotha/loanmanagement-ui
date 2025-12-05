import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/interface/ApiResponse.model';
import {
  ILoanApplication,
  ILoanApplicationRequest,
  ILoanApplicationResponse,
  PaginatedLoanApplication,
} from '../model/interface/application.model';

@Injectable({
  providedIn: 'root',
})
export class LoanApplicationServiceService {
  // API URL's Spring Boot Backend
  private API_URL = 'http://localhost:8080/api/v1/loan-applications';

  private http = inject(HttpClient);
  // get all loan types
  getAllLoanTypes(): Observable<ApiResponse<string[]>> {
    const url = `${this.API_URL}/loan-types`;
    return this.http.get<ApiResponse<string[]>>(url);
  }

  // get all employment statuses
  getAllEmploymentStatus(): Observable<ApiResponse<string[]>> {
    const url = `${this.API_URL}/employment-statuses`;
    return this.http.get<ApiResponse<string[]>>(url);
  }

  // get all application statuses
  getAllApplicationStatuses(): Observable<ApiResponse<string[]>> {
    const url = `${this.API_URL}/application-statuses`;
    return this.http.get<ApiResponse<string[]>>(url);
  }

  // get all loan applications
  getLoanApplications(): Observable<ApiResponse<ILoanApplicationResponse[]>> {
    return this.http.get<ApiResponse<ILoanApplicationResponse[]>>(this.API_URL);
  }

  createNewLoanApplication(
    loanApplicationData: ILoanApplicationRequest
  ): Observable<ApiResponse<ILoanApplication>> {
    const apiUrl = `${this.API_URL}/createV2`;
    return this.http.post<ApiResponse<ILoanApplication>>(
      apiUrl,
      loanApplicationData
    );
  }

  approveLoanApplication(applicationId: number): Observable<ApiResponse<void>> {
    const url = `${this.API_URL}/approve?applicationId=${applicationId}`;
    return this.http.post<ApiResponse<void>>(url, {});
  }

  rejectLoanApplication(applicationId: number): Observable<ApiResponse<void>> {
    const url = `${this.API_URL}/reject?applicationId=${applicationId}`;
    return this.http.post<ApiResponse<void>>(url, {});
  }

  deleteLoanApplication(applicationId: number): Observable<ApiResponse<void>> {
    // this api url for delete application first and then delete loan application if exists
    const url = `http://localhost:8080/api/v1/applications/${applicationId}`;
    return this.http.delete<ApiResponse<void>>(url);
  }

  allLoanApplicationPigination(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PaginatedLoanApplication<ILoanApplication>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<
      ApiResponse<PaginatedLoanApplication<ILoanApplication>>
    >(this.API_URL + '/page', { params });
  }

  // get all loan applications approved today
  getLoanThatApprovedToday(): Observable<ApiResponse<ILoanApplication[]>> {
    const url = `${this.API_URL}/approved-today`;
    return this.http.get<ApiResponse<ILoanApplication[]>>(url);
  }

  // get all loan applications with refund completed
  getAllLoanApplicationRefundCompleted(): Observable<
    ApiResponse<ILoanApplicationResponse[]>
  > {
    const url = `${this.API_URL}/refund-completed`;
    return this.http.get<ApiResponse<ILoanApplicationResponse[]>>(url);
  }
}
