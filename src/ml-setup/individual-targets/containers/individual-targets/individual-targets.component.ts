import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ml-individual-targets',
  templateUrl: './individual-targets.component.html',
  styleUrls: ['./individual-targets.component.scss']
})
export class IndividualTargetsComponent implements OnInit {
    
  dateFilters:any
  
  constructor() { }

  ngOnInit() {
  }

}
