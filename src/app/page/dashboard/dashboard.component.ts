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
import { CardComponent } from '../../components/share/card/card.component';
import { TableComponent } from '../../components/share/table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    NgForOf,
    NgIf,
    CardComponent,
    TableComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalLoanApplications: ILoanApplicationResponse[] = [];
  totalAllLoanAmount: number = 0;
  totalLaon: number = 0;
  totalInCompleteLoanFund: number = 0;
  totalCompleteLoanFund: number = 0;
  col: string[] = [
    'ID',
    'Debtor Name',
    'Loan Amount',
    'Paid Amount',
    'Remaining',
    'Application Date',
    'Status',
    'Actions',
  ];
  //
  listCompleteLoanFund: ILoanApplicationResponse[] = [];
  listInCompleteLoanFund: ILoanApplicationResponse[] = [];
  listLoanApplications: ILoanApplicationResponse[] = [];
  listCompletedAndInProcessLoanApplication: ILoanApplicationResponse[] = [];

  //
  // pagination
  paginationData?: PaginatedLoanApplication<ILoanApplication>;
  totalLoanApplicationPagination: ILoanApplication[] = [];
  loanApplicationCompletedAndInProgress: ILoanApplication[] = [];
  page: number = 0;
  size: number = 10;
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

  // pagination method
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
        this.listCompletedAndInProcessLoanApplication =
          this.listLoanApplications.filter((app) => {
            return (
              app.loanRefundStatus === 'COMPLETED' ||
              app.loanRefundStatus === 'IN_PROGRESS'
            );
          });

        // total loan application that owner has gave loan
        this.totalLaon = this.listCompletedAndInProcessLoanApplication.length;

        this.listInCompleteLoanFund = this.listLoanApplications.filter(
          (app) => {
            return app.loanRefundStatus === 'IN_PROGRESS';
          }
        );
        // total incomplete loan fund
        this.totalInCompleteLoanFund = this.listInCompleteLoanFund.length;

        this.listCompleteLoanFund = this.listLoanApplications.filter((app) => {
          return app.loanRefundStatus === 'COMPLETED';
        });

        // total complete loan fund
        this.totalCompleteLoanFund = this.listCompleteLoanFund.length;

        // total loan amount
        this.totalAllLoanAmount =
          this.listCompletedAndInProcessLoanApplication.reduce(
            (sum, app) => sum + app.loanAmount,
            0
          );
      },
      error: (err) => {
        console.log('Error fetching total loan applications', err);
      },
    });
  }
}
