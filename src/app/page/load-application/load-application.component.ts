import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import { map } from 'rxjs';
import {
  ILoanApplication,
  ILoanApplicationRequest,
} from '../../core/model/interface/application.model';
import { EEmploymentStatus, ELoanType } from '../../core/model/enum/loanType';

@Component({
  selector: 'app-load-application',
  imports: [CommonModule, FormsModule],
  templateUrl: './load-application.component.html',
  styleUrls: ['./load-application.component.css'],
})
export class LoadApplicationComponent {
  loanApplications: ILoanApplication[] = [];
  loanTypes: string[] = [];
  loanType?: '';
  employmentStatus: string[] = [];
  applicationStatuses: string[] = [];
  applicationStatus: string = '';
  totalApplications: number = 0;
  totalApprovedApplications: number = 0;
  totalPendingReviewApplications: number = 0;
  totalRejectedApplications: number = 0;
  selectedApplicationStatus: string = '';
  filterApplicationStatus: ILoanApplication[] = [];
  filterLoanType: ILoanApplication[] = [];
  selected?: ILoanApplication | null = null;

  @ViewChild('newApplicationModal')
  newApplicationModal!: ElementRef<HTMLDialogElement>;

  // inject the service
  private loanApplicationServiceService = inject(LoanApplicationServiceService);

  constructor() {
    this.loadAllLoanApplications();
    this.getAllLoanTypes();
    this.getAllApplicationStatuses();
    this.getAllEmploymentStatus();
    this.applicationStatus = 'APPROVED';
    this.onSelectedApplicationStatus();
  }

  // loan application object
  loanObj: ILoanApplicationRequest = {
    loanType: '' as unknown as string,
    employmentStatus: '' as unknown as string,
    loanAmount: 0,
    loanDurationInMonths: 0,
    loanPurpose: '',
    applicationRequest: {
      applicantFullName: '',
      address: '',
      email: '',
      phoneNumber: '',
      nationalId: '',
    },
  };

  viewApplicationDetails(applicationId: number): void {
    const application = this.loanApplications.find(
      (app) => app.loanApplicationId === applicationId
    );
    if (application) {
      this.loanObj = {
        // at this point i map the values from application to loanObj
        // this is to prefill the form with existing data
        loanType: application.loanType,
        employmentStatus: application.employmentStatus,
        loanAmount: application.loanAmount,
        loanDurationInMonths: application.loanDurationInMonths,
        loanPurpose: application.loanPurpose,
        applicationRequest: {
          applicantFullName: application.application.applicantFullName,
          address: application.application.address,
          email: application.application.email,
          phoneNumber: application.application.phoneNumber,
          nationalId: application.application.nationalId,
        },
      };
    }
  }
  // to open the modal dialog
  openDetails(app: ILoanApplication) {
    this.selected = app;
  }
  closeDetails() {
    this.selected = null;
  }
  onSelectedApplicationStatus(): void {
    this.filterApplicationStatus = this.loanApplications.filter(
      (app) => app.applicationStatus === this.applicationStatus
    );
  }

  getAllEmploymentStatus(): void {
    this.loanApplicationServiceService
      .getAllEmploymentStatus()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.employmentStatus = res;
        },
        error: (err) => {
          console.log('Error while fetching loan types', err);
        },
      });
  }

  // approve loan application
  approveApplication(applicationId: number): void {
    this.loanApplicationServiceService
      .approveLoanApplication(applicationId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.loadAllLoanApplications();
          this.onSelectedApplicationStatus();
        },
        error: (err) => {
          console.log('Error while approving loan application', err);
        },
        complete: () => {},
      });
  }

  deleteApplication(applicationId: number): void {
    this.loanApplicationServiceService
      .deleteLoanApplication(applicationId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.loadAllLoanApplications();
        },
        error: (err) => {
          console.log('Error while deleting loan application', err);
        },
      });
  }

  // create new Loan Application
  createNewApplication(): void {
    if (!this.loanObj.applicationRequest) {
      this.loanObj.applicationRequest = {
        applicantFullName: '',
        address: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
      };
    }
    this.loanApplicationServiceService
      .createNewLoanApplication(this.loanObj)
      .subscribe({
        next: (res) => {
          console.log('Loan application created successfully', res);
          this.loanObj = {
            loanType: '',
            employmentStatus: '',
            loanAmount: 0,
            loanDurationInMonths: 0,
            loanPurpose: '',
            applicationRequest: {
              applicantFullName: '',
              address: '',
              email: '',
              phoneNumber: '',
              nationalId: '',
            },
          };
          this.loadAllLoanApplications();
          // this.closeNewApplication();
        },
        error: (err) => {
          console.log('Error while creating loan application', err.message);
        },
      });
  }

  // user pip in subsribe
  loadAllLoanApplications(): void {
    this.loanApplicationServiceService
      .getLoanApplications()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.loanApplications = res;
          this.sortLoanApplicationsByApplicationStatus();
          this.onSelectedApplicationStatus();
          // console.log(this.loanApplications);
          this.totalApplications = this.loanApplications.length;

          // at this i sort the applications by Application status
          this.totalPendingReviewApplications = this.loanApplications.filter(
            (app) => app.applicationStatus === 'PENDING'
          ).length;
          this.totalApprovedApplications = this.loanApplications.filter(
            (app) => app.applicationStatus === 'APPROVED'
          ).length;
          this.totalRejectedApplications = this.loanApplications.filter(
            (app) => app.applicationStatus === 'REJECTED'
          ).length;
        },
        error: (err) => {
          console.log('error while fetching loan applications', err);
        },
      });
  }

  sortLoanApplicationsByApplicationStatus(): void {
    this.loanApplications.sort((a, b) => {
      // PENDING applications at the top
      if (
        a.applicationStatus === 'PENDING' &&
        b.applicationStatus !== 'PENDING'
      )
        return -1;
      if (
        a.applicationStatus !== 'PENDING' &&
        b.applicationStatus === 'PENDING'
      )
        return 1;

      // Then APPROVED
      if (
        a.applicationStatus === 'APPROVED' &&
        b.applicationStatus === 'REJECTED'
      )
        return -1;
      if (
        a.applicationStatus === 'REJECTED' &&
        b.applicationStatus === 'APPROVED'
      )
        return 1;

      return 0;
    });
  }

  getAllLoanTypes(): void {
    this.loanApplicationServiceService
      .getAllLoanTypes()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.loanTypes = res;
        },
        error: (err) => {
          console.log('Error while fetching loan types', err);
        },
      });
  }

  getAllApplicationStatuses(): void {
    this.loanApplicationServiceService
      .getAllApplicationStatuses()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (res) => {
          this.applicationStatuses = res;
        },
        error: (err) => {
          console.log('Error while fetching application statuses', err);
        },
      });
  }

  rejectApplication(applicationId: number): void {
    this.loanApplicationServiceService
      .rejectLoanApplication(applicationId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.loadAllLoanApplications();
        },
        error: (err) => {
          console.log('Error while rejecting loan application', err);
        },
      });
  }

  openNewApplication(): void {
    const dialog = this.newApplicationModal.nativeElement;
    if (!dialog.open) {
      dialog.showModal();
      console.log('clicked on open');
    }
  }

  closeNewApplication(): void {
    const dialog = this.newApplicationModal.nativeElement;
    if (dialog.open) {
      dialog.close();
      console.log('clicked on close');
    }
    this.resetForm();
  }

  resetForm(): void {
    this.loanObj = {
      loanType: (ELoanType as unknown as ELoanType) || null,
      employmentStatus:
        (EEmploymentStatus as unknown as EEmploymentStatus) || null,
      loanAmount: 0,
      loanDurationInMonths: 0,
      loanPurpose: '',
      applicationRequest: {
        applicantFullName: '',
        address: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
      },
    };
  }
}
