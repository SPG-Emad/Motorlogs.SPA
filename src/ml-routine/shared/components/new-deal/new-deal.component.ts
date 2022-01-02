import { SaleslogService } from "./../../../shared/services/saleslog/saleslog.service";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageHandlerService } from "app/shared/services/local-storage-handler.service";
import { environment } from "../../../../environments/environment";
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
        private signalRService: SignalRService,
        private LocalStorageHandlerService: LocalStorageHandlerService,
        @Inject(MAT_DIALOG_DATA) public modalParams?: any
    ) {
        if (modalParams && modalParams.hasOwnProperty("key")) {
            /* Fetch Department ID and view ID */
            this.decryptedDepartmentId = modalParams.key.id;
            this.viewId = this.modalParams.key.viewId;
            /*-----------------------------*/

            /*If view ID is 1 or 2 then new deal else add wholesales for arriving*/
            if (this.viewId !== 3) {
                this.modalTitle = "New Deal";
            } else {
                this.modalTitle = "Add Wholesale";
                this.siteValue = environment.ARRIVING_SITE_VALUE;
            }
            /*-----------------------------------*/
        }

        this.dateAdapter.setLocale("en-GB");
    }

    siteValue: string = "";
    modalTitle: string = "New Deal";
    startDate = new Date();
    add: boolean = false;
    date: any;
    loader: boolean = false;
    viewId: number = 3;
    decryptedDepartmentId: string;
    public message: string;

    arrivingForm: FormGroup = this.fb.group({
        purchaseDate: [new Date(), [Validators.required]],
        site: [""],
        purchaseFrom: [""],
    });

    ngOnInit() {}

    InsertRows() {
        this.loader = true;
        // console.log(this.decryptedDepartmentId);
        let purchaseDate = this.arrivingForm.get("purchaseDate").value;

        const d = new Date(purchaseDate);
        // This will return an ISO string matching your local time.
        let finalDate = new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate() -1 ,
            d.getHours(),
            d.getMinutes() - d.getTimezoneOffset()
        ).toLocaleDateString();

        let params = { 
            UserId: this.LocalStorageHandlerService.getFromStorage("userObj").userId,
            ViewId: 3, // Always be 1
            DeptId: this.decryptedDepartmentId,
            purchaseDate: finalDate,
            PurchaseFrom: this.arrivingForm.get("purchaseFrom").value,
        };
        
        console.log("order date: ", finalDate);
        // console.log("params: ", params);

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
        if (this.arrivingForm.valid) {
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
