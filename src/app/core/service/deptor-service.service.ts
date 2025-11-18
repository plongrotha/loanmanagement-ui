import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeptorServiceService {
  // this is the base url for the api
  private API_URL = 'http://localhost:8080/api/v1/refund-application';

  constructor() {}
  private http = inject(HttpClient);
}
