import { Component, inject, OnInit } from '@angular/core';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import { ILoanApplication } from '../../core/model/interface/application.model';
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgClass, NgForOf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalLoanApplications: ILoanApplication[] = [];
  totalAllLoanAmount: number = 0;
  totalLaon: number = 0;
  listInCompleteLoanFund: ILoanApplication[] = [];
  listLoanApplications: ILoanApplication[] = [];
  listCompletedAndInProcessLoanApplication: ILoanApplication[] = [];

  constructor() {}

  private loanApplicationServiceService = inject(LoanApplicationServiceService);

  ngOnInit(): void {
    this.loadTotalLoanApplications();
  }

  loadTotalLoanApplications() {
    this.loanApplicationServiceService.getLoanApplications().subscribe({
      next: (res) => {
        this.listLoanApplications = res.data;

        this.listLoanApplications.filter((app) => {
          if (
            app.loanRefundStatus === 'COMPLETED' ||
            app.loanRefundStatus === 'IN_PROGRESS'
          ) {
            this.totalLoanApplications.push(app);
          }

          // this number of LoanApplication
          this.totalLaon = this.totalLoanApplications.length;
        });

        this.listLoanApplications.filter((app) => {
          if (
            app.loanRefundStatus === 'COMPLETED' ||
            app.loanRefundStatus === 'IN_PROGRESS'
          ) {
            this.listCompletedAndInProcessLoanApplication.push(app);
          }
        });

        this.listLoanApplications.filter((app) => {
          if (app.loanRefundStatus === 'IN_PROGRESS') {
            this.listInCompleteLoanFund.push(app);
          }
        });

        this.listCompletedAndInProcessLoanApplication.filter((app) => {
          if (
            app.loanRefundStatus === 'COMPLETED' ||
            app.loanRefundStatus === 'IN_PROGRESS'
          ) {
            this.totalAllLoanAmount += app.loanAmount;
          }
        });
      },
      error: (err) => {
        console.log('Error fetching total loan applications', err);
      },
    });
  }
}
