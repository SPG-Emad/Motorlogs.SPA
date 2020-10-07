import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'delete-confirm',
    templateUrl: './delete-confirm.component.html',
    styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent implements OnInit {

    @Output()
    deleteConfirmed = new EventEmitter<boolean>();

    show:boolean = false;
    constructor() { }

    ngOnInit() {
    }

    confirmDelete() {
        this.show = false;
        this.deleteConfirmed.emit();
    }

}
