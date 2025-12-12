import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() COLUMN_DEFINITIONS: string[] | null = [];
  @Input() classStyle: string = '';
  @Input() data: any[] | null = [];
}
