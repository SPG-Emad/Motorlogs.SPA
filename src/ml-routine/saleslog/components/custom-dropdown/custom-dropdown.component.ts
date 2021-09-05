import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSelect } from "@angular/material";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { ItemObj } from "../demo-data";
import { SaleslogService } from "ml-routine/shared/services/saleslog/saleslog.service";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";

declare var $: any;

// This component works other than date components in saleslog component as well
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "custom-dropdown",
    templateUrl: "./custom-dropdown.component.html",
    styleUrls: ["./custom-dropdown.component.scss"],
})

// file name is custom-dropdown.component.ts
export class CustomDropdownComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild("singleSelect", { static: false }) singleSelect: MatSelect;
    @Input("flag") customDropdownFlag: boolean;
    @Input("rowDate") rowDate: string;
    @Input("itemArray") itemArray: any;
    @Input("selected") selected: string;
    @Input("header") header: string;
    @Input("colDef") colDef: any;
    @Input("viewId") viewId: any;

    paramsObject: any;
    selectedItem: string;

    protected items: ItemObj[] = [];
    protected dateitems: ItemObj[] = [];

    /** control for the selected bank */
    public bankCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword */
    public bankFilterCtrl: FormControl = new FormControl();

    /** list of banks filtered by search keyword */
    public filteredBanks: ReplaySubject<ItemObj[]> = new ReplaySubject<
        ItemObj[]
    >(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private salesLogService: SaleslogService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private signalRService: SignalRService,
        private cdref: ChangeDetectorRef
    ) {
        console.log("custom-dropdown-component CONSTRUCTOR");
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.setInitialValue();
        }, 0);
    }

    ngAfterContentInit() {}

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
     * Sets the initial value after the filteredBanks are loaded initially
     */
    protected setInitialValue() {
        this.filteredBanks
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {});
    }

    private filterBanks() {
        if (!this.items) {
            return;
        }
        // get the search keyword
        let search =
            this.bankFilterCtrl.value != null
                ? this.bankFilterCtrl.value
                : this.selectedItem;

        // console.log("search value: ", search);
        // console.log("this.items in filterBanks: ", this.items);

        if (!search) {
            this.filteredBanks.next(this.items.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(
            this.items.filter(
                (ItemObj) =>
                    ItemObj.name.toLowerCase().indexOf(search) > -1 ||
                    ItemObj.code.toLowerCase().indexOf(search) > -1
            )
        );
    }

    protected filterBanksOld() {
        if (!this.items) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredBanks.next(this.items.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks

        this.filteredBanks.next(
            this.items.filter(
                (ItemObj) => ItemObj.code.toLowerCase().indexOf(search) > -1
            )
        );
    }

    open() {
        // console.log("cal open");

        $.datetimepicker.setLocale("en");
        $("#_datetimepicker4").datetimepicker({
            format: "d/m/Y H:i",
            allowTimes: [
                "0:00",
                "9:00",
                "9:30",
                "10:00",
                "10:30",
                "11:00",
                "11:30",
                "12:00",
                "12:30",
                "01:00",
                "1:30",
                "2:30",
                "3:00",
                "3:30",
                "4:00",
                "4:30",
                "5:00",
                "5:30",
            ],
            inline: true,
        });
    }

    openedChange(opened: boolean) {
        this.open();
        $('[id^="mat-input"]').attr("placeholder", "Search");
        $(".mat-select-search-no-entries-found").text("");
        opened ? $("#calDisplay").show() : $("#calDisplay").hide();
    }

    doSomething() {
        this.selectedItem = $("#_datetimepicker4").val();

        console.log("doSomething Items1: ", this.items);
        console.log("doSomething ItemsArray1: ", this.itemArray);
        console.log("doSomething this.dateitems1: ", this.dateitems);
        console.log("doSomething SelectedItem1: ", this.selectedItem);

        if (
            this.items.length == this.itemArray.length &&
            this.selectedItem != null
        ) {
            // console.log(this.items);
            let item = new ItemObj();

            item.name = this.selectedItem;
            item.id = "-1";
            item.code = null;
            item.details = null;
            this.dateitems.push(item);

            //this.ngOnInit();
        }
        if (
            this.items.length == this.itemArray.length + 1 &&
            this.selectedItem != null
        ) {
            // console.log(this.selectedItem+ " "+this.items.length);
            this.items.splice(0, 1); // delete the last item
            //  this.items.push({code:  this.selectedItem, id:  this.selectedItem ,name:null ,details:null});
            // console.log(this.items);
            let item = new ItemObj();

            item.name = this.selectedItem;
            item.id = "-1";
            item.code = null;
            item.details = null;
            this.dateitems.push(item);

            // this.ngOnInit();
        }

        console.log("doSomething this.items2: ", this.items);
        console.log("doSomething ItemsArray2: ", this.itemArray);
        console.log("doSomething this.dateitems2: ", this.dateitems);
        console.log("doSomething SelectedItem2: ", this.selectedItem);
        // this.ngOnInit();
        this.saveComboDropDownValueToDatabase(this.selectedItem);
    }

    dateTimePushToItems(item): boolean {
        if (this.items.some((x) => x.code === item)) {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit() {
        console.log("custom-dropdown-component ngOnInIt");
        console.log("custom-dropdown-component SELECTED ITEM: ", this.selected);
        
        let itemObjArray: ItemObj[] = [];
        let selected = this.selected;

        if (this.itemArray) {
            this.itemArray.forEach(function (k: any) {
                let item = new ItemObj();
                item.name = k.valText;
                item.id = k.id;
                if (k.code) {
                    item.code = k.code;
                } else {
                    item.code = k.valText;
                }
                item.details = k.details;
                if (item.name != selected) {
                    itemObjArray.push(item); // dates will be inserted here mostly
                }
            });
        }
        if (this.dateitems.length >= 1 || this.rowDate) {
            let x = new ItemObj();
            x.name= this.rowDate;
            x.id= '-1';
            x.code= this.rowDate;
            x.details= null;

            this.dateitems.unshift(x);
            this.items = this.dateitems.concat(itemObjArray); // add date time to existing combo value from json
        } else {
            this.items = itemObjArray; // add date time to existing combo value from json
        }
        
        console.log("custom-dropdown-component rowDate: ", this.rowDate);
        console.log("custom-dropdown-component dateitems: ", this.dateitems);
        console.log("custom-dropdown-component itemArray: ", this.itemArray);
        console.log("custom-dropdown-component items: ", this.items);
        console.log("custom-dropdown-component itemObjArray: ", itemObjArray);
        
        // set initial selection
        this.bankCtrl.setValue(this.items[10]);
        // load the initial bank list
        this.filteredBanks.next(this.items.slice());

        // listen for search field value changes
        this.bankFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterBanks();
            });
    }

    go(event) {
        // console.log("****************");
        console.log("go event: " + event.value);
        console.log("ColType Initial: ", this.colDef.colDef.columnType);
        // console.log("****************");

        if (event.value) {
            this.selectedItem = event.value;
            let colId;

            if (this.colDef.colDef.columnType === "Combo") {
            } else {
                colId = this.itemArray.find(
                    (res) => res.code === this.selected
                );

                if (colId === undefined) {
                    colId = this.itemArray.find(
                        (res) => res.valText === this.selected
                    );
                }
            }

            console.log("ColType: ", this.colDef.colDef.columnType);

            if (this.colDef.colDef.columnType === "Combo") {
                this.saveComboDropDownValueToDatabase(event.value);
            } 
            else {
                if (colId !== undefined) {
                    let params = {};
                    if (
                        this.colDef.colDef.columnType === "DD-Self" ||
                        this.colDef.colDef.columnType === "DD-Suggest"
                    ) {
                        let params = {};
                        params = {
                            userid: this.LocalStorageHandlerService.getFromStorage(
                                "userObj"
                            ).userId,
                            EntryId: this.colDef.data.rowId, // Parent ID of the row for which cell he is editing
                            ViewID: this.viewId,
                            colId: this.colDef.colDef.colId,
                            ColType: this.colDef.colDef.columnType, // You need to send the column type
                            Value: event.value,
                        };

                        if (Object.keys(params).length !== 0) {
                            this.salesLogService
                                .insertCellValue(params)
                                .subscribe(() => {
                                    this.signalRService.BroadcastLiveSheetData();
                                });
                        }
                    } else {
                        // alert("1");
                        params = {
                            userid: this.LocalStorageHandlerService.getFromStorage(
                                "userObj"
                            ).userId,
                            EntryId: this.colDef.data.rowId, // Parent ID of the row for which cell he is editing
                            ViewID: this.viewId,
                            colId: this.colDef.colDef.colId,
                            ColType: this.colDef.colDef.columnType, // You need to send the column type
                            Value: colId.id,
                        };
                    }

                    if (Object.keys(params).length !== 0) {
                        this.salesLogService
                            .insertCellValue(params)
                            .subscribe(() => {
                                this.signalRService.BroadcastLiveSheetData();
                            });
                    }
                }
            }
        }
    }

    saveComboDropDownValueToDatabase(value) {
        let params = {};
                params = {
                    userid: this.LocalStorageHandlerService.getFromStorage(
                        "userObj"
                    ).userId,
                    EntryId: this.colDef.data.rowId, // Parent ID of the row for which cell he is editing
                    ViewID: this.viewId,
                    colId: this.colDef.colDef.colId,
                    ColType: this.colDef.colDef.columnType, // You need to send the column type
                    Value: value,
                };

                console.log("Combo params", params);

                if (Object.keys(params).length !== 0) {
                    this.salesLogService
                        .insertCellValue(params)
                        .subscribe(() => {
                            this.signalRService.BroadcastLiveSheetData();
                        });
                }
    }
}
