import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintComponent implements OnInit {

  @Input() printData:any;

  @Output() 
  generatePrint? =  new EventEmitter<any>();

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
    this.generatePrint.emit('');
  }
}
