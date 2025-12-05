import { Component, inject } from '@angular/core';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import {
  ILoanApplication,
  ILoanApplicationResponse,
} from '../../core/model/interface/application.model';
import { map } from 'rxjs';
import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/share/button/button.component';

@Component({
  selector: 'app-admin',
  imports: [CurrencyPipe, NgClass, RouterLink, NgIf, ButtonComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  listLoanApplications: ILoanApplicationResponse[] = [];
  totalLoan: number = 0;

  listPendingLoanApplications: ILoanApplicationResponse[] = [];
  totalPendingLoan: number = 0;

  listActiveLoanApplications: ILoanApplicationResponse[] = [];
  totalActiveLoan: number = 0;

  listApprovedTodayLoanApplications: ILoanApplication[] = [];
  totalApprovedTodayLoan: number = 0;

  // inject dependency
  private loanApplicationServiceService = inject(LoanApplicationServiceService);

  constructor() {
    this.getallLoanApplications();
    this.getLoanApprovedToday();
  }

  getallLoanApplications(): void {
    this.loanApplicationServiceService
      .getLoanApplications()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.listLoanApplications = res;
          // console.log(this.listLoanApplications);

          this.totalLoan = this.listLoanApplications.length;
          // console.log(this.totalLoan);

          this.listPendingLoanApplications = this.listLoanApplications.filter(
            (application) => application.applicationStatus === 'PENDING'
          );
          this.totalPendingLoan = this.listPendingLoanApplications.length;
          // console.log(this.totalPendingLoan);

          this.listActiveLoanApplications = this.listLoanApplications.filter(
            (application) =>
              application.applicationStatus === 'APPROVED' ||
              application.applicationStatus === 'IN_PROGRESS'
          );
          this.totalActiveLoan = this.listActiveLoanApplications.length;
          // console.log(this.totalActiveLoan);
        },
        error: (err) => {
          console.log('Error fetching loan applications: ' + err.message);
        },
      });
  }

  getLoanApprovedToday(): void {
    this.loanApplicationServiceService
      .getLoanThatApprovedToday()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.listApprovedTodayLoanApplications = res.slice(-5);
          console.log(this.listApprovedTodayLoanApplications);
          this.totalApprovedTodayLoan =
            this.listApprovedTodayLoanApplications.length;
        },
        error: (err) => {
          console.log('Error fetching today approved loans: ' + err.message);
        },
      });
  }

  // method for binding class tailwindcss style to view templete
  getStyle(loan: ILoanApplication): any {
    if (loan.applicationStatus == 'APPROVED') {
      return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
    } else if (loan.applicationStatus == 'PENDING') {
      return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
    } else if (loan.applicationStatus == 'REJECTED') {
      return 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
    }
  }
}
