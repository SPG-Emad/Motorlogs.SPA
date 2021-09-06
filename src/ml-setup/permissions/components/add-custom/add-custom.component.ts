import { filter } from "rxjs/operators";
import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewChild,
    Input,
    SimpleChanges,
    Inject,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormArray } from "@angular/forms";
import { PermissionStateService } from "ml-setup/shared/ngrx/service/permission-column-state.service";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PermissionsService } from "ml-setup/shared/services/permissions/permissions.service";
import { ToastHandlerService } from "app/shared/services/toast-handler.service";

@Component({
    selector: "ml-add-custom-column",
    templateUrl: "./add-custom.component.html",
    styleUrls: ["./add-custom.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCustomComponent implements OnInit {
    updateColumnID: number;
    modalTitle: string;
    colNameMsg = false;

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private toastHandlerService: ToastHandlerService,
        private permissionService: PermissionsService,
        private permissionStore: PermissionStateService,
        @Inject(MAT_DIALOG_DATA) public modalParams?: any
    ) {
        this.updateColumnID = null;

        if (
            modalParams &&
            modalParams.hasOwnProperty("key") &&
            modalParams.key.colId
        ) {
            this.updateColumnID = modalParams.key.colId;
        }
        this.modalTitle = this.updateColumnID ? "EDIT COLUMN" : "ADD COLUMN";
    }

    /*Parent and Child Forms*/
    @ViewChild("userRolesComp", { static: true }) userRolesComp;
    @ViewChild("departmentComp", { static: true }) departmentComp;
    @ViewChild("addColumn", { static: true }) addColumn;

    /*--------------------*/

    /*Setup Form*/
    setupForm: FormGroup = this.fb.group({
        colName: ["", [Validators.required]],
        columnWidth: ["", [Validators.required]],
        cellType: ["", [Validators.required]],
        dropDownType: [{ value: "", disabled: true }, [Validators.required]],
        options: this.fb.array([]),
    });
    /*-----------*/

    isEditable = false;
    value = "100";

    fieldCounter = 0;

    dropDownType = [
        {
            id: 1,
            name: "Self-Learning",
            code: "DD-Self",
        },
        {
            id: 2,
            name: "Suggested",
            code: "DD-Suggest",
        },
        {
            id: 3,
            name: "Fixed",
            code: "DD-Fixed",
        },
    ];

    cellTypes = [
        {
            id: 1,
            name: "Text",
        },
        {
            id: 2,
            name: "Number",
        },
        {
            id: 3,
            name: "Date",
        },
        {
            id: 4,
            name: "Currency",
        },
        {
            id: 5,
            name: "Percentage",
        },
        {
            id: 6,
            name: "Dropdown",
        },
        {
            id: 7,
            name: "Comments Box",
        },
    ];

    ngOnInit() {
        const arr = this.setupFormOption;
        arr.controls = [];

        if (this.updateColumnID) {
            const obj = {
                colName: "test",
                columnWidth: "150",
                cellType: 6,
                dropDownType: 2,
                options: [],
            };

            this.value = obj.columnWidth;

            if (obj.cellType === 6) {
                this.setupForm.get("dropDownType").enable();
            } else {
                this.setupForm.get("dropDownType").disable();
            }

            this.setupForm.patchValue(obj);
            /*Fetch all Colum data from API*/
            // this.permissionStore.getPermissionStore(this.setupForm);
            /*-----------*/
        }
    }

    get setupFormOption() {
        return this.setupForm.get("options") as FormArray;
    }

    proceed() {
        this.colNameMsg = true;
    }

    onCellTypeSelect(event) {
        /*Get Selected Option from event object*/
        const option = event.value;
        /*-----------------------------*/

        if (option === 6) {
            this.setupForm.get("dropDownType").enable();
        } else {
            this.setupForm.get("dropDownType").disable();
        }
    }

    onDropDownTypeSelect(event) {
        // console.log("option", event.value);

        let cellName = "";

        this.dropDownType
            .filter((x) => x.id == event.value)
            .map((x) => {
                cellName = x.code;
            });

        const option = cellName;

        if (option === "DD-Fixed") {
            this.addOptions();
        } else {
            const arr = this.setupFormOption;
            arr.controls = [];
            this.setupForm.get("options").setValue([]);
        }
    }

    addRemoveOption(option: number, index?: number) {
        switch (option) {
            case 0:
                this.addOptions();
                break;
            case 1:
                this.removeOption(index);
                break;
            default:
                break;
        }
    }

    addOptions() {
        const group = {};

        let label = "option" + this.fieldCounter;
        group["option"] = ["", [Validators.required, Validators.maxLength(10)]];

        this.setupFormOption.push(this.fb.group(group));
        this.fieldCounter++;
    }

    removeOption(index: number) {
        this.setupFormOption.removeAt(index);
    }

    onlyCharacters(evt) {
        let theEvent = evt || window.event;

        // Handle key press
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        let regex = /[a-zA-Z ]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) {
                theEvent.preventDefault();
            }
        }
    }

    getFormValues() {
        const options = [];
        if (this.setupForm.get("dropDownType").value !== "") {
            this.setupForm.get("dropDownType").value.map((res) => {
                // console.log(res);
                options.push(res);
            });
        }

        const obj = {
            colName: this.setupForm.get("colName").value,
            columnWidth: this.setupForm.get("columnWidth").value,
            cellType: this.setupForm.get("cellType").value,
            dropDownType: this.setupForm.get("dropDownType").value,
            options: this.fb.array([]),
        };

        return [...this.setupForm.value];
    }

    createUpdateColumn() {
        /**
         *
         * userRolesComp
         * departmentComp
         * setupForm
         *
         * */
        const resultObj = {
            ...this.setupForm.value,
            roles: this.userRolesComp.submitForm(),
            departments: this.departmentComp.submitForm(),
        };

        /*If colID Doesnt Exist Create New columm else update columm*/
        if (!this.updateColumnID) {
            this.createColumn(resultObj);
        } else {
            this.updateColumn(resultObj);
        }
        /*-----------------------------*/
    }

    createColumn(resultObj) {
        let cellName = "";
        let dropDownType = "";
        let options = [];

        const obj = resultObj;

        this.cellTypes
            .filter((x) => x.id == obj.cellType)
            .map((x) => {
                cellName = x.name;
            });

        this.dropDownType
            .filter((x) => x.id == obj.dropDownType)
            .map((x) => {
                dropDownType = x.code;
            });

        obj.cellType = cellName;
        obj.dropDownType = dropDownType;
        obj.options.map((x) => options.push(x.option));
        obj.options = [];
        obj.options = options;

        // console.log(options);

        this.permissionService.postPermission(obj).subscribe(
            (res) => {
                /*Display success message*/
                this.toastHandlerService.generateToast(res.message, "OK", 2000);
                /*-----------------------*/
                this.dialog.closeAll();
            },
            (err) => {
                this.toastHandlerService.generateToast(
                    "Unable to perform action" + err,
                    "OK",
                    2000
                );
            }
        );
    }

    updateColumn(resultObj) {
        this.permissionService.postPermission(resultObj).subscribe(
            (res) => {
                /*Display success message*/
                this.toastHandlerService.generateToast(
                    "Column updated successfully",
                    "OK",
                    2000
                );
                /*-----------------------*/
                this.dialog.closeAll();
            },
            (err) => {
                this.toastHandlerService.generateToast(
                    "Unable to perform action" + err,
                    "OK",
                    2000
                );
            }
        );
    }
}
