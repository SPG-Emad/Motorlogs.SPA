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
import { ToastHandlerService } from "app/shared/services/toast-handler.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";

declare var $: any;

// This component works other than date components in saleslog component as well
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-single-selection-example",
    templateUrl: "./custom-dropdown.component.html",
    styleUrls: ["./custom-dropdown.component.scss"],
})

// file name is custom-dropdown.component.ts
export class SingleSelectionExampleComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild("singleSelect", { static: false }) singleSelect: MatSelect;
    @Input("flag") customDropdownFlag: boolean;
    @Input("rowDate") rowDate: string;
    @Input("itemArray") itemArray: any;
    @Input("selected") selected: string;
    @Input("header") header: string;
    @Input("colDef") colDef: any;

    protected items: ItemObj[] = [];
    protected dateitems: ItemObj[] = [];
    paramsObject: any;

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

    selectedItem: string;

    constructor(
        private salesLogService: SaleslogService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private signalRService: SignalRService,
        private cdref: ChangeDetectorRef
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    open() {
        console.log("cal open");

        $.datetimepicker.setLocale("en");
        $("#_datetimepicker4").datetimepicker({
            format: "d.m.Y H:i",
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
        // console.log($("#_datetimepicker4").val());

        // console.log(this.selectedItem+!this.flag);
        // console.log(this.items.some(x => x.code === "TBA"));
        alert("date");

        if (
            this.items.length == this.itemArray.length &&
            this.selectedItem != null
        ) {
            // console.log(this.items);
            let item = new ItemObj();

            item.name = this.selectedItem;
            item.id = this.selectedItem;
            item.code = null;
            item.details = null;
            this.dateitems.push(item);

            // console.log(this.dateitems);
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
            item.id = this.selectedItem;
            item.code = null;
            item.details = null;
            this.dateitems.push(item);

            // console.log(this.dateitems);
            // this.ngOnInit();
        }

        this.ngOnInit();
    }

    dateTimePushToItems(item): boolean {
        if (this.items.some((x) => x.code === item)) {
            return true;
        } else {
            return false;
        }
    }

    ngOnInit() {
        console.log("SELECTED ITEM: ", this.selected);
        let itemObjArray: ItemObj[] = [];
        let selected = this.selected;
        if (this.itemArray) {
            this.itemArray.forEach(function (k: any) {
                // console.log("Custom Dropdown -- this.itemArray:: k.valText " + k.valText + " id: " + k.id + " detail: " + k.details);
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
                    itemObjArray.push(item);
                }
            });
        }
        if (this.dateitems.length >= 1) {
            this.items = this.dateitems.concat(itemObjArray); // add date time to existing combo value from json
            console.log("date items exists 1: ", this.dateitems);
        } else {
            this.items = itemObjArray; // add date time to existing combo value from json
        }

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
            .subscribe(() => {
                // setting the compareWith property to a comparison function
                // triggers initializing the selection according to the initial value of
                // the form control (i.e. _initializeSelection())
                // this needs to be done after the filteredBanks are loaded initially
                // and after the mat-option elements are available
                this.singleSelect.compareWith = (a: ItemObj, b: ItemObj) =>
                    a && b && a.id === b.id;
            });
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

    go(event) {
        // console.log("****************");
        // console.log(event);
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

            // console.log("****************");
            // console.log("colDef: ", this.colDef);
            // console.log("SELECTED: ", this.selected);
            // console.log("ITEM ARRAY: ", this.itemArray);
            // console.log("COLID: ", colId);
            // console.log("EntryID: ", this.colDef.data.rowId);
            // console.log("Column ID: ", this.colDef.colDef.colId);
            // console.log("ColType: ", this.colDef.colDef.columnType);
            // // console.log("Value: ", colId.id);
            // console.log("****************");

            if (this.colDef.colDef.columnType === "Combo") {
                let params = {};
                params = {
                    userid: this.LocalStorageHandlerService.getFromStorage(
                        "userObj"
                    ).userId,
                    EntryId: this.colDef.data.rowId, // Parent ID of the row for which cell he is editing
                    ViewID: 1,
                    colId: this.colDef.colDef.colId,
                    ColType: this.colDef.colDef.columnType, // You need to send the column type
                    Value: event.value,
                };

                // console.log("params", params);

                if (Object.keys(params).length !== 0) {
                    this.salesLogService.insertCellValue(params).subscribe(() => {
                        this.signalRService.BroadcastLiveSheetData();
                    });
                }

               
            } else {
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
                            ViewID: 1,
                            colId: this.colDef.colDef.colId,
                            ColType: this.colDef.colDef.columnType, // You need to send the column type
                            Value: event.value,
                        };

                        console.log("params line: 360", params);

                        if (Object.keys(params).length !== 0) {
                            this.salesLogService
                            .insertCellValue(params)
                            .subscribe(() => {
                                this.signalRService.BroadcastLiveSheetData();
                            });
                        }

                        
                    } else {
                        alert("1");
                        params = {
                            userid: this.LocalStorageHandlerService.getFromStorage(
                                "userObj"
                            ).userId,
                            EntryId: this.colDef.data.rowId, // Parent ID of the row for which cell he is editing
                            ViewID: 1,
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
}
