import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, EventEmitter, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
// import { IRole, ConfigurationService } from 'ml-setup/shared/services/configuration/configuration.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolesService, IRole } from 'ml-setup/shared/services/user-access-rights/roles.service';
import { ConfigurationService } from 'ml-setup/shared/services/configuration/configuration.service';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ml-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesListComponent implements OnInit, OnDestroy {

    @Input()
    searchedForValue: string;
    @Input() 
    reloadType: number;

    @Input() 
    reloadRoles: any;

    @Output()
    editValue = new EventEmitter();

    departmnents: object[];

    dataSource: MatTableDataSource<IRole>;
    showLoader = true;

    @ViewChild(MatPaginator, { static: true })
    paginator: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    private _unsubscribeAll = new Subject();

    displayedColumns = [

        { def: 'id', label: 'ID', hide: true },
        { def: 'rolename', label: 'Pay Type', hide: false },
        { def: 'code', label: 'Code', hide: false },
        { def: 'action', label: 'Action', hide: false }
    ];

    constructor(
        private roleService: RolesService, 
    ) {}

    ngOnInit(): void {
        /*Generaet Roles data*/ 
        this.generateRolesGrid();
        /*--------------------*/ 
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnChanges(changes: SimpleChanges) {

        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
              switch (propName) {
                case 'searchedForValue': {
                    /**
                     * generateDepartmentsTable
                     * 
                     * @params type (0 = insert new data, 1 = filter)
                     * @params searchedForValue - For searched value 
                     * @params response - For inserting new data 
                     * 
                     * */ 

                    /*If edit values exist, call edit method to display values*/ 
                    if(this.searchedForValue){
                        this.generateRolesTable(1,this.searchedForValue,undefined);
                    }
                    /*-------------------------------------------------------*/ 
                }
                case 'reloadRoles': {
                    if(this.reloadRoles){
                        this.showLoader= true;
                        this.generateRolesGrid();
                    }
                    /*----------------- */
                }
              }
            }
          }

        /*------------------------- */
    }


    generateRolesGrid() {
        this.roleService
        .getRoles()
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
            (response) => {   
                this.roleService.roleList =  response;
                this.formatResponse(response);
                this.generateRolesTable(0,undefined,response);
                this.showLoader = false;
        });
    }

    formatResponse(response){
        let result = [];
        response.map(res=>{

            result.push(
                {
                'id':res.id,
                'description':res.name,
                'code': res.code
                }
            );
        });
        this.roleService.userRole = result;
    }

    generateRolesTable(type?, filter?,response?){
        if(type === 0){
            this.roleService.roleList = response;
            this.dataSource = new MatTableDataSource<IRole>(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        }else{
            this.dataSource.filter = filter;
        }
    }
    

    getDisplayedColumns(): string[] {
        return this.displayedColumns.filter(cd => !cd.hide).map(cd => cd.def);
    }

    applyFilter(filterValue: string): void {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    editRole(role: IRole) {
        const roleFetched = Object.assign({}, role);
        roleFetched.oldCode = roleFetched.code;
        this.roleService.selectedRole = Object.assign({}, roleFetched);
        this.editValue.emit(this.roleService.selectedRole);
        // console.log(roleFetched);
    }


    removeRole(roleType: IRole) {
        this.showLoader = true;
        this.roleService.deleteRole(roleType.id)
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                res => {
                    /* Display Success Message */                     
                    this.roleService.generateToast('Record Deleted Successfully','OK');
                    /*--------------------------------------------*/
                    
                    /* Reload Department data after deletion */      
                    this.generateRolesGrid()
                    /*--------------------------*/

                },
                err => {
                    this.showLoader = false;

                    /* In case of Failure, Display Error Message */                     
                    this.roleService.generateToast('Unable to delete record' + err,'OK');
                    /*--------------------------------------------*/
                });
    }



  
}
