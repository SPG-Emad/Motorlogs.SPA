import { SaleslogService } from "./../../../shared/services/saleslog/saleslog.service";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { SignalRService } from "ml-setup/shared/services/signal-r/signal-r.service";
import { DateAdapter } from "@angular/material";

@Component({
    selector: "app-new-deal",
    templateUrl: "./new-deal.component.html",
    styleUrls: ["./new-deal.component.scss"],
})
export class NewDealComponent implements OnInit {
    constructor(
        private dateAdapter: DateAdapter<Date>,
        private dialogRef: MatDialogRef<NewDealComponent>,
        private fb: FormBuilder,
        private saleslogService: SaleslogService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        private signalRService: SignalRService,
        @Inject(MAT_DIALOG_DATA) public modalParams?: any
    ) {
        console.log(modalParams);
        if (modalParams && modalParams.hasOwnProperty("key")) {
            this.decryptedDepartmentId = modalParams.key;
        }

        this.dateAdapter.setLocale("en-GB");
    }

    modalTitle: string = "New Deal";
    startDate = new Date();
    add: boolean = false;
    date: any;
    loader: boolean = false;
    viewId: number = 1;
    decryptedDepartmentId: string;
    public message: string;

    columnForm: FormGroup = this.fb.group({
        orderDate: [new Date(), [Validators.required]],
        customerName: [""],
        dealNumber: [""],
        stockNumber: [""],
    });

    ngOnInit() {}

    InsertRows() {
        this.loader = true;
        console.log(this.decryptedDepartmentId);
        let orderDate = this.columnForm.get("orderDate").value;

        const d = new Date(orderDate);
        // This will return an ISO string matching your local time.
        let finalDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes() - d.getTimezoneOffset()
        ).toISOString();

        let params = {
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj")
                .userId,
            ViewId: this.viewId, // Always be 1
            DeptId: this.decryptedDepartmentId,
            OrderDate: finalDate,
            CustomerName: this.columnForm.get("customerName").value,
            DealNumber: String(this.columnForm.get("dealNumber").value),
            StockNumber: String(this.columnForm.get("stockNumber").value),
        };

        console.log("order date: ", finalDate);
        console.log("params: ", params);
        this.saleslogService.postRows(params).subscribe(() => {
            this.loader = false;
            this.signalRService.BroadcastLiveSheetData();
            this.closeModal(finalDate);
        });
    }

    closeModal(date) {
        this.dialogRef.close({
            add: this.add,
            date: date,
        });
    }

    submit() {
        if (this.columnForm.valid) {
            this.add = true;
            this.InsertRows();
        }
    }

    onlyCharacters(evt) {
        var theEvent = evt || window.event;

        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        var regex = /[a-zA-Z ]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    onlyNumbers(evt) {
        evt = evt ? evt : window.event;
        var charCode = evt.which ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}
