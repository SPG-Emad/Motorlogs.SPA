import { Subscription, forkJoin } from 'rxjs';
import { navigation } from 'app/shared/navigation/navigation';
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CustomHeader } from 'ml-setup/permissions/components/group-row-inner-renderer/group-row-inner-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsService } from 'ml-setup/shared/services/permissions/permissions.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';
import { LegendsService } from 'ml-setup/shared/services/permissions/legends.service';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { CustomLoadingOverlayComponent } from '../../components/loading-overlay/custom-loading-overlay.component';
@Component({
    selector: 'ml-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class PermissionsComponent implements OnInit {

    gridApi;
    gridColumnApi;
    defaultColDef;
    autoGroupColumnDef;
    departmentOptions: string[] = ['ON', 'OFF'];
    rolesOptions: string[] = ['EDIT', 'READ ONLY', 'BLOCK'];
    rowHeight: number;
    columnFilter: number;
    toggleColumns = true;
    updateColumnID: number;
    frameworkComponents;
    loadingOverlayComponent;
    loadingOverlayComponentParams;
    rolePos = 10;

    modules: any[] = AllCommunityModules;

    columnDefs = [];
    columnData = [];
    showAllColumnData = [];
    salesLogColumnDefs = [];
    deliveredColumnDef = [];
    arrivingColumnDefs = [];

    rowData = [];
    showAllRowData = [];
    saleslog = [];
    delivered = [];
    arriving = [];

    rowCode = [];
    showAllRowCode = [];
    arrivingRowCode = [];
    deliveredRowCode = [];
    salesLogdRowCode = [];

    response = [];

    accessList = [];

    tabSelected = 0;
    overlayLoadingTemplate;

    constructor(
        private legendService: LegendsService,
        private permissionsService: PermissionsService,
        private toastHandlerService: ToastHandlerService,
    ) {

        this.frameworkComponents = {
            customLoadingOverlay: CustomLoadingOverlayComponent,
        };

        // this.loadingOverlayComponent = 'customLoadingOverlay';

        // this.loadingOverlayComponentParams = {
        //   loadingMessage: 'One moment please...',
        // };
        this.overlayLoadingTemplate =
            `
      <div style="
            display: flex;
            position: relative;
            width: 130px;
            justify-content: center;
            height: 150px;" 
            class="ag-overlay-loading-center">
        <img src="./../../../assets/images/loader.gif" style="position: absolute;height: 120px;width: 130px;">
        <span style="position: absolute;bottom: 28px;">Loading</span>
      </div>
    `;
    }

    cellStyling(params) {

        let rowData;
        if (this.tabSelected === 0) {
            rowData = this.showAllRowCode.find(el => el.colId === params.colDef.colId && el.permission === params.data.permission);
        }
        else if (this.tabSelected === 1) {
            rowData = this.salesLogdRowCode.find(el => el.colId === params.colDef.colId && el.permission === params.data.permission);
        }
        else if (this.tabSelected === 2) {
            rowData = this.arrivingRowCode.find(el => el.colId === params.colDef.colId && el.permission === params.data.permission);
        }
        else if (this.tabSelected === 3) {
            rowData = this.deliveredRowCode.find(el => el.colId === params.colDef.colId && el.permission === params.data.permission);
        }


        if ((params.value === "EDIT" || params.value === "BLOCK" || params.value === "READ ONLY") && rowData && rowData.rowCode === "EDIT-M-U") {
            return { "backgroundColor": '#dcdcdc36', "color": '#00000063', 'pointer-events': 'none', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
        }
        else if ((params.value === "ON" || params.value === "OFF") && rowData && rowData.rowCode === "OFF-U-D") {
            return { "backgroundColor": '#dcdcdc36', "color": '#00000063', 'pointer-events': 'none', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
        }
        else {
            if (params.value === "ON") {
                return { "backgroundColor": '#e6fff1', "color": '#009c47', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "OFF") {
                return { "backgroundColor": '#feedef', "color": '#f16145', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "EDIT") {
                return { "backgroundColor": '#e6fff1', "color": '#009c47', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "BLOCK") {
                return { "backgroundColor": '#feedef', "color": '#f16145', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "READ ONLY") {
                return { "backgroundColor": '#e5faff', "color": '#006ab7', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "REPORT ONLY") {
                return { "backgroundColor": '#e5faff', "color": '#006ab7', "fontWeight": 'bold', 'cursor': 'pointer', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "LOCK") {
                return { "background-image": "url(../../../../assets/images/lockpermission.png);", "font-size": "0px !important;" };
            }
            else if (params.value === "Department Master") {
                return { "backgroundColor": '#006fc8', "color": '#ffff', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === "User Roles") {
                return { "backgroundColor": '#006fc8', "color": '#ffff', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            else if (params.value === undefined) {
                return { "backgroundColor": '#d2dce6', 'pointer-events': 'none', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center', };
            }
            return {
                "backgroundColor": '#fff', 'justify-content': 'flex-start', 'overflow': 'hidden', 'white-space': 'nowrap', 'min-width': '0', ' text-overflow': 'ellipsis', 'color': ' #000',
                'font-weight': ' normal'
            };
        }
    }

    onRowClicked(e) {
        console.log('Column Event: ' + e.type, e);
    }

    filterColumns(columnID) {
        this.gridApi.showLoadingOverlay();

        this.permissionsService.getPermissions().subscribe(res => {

            this.columnDefs = [];
            this.rowData = [];
            this.salesLogdRowCode = [];
            this.showAllRowCode = [];
            this.arrivingRowCode = [];
            this.deliveredRowCode = [];

            this.tabSelected = columnID;
            this.response = res;
            setTimeout(() => {
                if (columnID === 0) {

                    /*Generate Grid for different Views*/
                    this.showAllRowData = this.generatePermissionsGrid(null); // =========> SHOW ALL
                    this.rowData = this.showAllRowData;
                    this.showAllRowCode = this.rowCode;

                    this.showAllColumnData = this.columnData; // =========> SHOW ALL
                    this.columnDefs = [...this.showAllColumnData];
                } else if (columnID === 1) {
                    this.showAllRowData = this.generatePermissionsGrid(1); // =========> SalesL
                    this.rowData = this.showAllRowData;
                    this.salesLogdRowCode = this.rowCode;

                    this.showAllColumnData = this.columnData; // =========> SalesL
                    this.columnDefs = [...this.showAllColumnData];

                } else if (columnID === 2) {
                    /*Generate Grid for different Views*/
                    this.showAllRowData = this.generatePermissionsGrid(2); // =========> Arriving
                    this.rowData = this.showAllRowData;
                    this.arrivingRowCode = this.rowCode;

                    this.showAllColumnData = this.columnData; // =========> Arriving
                    this.columnDefs = [...this.showAllColumnData];
                } else if (columnID === 3) {
                    /*Generate Grid for different Views*/
                    this.showAllRowData = this.generatePermissionsGrid(3); // =========> Delivered
                    this.rowData = this.showAllRowData;
                    this.deliveredRowCode = this.rowCode;

                    this.showAllColumnData = this.columnData; // =========> Delivered
                    this.columnDefs = [...this.showAllColumnData];
                }
            }, 1);
            this.gridApi.hideOverlay();
        });

    }

    test() {
        this.gridApi.showLoadingOverlay();
    }

    GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        };
    }

    resetState() {
        this.gridColumnApi.resetColumnState();
        this.gridColumnApi.resetColumnGroupState();
        this.gridApi.setSortModel(null);
        this.gridApi.setFilterModel(null);
    }

    printState() {
        const colState = this.gridColumnApi.getColumnState();
        const groupState = this.gridColumnApi.getColumnGroupState();
        const sortState = this.gridApi.getSortModel();
        const filterState = this.gridApi.getFilterModel();

        console.log('***********************');
        console.log('colState: ', colState);
        console.log('groupState: ', groupState);
        console.log('sortState: ', sortState);
        console.log('filterState: ', filterState);
        console.log('***********************');
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.permissionsService.gridApi = params.api;
        this.permissionsService.gridColumnApi = params.columnApi;
        this.gridApi.showLoadingOverlay();
        this.generateGrid();

        console.log('************************');
        console.log('onGridReady');
        console.log('************************');
    }

    generateGrid() {
        forkJoin([
            this.permissionsService.getPermissions(),
            this.legendService.getLegends()
        ]).subscribe(res => {

            this.response = res[0];
            this.accessList = res[1];
            this.columnData = [];

            /*Generate Grid for different Views*/
            this.showAllRowData = this.generatePermissionsGrid(null); // =========> SHOW ALL
            this.rowData = this.showAllRowData;
            this.showAllRowCode = this.rowCode;

            this.showAllColumnData = this.columnData; // =========> SHOW ALL
            this.columnDefs = this.showAllColumnData;
            /*---------------------------------*/

        });
    }

    generatePermissionsGrid(viewId) {

        const row1 = {};
        const row2 = {};
        const departmentRow = [];
        const rolesRow = [];
        const column = [];
        const columField = [];
        const rolesPos = this.response['department'].length + 1;

        this.columnData = [];
        this.rowCode = [];

        column.push(
            {
                headerName: 'Permissions',
                field: 'permission',
                pinned: 'left',
                lockPinned: true,
                lockPosition: true,
                suppressMovable: true,
                headerClass: 'permission-column',
                editable: false,
                maxWidth: 200,
                suppressMenu: true,
                cellClass: 'permission-row'
            }
        );
        columField.push({ headerName: "" });

        /*Columns Array*/
        this.response['column'].map(col => {
            col.view.map(res => {
                if (res.viewId === viewId) {
                    const menuSuppress = (col.isEditable) ? false : true;
                    
                    console.log('Menu Suppress', menuSuppress);

                    if (col.code !== null) {
                        columField.push({
                            headerName: col.columName,
                            field: col.code,
                        });
                    }

                    column.push(
                        {
                            headerName: col.columName,
                            field: '' + col.colId,
                            suppressMovable: true,
                            suppressMenu: menuSuppress,
                            colId: col.colId,
                            type: res.type,
                            colOption: col.colOption,
                            viewId: res.viewId
                        }
                    );
                }
            });
        });
        /*--------------*/

        /*Departments Array*/
        this.response['department'].map(depart => {
            depart.row.map((res, index) => {

                if (res.viewId === viewId) {
                    const rowValue = this.accessList.find(el => el.code === res.rowOption);
                    row1['deptId'] = depart.deptId;
                    row1['permission'] = depart.departmentName;
                    row1['' + res.colId] = rowValue.name;
                }
            });
            departmentRow.push({ ...row1 });
        });
        /*----------------*/

        /*Rows Array*/
        this.response['roles'].map(roles => {
            roles.row.map((res, index) => {
                if (res.viewId === viewId) {
                    const rowValue = this.accessList.find(el => el.code === res.rowOption);

                    row2['roleId'] = roles.roleId;
                    row2['permission'] = roles.roleName;
                    row2['' + res.colId] = rowValue.name;

                    this.rowCode.push({
                        colId: res.colId,
                        permission: roles.roleName,
                        rowCode: res.rowOption
                    });
                }
            });
            rolesRow.push({ ...row2 });
        });
        /*----------------*/

        this.columnData = column;
        this.rolePos = rolesPos;
        return [
            { permission: 'Department Master' },
            ...departmentRow,
            { permission: 'User Roles' },
            ...rolesRow,
        ];
    }

    cellEditorSelector(params) {

        console.log('************************');
        console.log('params.colDef.field: ', params.colDef.field);
        console.log('params.value.field: ', params.value);
        console.log('params.rowIndex: ', params.rowIndex);
        console.log('this.rolePos: ', this.rolePos);
        console.log('************************');

        if (params.colDef.field !== 'permission' &&
            params.value !== undefined &&
            params.rowIndex < this.rolePos
        ) {
            return {
                component: 'agSelectCellEditor',
                params: {
                    values: this.departmentOptions
                }
            };
        } else if (params.rowIndex > this.rolePos) {
            return {
                component: 'agSelectCellEditor',
                params: {
                    values: this.rolesOptions
                }
            };
        }
        return false;
    }

    onCellValueChanged(e) {

        const colId = e.colDef.colId;
        const value = e.value;
        const rowIndex = e.rowIndex;
        const permission = e.data.permission;
        const headerName = e.colDef.headerName;
        const type = e.colDef.type;
        const viewId = e.colDef.viewId;
        const rowCode = this.accessList.find(el => el.name === value);

        if (rowIndex >= this.rolePos) {
            const param = {
                deptId: null,
                viewId: viewId,
                colId: colId,
                roleId: e.data.roleId,
                accessType: rowCode.code
            };

            this.updateRolesRow(param);
        }
        else {
            const param = {
                roleId: null,
                viewId: viewId,
                colId: colId,
                deptId: e.data.deptId,
                accessType: rowCode.code
            };

            this.updateDepartmentRow(param);
        }
    }

    updateDepartmentRow(params: any) {

        this.permissionsService.updatePermission(params).subscribe(
            (res) => {

                /*Display success message*/
                this.toastHandlerService.generateToast('Column updated successfully', 'OK', 2000);
                /*-----------------------*/

            },
            err => {
                this.toastHandlerService.generateToast('Unable to perform action' + err, 'OK', 2000);
            }
        );
    }

    updateRolesRow(params: any) {

        this.permissionsService.updatePermission(params).subscribe(
            (res) => {

                /*Display success message*/
                this.toastHandlerService.generateToast('Column updated successfully', 'OK', 2000);
                /*-----------------------*/

            },
            err => {
                this.toastHandlerService.generateToast('Unable to perform action' + err, 'OK', 2000);
            }
        );
    }

    ngOnInit() {
        this.defaultColDef = {
            flex: 1,
            cellEditorSelector: this.cellEditorSelector.bind(this),
            cellStyle: this.cellStyling.bind(this),
            rowStyle: { border: '1px solid #000' },
            minWidth: 105,
            maxWidth: 105,
            editable: true,
            filter: true,
            suppressMenu: true
            // resizable: true,
        };
        this.rowHeight = 29;
        this.frameworkComponents = { agColumnHeader: CustomHeader };

        this.autoGroupColumnDef = {
            field: 'permission',
            minWidth: 200,
        };
    }

}
