import { Component, inject } from '@angular/core';
import {
  ILoanApplication,
  ILoanApplicationResponse,
  PaginatedLoanApplication,
} from '../../core/model/interface/application.model';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import {
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { DeptorServiceService } from '../../core/service/deptor-service.service';
import { map } from 'rxjs';
import { ILoanRefund } from '../../core/model/interface/LoanRefund.model';

@Component({
  selector: 'app-deptor',
  imports: [NgClass, CurrencyPipe, DatePipe, NgForOf, NgIf],
  templateUrl: './deptor.component.html',
  styleUrls: ['./deptor.component.css'],
})
export class DeptorComponent {
  totalLoanApplications: ILoanApplicationResponse[] = [];
  totalAllLoanAmount: number = 0;
  totalLaon: number = 0;
  listInCompleteLoanFund: ILoanApplicationResponse[] = [];
  listCompleteLoanFund: ILoanApplicationResponse[] = [];
  listLoanApplications: ILoanApplicationResponse[] = [];
  listCompletedAndInProcessLoanApplication: ILoanApplicationResponse[] = [];
  inProgressLoanApplication: ILoanApplication[] = [];
  totalInProgress: number = 0;

  IsselectedView: boolean = false;
  selectOneLoanApplication?: ILoanApplication | null;

  listOfLoanRefunds: ILoanRefund[] = [];

  // pagination
  paginationData?: PaginatedLoanApplication<ILoanApplication>;
  totalLoanApplicationPagination: ILoanApplication[] = [];
  dataCompletedAndInProcessLoanApplication: ILoanApplication[] = [];
  page: number = 0;
  size: number = 15;
  totalPages: number = 0;
  // selectedLoanApplicationId: number = 0;
  constructor() {
    this.getAllLoanApplicationsThatAreInProgress();
  }

  private loanApplicationServiceService = inject(LoanApplicationServiceService);
  private deptorServiceService = inject(DeptorServiceService);

  ngOnInit(): void {}

  onViewDdetails(loan: ILoanApplication): void {
    this.IsselectedView = true;
    this.selectOneLoanApplication = loan;
    const applicationid = loan.loanApplicationId;
    this.listOfLoanRefunds = [];
    if (applicationid) {
      console.log('LoanApplication Id is :  ' + loan.loanApplicationId);
      this.getAllRefundByLoanApplicationId(applicationid);
    } else {
      console.log('LoanApplication is not found');
    }
  }

  getAllRefundByLoanApplicationId(id: number): void {
    this.deptorServiceService
      .getLoanRefundByloanApplicationId(id)
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.listOfLoanRefunds = res;
        },
        error: (err) => {
          console.log('Error fetching loan refunds', err);
        },
        complete: () => {
          console.log('Fetched loan refunds successfully');
        },
      });
  }

  getAllLoanApplicationsThatAreInProgress(): void {
    this.deptorServiceService
      .getAllLoanApplicationsThatAreInProgress()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.inProgressLoanApplication = res;
          console.log(this.inProgressLoanApplication);
          this.totalInProgress = this.inProgressLoanApplication.length;
        },
        error: (err) => {
          console.log('the data fetching error', err);
        },
        complete: () => {
          console.log('data fetching is successfully');
        },
      });
  }

  getAllLoanApplicationsWithPagination(): void {
    this.loanApplicationServiceService
      .allLoanApplicationPigination(this.page, this.size)
      .subscribe({
        next: (res) => {
          this.paginationData = res.data;
          this.totalLoanApplicationPagination = this.paginationData.content;
          this.totalPages = this.paginationData.totalPages;
          this.totalInProgress = this.inProgressLoanApplication.length;
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

        // this.listLoanApplications.filter((app) => {
        //   if (app.loanRefundStatus === 'IN_PROGRESS') {
        //     this.listInCompleteLoanFund.push(app);
        //   }
        // });

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
