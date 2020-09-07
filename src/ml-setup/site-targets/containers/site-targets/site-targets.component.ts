import { Component, OnInit } from '@angular/core';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ml-site-targets',
  templateUrl: './site-targets.component.html',
  styleUrls: ['./site-targets.component.scss']
})
export class SiteTargetsComponent{
  dateFilters:any;

  constructor(private http: HttpClient, ) {}

}




