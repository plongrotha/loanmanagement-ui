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
import {
  ILoanRefund,
  ILoanRefundRequest,
} from '../../core/model/interface/LoanRefund.model';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../components/share/button/button.component';

@Component({
  selector: 'app-deptor',
  imports: [
    NgClass,
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgIf,
    FormsModule,
    ButtonComponent,
  ],
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
  listLoanApplicationPagination: ILoanApplication[] = [];
  dataCompletedAndInProcessLoanApplication: ILoanApplication[] = [];
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  // refuning activity
  isRefuning = false;
  refundAmount: number = 0;
  totalRefundAmount: number = 0;

  // selectedLoanApplicationId: number = 0;
  constructor() {
    this.getAllLoanApplicationsThatAreInProgress();
    this.getAllLoanApplicationRefundInProgressWithPagination();
  }

  private loanApplicationServiceService = inject(LoanApplicationServiceService);
  private deptorServiceService = inject(DeptorServiceService);

  refundReq: ILoanRefundRequest = {
    loanApplicationId: 0,
    refundAmount: this.refundAmount,
  };

  modalPosition = { x: 0, y: 0 };
  openModelRefund(loan: ILoanApplication, event: MouseEvent): void {
    this.modalPosition = {
      x: event.clientX,
      y: event.clientY,
    };
    this.refundReq = {
      loanApplicationId: loan.loanApplicationId,
      refundAmount: this.refundAmount,
    };
    this.isRefuning = true;
  }
  closeRefundModal() {
    this.isRefuning = false;
  }

  createRefund() {
    this.deptorServiceService.createLoanRefund(this.refundReq).subscribe({
      next: () => {
        this.refundReq.refundAmount = 0;
        this.getAllLoanApplicationRefundInProgressWithPagination();
        this.getAllRefundByLoanApplicationId(this.refundReq.loanApplicationId);
        console.log('Refund is successful');
      },
      error: (err) => {
        console.log('Error refuning : ' + err.status);
      },
    });
  }

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
          this.totalRefundAmount = this.listOfLoanRefunds.reduce(
            (acc, refund) => acc + refund.refundAmount,
            0
          );
          console.log(this.totalRefundAmount);
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

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.getAllLoanApplicationRefundInProgressWithPagination();
    }
  }
  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.getAllLoanApplicationRefundInProgressWithPagination();
    }
  }

  getAllLoanApplicationRefundInProgressWithPagination(): void {
    this.loanApplicationServiceService
      .getAllLoanApplicationRefundInProgressPagination(this.page, this.size)
      .subscribe({
        next: (res) => {
          this.paginationData = res.data;
          this.listLoanApplicationPagination = this.paginationData.content;
          this.totalPages = this.paginationData.totalPages;
        },
        error: (err) => {
          console.log('Error fetching paginated loan applications', err);
        },
      });
  }
}
