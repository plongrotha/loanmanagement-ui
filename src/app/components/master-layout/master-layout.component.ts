import { Component } from '@angular/core';
import { DashboardComponent } from '../../page/dashboard/dashboard.component';

@Component({
  selector: 'app-master-layout',
  imports: [DashboardComponent],
  templateUrl: './master-layout.component.html',
  styleUrl: './master-layout.component.css',
})
export class MasterLayoutComponent {
  title: string = 'This is Master Layout Component';
}
