import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogRef,
} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { SaleslogService } from "ml-routine/shared/services/saleslog/saleslog.service";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";

let ELEMENT_DATA: any[] = [];

@Component({
    selector: "app-column-options",
    templateUrl: "./column-options.component.html",
    styleUrls: ["./column-options.component.scss"],
})
export class ColumnOptionsComponent implements OnInit {
    displayedColumns: string[] = ["columnName", "display", "printExport"];
    dataSource;
    column = [];
    loader: boolean = false;
    columnLoader: boolean = false;
    optionsChanged = [];
    decryptedDepartmentId: string;
    viewId: any;

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    constructor(
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ColumnOptionsComponent>,
        private saleslogService: SaleslogService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private signalRService: SignalRService,

        @Inject(MAT_DIALOG_DATA) public modalParams?: any
    ) {
        // console.log(modalParams);
        if (modalParams && modalParams.hasOwnProperty("key")) {
            this.decryptedDepartmentId = modalParams.key.id;
            this.viewId = modalParams.key.viewId;
        }
    }

    modalTitle: string = "COLUMN OPTIONS";

    ngOnInit() {
        this.getColumns();
    }

    submit() {
        let options = [];
        this.loader = true;

        /**
         * - If any change occured then fetch all changed options and call update API
         * - Else Just close modal
         *
         * */
        if (this.optionsChanged.length > 0) {
            this.optionsChanged.map((res) => {
                let result = this.column.find((el) => el.colId === res.colId);
                if (options !== undefined) {
                    options.push({
                        colid: result.colId,
                        display: result.display,
                        print: result.print,
                    });
                }
            });

            let json = {
                ViewId: this.viewId, // For saleslog 1 , for Delivered 2, for Arriving 3
                userId: this.LocalStorageHandlerService.getFromStorage(
                    "userObj"
                ).userId,
                deptId:
                    this.viewId !== 3
                        ? this.decryptedDepartmentId
                        : this.modalParams.key.depId,
                columns: options,
            };
            this.saleslogService.updateColumnOptions(json).subscribe(() => {
                this.loader = false;
                this.signalRService.BroadcastLiveSheetData();

                this.dialogRef.close({
                    column: this.column,
                });
            });
        } else {
            this.dialogRef.close({
                column: null,
            });
        }
        /*-----------------------------*/
    }

    getColumns() {
        this.columnLoader = true;
        ELEMENT_DATA = [];
        let params = {
            ViewId: this.viewId, // For saleslog 1 , for Delivered 2, for Arriving 3
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            RoleId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .roleID,
            DeptId: this.decryptedDepartmentId,
        };
        this.saleslogService
            .getColumnOptionsListing(params)
            .subscribe((res) => {
                this.columnLoader = false;
                // console.log(this.columnLoader);
                res.map((res) => {
                    let field =
                        "" + res.colName.toLowerCase().replace(" ", "_");
                    this.column.push({
                        colId: res.colId,
                        columnName: res.colName,
                        field: field,
                        display: res.display,
                        sequence: res.sequence,
                        print: res.printable,
                    });
                    ELEMENT_DATA.push({
                        colId: res.colId,
                        columnName: res.colName,
                        display: res.display,
                        printExport: res.printable,
                        disabled: res.disabled,
                    });
                });
                this.dataSource = new MatTableDataSource(ELEMENT_DATA);
                this.dataSource.sort = this.sort;
                this.columnLoader = false;
            });
    }

    reset() {
        let params = {
            ViewId: this.viewId, // For saleslog 1 , for Delivered 2, for Arriving 3
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            DeptId:
                this.viewId !== 3
                    ? this.decryptedDepartmentId
                    : this.modalParams.key.depId,
        };
        this.saleslogService.resetColumn(params).subscribe(() => {
            this.signalRService.BroadcastLiveSheetData();
            this.getColumns();
        });
    }

    closeModal() {
        this.dialog.closeAll();
    }

    setColumnVisibility(event, options, type) {
        let value = event.checked;

        if (this.column.length > 0) {
            let colOption = this.column.find(
                (el) => el.columnName === options.columnName
            );
            this.column.map((res) => {
                if (res.columnName === colOption.columnName) {
                    let cId = this.optionsChanged.find(
                        (el) => el.columnName === colOption.columnName
                    );

                    if (cId === undefined) {
                        this.optionsChanged.push({
                            colId: res.colId,
                            columnName: res.columnName,
                        });
                    }
                    if (type === 1) {
                        res.display = value;
                    } else {
                        res.print = value;
                    }
                }
            });
        }
    }
}
