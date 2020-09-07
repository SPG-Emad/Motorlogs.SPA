import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
export interface SmartSearch {
    id: string;
    description: string;
}

@Component({
    selector: 'mat-search-select',
    templateUrl: './mat-search-select.component.html',
    styleUrls: ['./mat-search-select.component.scss']
})
export class MatSearchSelectComponent implements OnInit {

    constructor() { }
    @Input() defaultValue?: any = "View all";
    @Input() data: SmartSearch[];
    @Input() flex: string;
    @Input() class: string;
    @Input() label?: string;
    @Output() selectedItem = new EventEmitter();
    @ViewChild('search', { static: false }) searchEl: ElementRef;

    searchString: string;

    ngOnInit(): void {
    }

    onSelection($event): void {
        this.selectedItem.emit($event);
    
    }

    focus(): void {
        this.searchEl.nativeElement.focus();
    }


}
