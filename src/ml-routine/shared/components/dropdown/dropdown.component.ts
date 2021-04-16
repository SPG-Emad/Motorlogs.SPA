import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { LocalStorageHandlerService } from 'app/shared/services/local-storage-handler.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { SaleslogService } from 'ml-routine/shared/services/saleslog/saleslog.service';
import { SignalRService } from 'ml-setup/shared/services/signal-r/signal-r.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Bank, BANKS, ItemObj } from './demo-data';


declare var $: any;


@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss']
})

export class ShareableDropDownComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
    @Input('flag') customDropdownFlag: boolean;
    @Input('rowDate') rowDate: string;
    @Input('itemArray') itemArray: any;
    @Input('selected') selected: string;
    @Input('header') header: string;
    @Input('colDef') colDef: any;

    protected items: ItemObj[] = [];
    protected dateitems: ItemObj[] = [];

    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();

    /** list of banks filtered by search keyword */
    public filteredOptions: ReplaySubject<ItemObj[]> = new ReplaySubject<ItemObj[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    private selectedItem: string;


    constructor(
        private salesLogService: SaleslogService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private signalRService: SignalRService,
        private toastNotification: ToastHandlerService,
    ) {
    }


    ngOnInit() {

        let itemObjArray: ItemObj[] = [];
        let selected = this.selected;
        if (this.itemArray) {
            this.itemArray.forEach(function (k: any) {
                let item = new ItemObj();

                item.name = k.valText;
                item.id = k.id;
                item.code = k.code;
                item.details = k.details;
                if (item.name != selected) {
                    itemObjArray.push(item);
                }

            });
        }
        if (this.dateitems.length >= 1) {
            this.items = this.dateitems.concat(itemObjArray); // add date time to existing combo value from json
        } else {
            this.items = itemObjArray; // add date time to existing combo value from json
        }

        // set initial selection
        this.bankCtrl.setValue(this.items[10]);

        // load the initial bank list
        this.filteredOptions.next(this.items.slice());

        // listen for search field value changes
        this.bankFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterSelection();
            });
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }


    initializeDatePicker() {
        console.log('cal open');
        $.datetimepicker.setLocale('en');
        $('#_datetimepicker4').datetimepicker({
            format: 'd.m.Y H:i',
            allowTimes: [
                '0:00', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30',
                '12:00', '12:30', '01:00', '1:30', '2:30', '3:00',
                '3:30', '4:00', '4:30', '5:00', '5:30'
            ],
            inline: true
        });

    }

    openedChange(opened: boolean) {

        this.initializeDatePicker();

        $('[id^="mat-input"]').attr('placeholder', 'Search');
        $('.mat-select-search-no-entries-found').text("");

        opened ? $("#calDisplay").show() : $("#calDisplay").hide();

        console.log(opened ? 'opened' : 'closed');

    }

    selectDateTime() {
        this.selectedItem = $("#_datetimepicker4").val();

        if (this.items.length == this.itemArray.length && this.selectedItem != null) {
            let item = new ItemObj();

            item.name = this.selectedItem;
            item.id = this.selectedItem;
            item.code = null;
            item.details = null;
            this.dateitems.push(item);
        }

        if (this.items.length == this.itemArray.length + 1 && this.selectedItem != null) {
            this.items.splice(0, 1); // delete the last item
            let item = new ItemObj();

            item.name = this.selectedItem;
            item.id = this.selectedItem;
            item.code = null;
            item.details = null;
            this.dateitems.push(item);
        }

        this.ngOnInit();
    }

    dateTimePushToItems(items, item): boolean {
        if (this.items.some(x => x.code === item)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Sets the initial value after the filteredOptions are loaded initially
     */
    protected setInitialValue() {

        this.filteredOptions
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredOptions are loaded initially
                // and after the mat-option elements are available
                this.singleSelect.compareWith = (a: ItemObj, b: ItemObj) => a && b && a.id === b.id;
            });

    }

    private filterSelection() {
        if (!this.items) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value != null ? this.bankFilterCtrl.value : this.selectedItem;
        if (!search) {
            this.filteredOptions.next(this.items.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredOptions.next(
            this.items.filter(ItemObj => (ItemObj.name.toLowerCase().indexOf(search) > -1 || ItemObj.code.toLowerCase().indexOf(search) > -1))
        );
    }


    protected filterBanksOld() {
        if (!this.items) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredOptions.next(this.items.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredOptions.next(
            this.items.filter(ItemObj => ItemObj.code.toLowerCase().indexOf(search) > -1)
        );
    }


    go(event) {
        if (event.value) {
            this.selectedItem = event.value.name;
            let colId = this.itemArray.find(res => res.code === this.selected);
            console.log(this.colDef);

            let params = {
                "userid": this.LocalStorageHandlerService.getFromStorage('userObj').userId,
                "EntryId": this.colDef.data.rowId, // Parent ID of the row for which cell he is editing 
                "ViewID": 1,
                "colId": this.colDef.colDef.colId,
                "ColType": this.colDef.colDef.columnType, // You need to send the column type 
                "Value": colId.id
            }
            this.salesLogService.insertCellValue(params)
                .subscribe(res => {
                    this.toastNotification.generateToast('Update successful', 'OK', 2000);
                    this.signalRService.BroadcastLiveSheetDataForViews();
                })
        }
    }

}


