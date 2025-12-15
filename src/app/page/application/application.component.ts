import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ILoanApplicationResponse } from '../../core/model/interface/application.model';
import { LoanApplicationServiceService } from '../../core/service/loan-application-service.service';
import { map } from 'rxjs';
interface Application {
  applicationId: number;
  applicantFullName: string;
  address: string;
  phoneNumber: string;
  nationalId: string;
}
@Component({
  selector: 'app-application',
  imports: [CommonModule],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
})
export class ApplicationComponent implements OnInit {
  applications: ILoanApplicationResponse[] = [];
  totalLoanApplicationsInComplet: number = 0;
  filtered: ILoanApplicationResponse[] = [];
  searchTerm = '';
  selected?: ILoanApplicationResponse | null = null;

  private loanApplicationServiceService = inject(LoanApplicationServiceService);

  constructor() {
    this.loadAllApplications();
    this.totalLoanApplicationsInComplet;
  }

  ngOnInit(): void {}
  // search() {
  //   const q = this.searchTerm.trim().toLowerCase();
  //   if (!q) {
  //     this.filtered = [...this.applications];
  //     return;
  //   }
  //   this.filtered = this.applications.filter(
  //     (a) =>
  //       a.applicantFullName.toLowerCase().includes(q) ||
  //       a.address.toLowerCase().includes(q) ||
  //       a.phoneNumber.toLowerCase().includes(q) ||
  //       a.nationalId.toLowerCase().includes(q)
  //   );
  // }

  loadAllApplications() {
    this.loanApplicationServiceService
      .getLoanApplications()
      .pipe(map((res) => res.data))
      .subscribe({
        next: (data) => {
          this.applications = data;
          this.totalLoanApplicationsInComplet = this.applications.filter(
            (a) => a.loanRefundStatus === 'COMPLETED'
          ).length;
        },
        error: (err) => {
          console.error('Error loading applications', err);
        },
      });
  }
  clearSearch() {
    this.searchTerm = '';
  }
  openDetails(app: ILoanApplicationResponse) {
    this.selected = app;
  }
  closeDetails() {
    this.selected = null;
  }
}
