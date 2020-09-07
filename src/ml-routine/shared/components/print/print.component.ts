import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintComponent implements OnInit {

  @Input() printData:any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges) {
    for (const propName in changes) {
        if (changes.hasOwnProperty(propName)) {
            switch (propName) {
                case 'printData': {
                  if(this.printData ===1){
                    this.print();
                  }
                }
            }
        }
    }
  }

  print(){
    window.print();
  }
}
