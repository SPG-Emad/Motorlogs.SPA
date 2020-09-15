import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';

@Component({
    selector: 'search-grid',
    templateUrl: './search-grid.component.html',
    styleUrls: ['./search-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchGridComponent implements OnInit {

    searchedValue: string;

    @Input()
    set toSearch(value: string) {
        this.searchedValue = value;
    };

    @Output()
    searchedFor = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    applyFilter(filterValue: string): void {
        this.searchedFor.emit(filterValue.trim().toLowerCase());
    }

    onlyCharacters(evt) {
        var theEvent = evt || window.event;
      
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
     
        var regex = /[a-zA-Z ]|\./;
        if( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
    }

}
