import { Component, inject, OnInit } from '@angular/core';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import {
  ILoanApplication,
  ILoanApplicationResponse,
  PaginatedLoanApplication,
} from '../../core/model/interface/application.model';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalLoanApplications: ILoanApplicationResponse[] = [];
  totalAllLoanAmount: number = 0;
  totalLaon: number = 0;
  listInCompleteLoanFund: ILoanApplicationResponse[] = [];
  listLoanApplications: ILoanApplicationResponse[] = [];
  listCompletedAndInProcessLoanApplication: ILoanApplicationResponse[] = [];

  //
  // pagination
  paginationData?: PaginatedLoanApplication<ILoanApplication>;
  totalLoanApplicationPagination: ILoanApplication[] = [];
  dataCompletedAndInProcessLoanApplication: ILoanApplication[] = [];
  page: number = 0;
  size: number = 15;
  totalPages: number = 0;

  //  view detail
  isViewDetail: boolean = false;
  selectedLoanApplication?: ILoanApplication | null;

  toggleViewDetail(loanApplication: ILoanApplication | null): void {
    this.isViewDetail = !this.isViewDetail;
    this.selectedLoanApplication = loanApplication;
  }

  closeDetailView(): void {
    this.isViewDetail = false;
    this.selectedLoanApplication = null;
  }

  constructor() {}

  private loanApplicationServiceService = inject(LoanApplicationServiceService);

  ngOnInit(): void {
    this.loadTotalLoanApplications();
    this.getAllLoanApplicationsWithPagination();
  }

  getAllLoanApplicationsWithPagination(): void {
    this.loanApplicationServiceService
      .allLoanApplicationPigination(this.page, this.size)
      .subscribe({
        next: (res) => {
          this.paginationData = res.data;
          this.totalLoanApplicationPagination = this.paginationData.content;
          this.totalPages = this.paginationData.totalPages;
        },
        error: (err) => {
          console.log('Error fetching paginated loan applications', err);
        },
        complete: () => {
          console.log('Fetched paginated loan applications successfully');
        },
      });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getAllLoanApplicationsWithPagination();
    }
  }
  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getAllLoanApplicationsWithPagination();
    }
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
