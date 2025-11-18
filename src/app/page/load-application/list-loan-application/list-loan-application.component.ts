import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILoanApplication } from '../../../core/model/interface/application.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-loan-application',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './list-loan-application.component.html',
  styleUrl: './list-loan-application.component.css',
})
export class ListLoanApplicationComponent {
  @Input() loanApplications: ILoanApplication[] = [];
  @Output() viewLoanApploanApplication = new EventEmitter<ILoanApplication>();
  @Output() approveLoanApploanApplication =
    new EventEmitter<ILoanApplication>();
  @Output() rejectLoanApploanApplication = new EventEmitter<ILoanApplication>();

  onView(loanApplication: ILoanApplication) {
    this.viewLoanApploanApplication.emit(loanApplication);
  }
  onApprove(loanApplication: ILoanApplication) {
    this.approveLoanApploanApplication.emit(loanApplication);
  }
  onReject(loanApplication: ILoanApplication) {
    this.rejectLoanApploanApplication.emit(loanApplication);
  }
}
