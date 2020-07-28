import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'ml-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    @Input() formDefaultState;

    @Input() userId: number;

    openSidePanel = false;

    searchFilters: any;

    userRoles = [];

    selectedUser;

    reloadList: any;

    searchedForValue: string;

    constructor() { }

    ngOnInit() { }


    toggleSidePanel($event: boolean): void {
        this.openSidePanel = $event;
    }

    openSidePanelForUsers($event: boolean): void {
        this.openSidePanel = $event;
    }

}
