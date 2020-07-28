import { Subscription } from 'rxjs';
import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// import { NgxSmartModalService } from 'ngx-smart-modal';
import { PermissionsService } from 'ml-setup/shared/services/permissions/permissions.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomComponent } from '../add-custom/add-custom.component';
import { PermissionsComponent } from 'ml-setup/permissions/containers/permissions/permissions.component';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
// import { ILoadingOverlayComponentAngularComp } from '@ag-grid-community/angular';

@Component({
    selector: 'app-loading-overlay',
    templateUrl: './group-row-inner-renderer.component.html',
    styleUrls: ['./group-row-inner-renderer.component.scss'],
    encapsulation: ViewEncapsulation.Emulated

})
export class CustomHeader {
    private params: any;

    @ViewChild('PermissionsComponent', { static: true }) PermissionsComponent: PermissionsComponent;

    private ascSort: string;
    private descSort: string;
    private noSort: string;
    private dialogRef: any;
    private editName: boolean = false;
    private columnId: number;

    constructor(
        private permissionsService: PermissionsService,
        private toastHandlerService: ToastHandlerService,
        public dialog: MatDialog,
    ) { }

    @ViewChild('menuButton', { static: true }) public menuButton;

    agInit(params): void {
        this.params = params;
    }

    updateModal() {
        let colId = this.params['column']['userProvidedColDef'].colId;
        this.columnId = colId;

        this.permissionsService.columnId = colId;
        this.dialogRef = this.dialog.open(AddCustomComponent, {
            panelClass: 'custom-dialog-container',
            width: "500px",
            data: {
                "key": { colId: colId }
            },
            disableClose: true,
        });
        this.dialogRef.afterClosed();
        // this.ngxSmartModalService.getModal('addColumn').open();
    }

    onBlurMethod() {
        this.editName = false;

    }

    escBtn(event) {
        console.log(event.key)
        let keyPressed = event.keyCode;

        if (keyPressed === 27) {
            this.editName = false;

        }
    }
    
    onEditName(event) {
        let keyPressed = event.keyCode;

        this.editName = false;

        let newName = event.target.value;
        let colId = this.params['column']['userProvidedColDef'].colId;

        let params = {
            "columnId": colId,
            "newName": newName
        };

        this.permissionsService.postColumnName(params)
            .subscribe(
                (res) => {

                    /*Set Column Name in view by getting ColDef reference and passing new headerName value*/
                    this.params['column'].colDef.headerName = newName;
                    this.permissionsService.gridApi.refreshHeader();
                    /*-------------------------------------------*/

                    /*Display success message*/
                    this.toastHandlerService.generateToast('Column Name updated successfully', 'OK', 2000);
                    /*-----------------------*/

                },
                err => {
                    this.toastHandlerService.generateToast('Unable to perform action' + err, 'OK', 2000);
                }
            );

    }
}
