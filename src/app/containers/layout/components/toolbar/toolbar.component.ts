import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

import { FuseConfigService } from "@fuse/services/config.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { navigation } from "app/shared/navigation/navigation";
import { AuthService, } from 'ml-auth/shared/services/ml-auth/ml-auth.service';
import { Store } from 'ml-shared/common/store';
import { UserProfile } from 'app/shared/services/user-profile.service';
import { DepartmentsService } from 'ml-setup/shared/services/departments/departments.service';
import { ClientContactProfileService } from 'ml-others/shared/services/client-contact-profile/client-contact-profile.service';
import { ToastHandlerService } from 'app/shared/services/toast-handler.service';

@Component({
    selector: "toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements OnInit, OnDestroy {

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        private _authService: AuthService,
        private store: Store,
        private departmentsService: DepartmentsService,
        private clientContactProfile: ClientContactProfileService,
        private toastService: ToastHandlerService
    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: "Online",
                icon: "icon-checkbox-marked-circle",
                color: "#4CAF50",
            },

        ];

        this.languages = [
            {
                id: "en",
                title: "English",
                flag: "us",
            },
            {
                id: "tr",
                title: "Turkish",
                flag: "tr",
            },
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];

    user$: Observable<UserProfile>;
    subscription: Subscription;

    ShowClientContactModal = false;
    notificationIcon: string;
    countNotifications = 0;
    objectKeys = Object.keys;

    departmentsList = [];

    clientsList = [];

    items = {};
    clientData = [];
    showLoader = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    updateClientsListingDropdown = new Subject<number>();

    getAllDepartmentsByUserId() {
        this.showLoader = true;
        this.departmentsService.getAllDepartmentsByUserId()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                res.map(res => {
                    this.departmentsList.push(
                        {
                            code: res.id,
                            description: res.name,
                        }
                    );
                });
                this.showLoader = false;
            });
    }

    // 
    getClientsFromAPI(deptId?) {
        this.showLoader = true;
        if (!deptId) {
            this.clientData = this.clientContactProfile.clientContactList;
            let model = {};
            this.clientData
                .map(x => {
                    model = {
                        code: x.entryId,
                        description: x.client
                    };
                    Object.assign(model, x);
                    this.clientsList.push(model);
                });

            this.showLoader = false;
        }
        else {
            this.clientData = this.clientContactProfile.clientContactList;
            let model = {};
            this.clientData
                .filter(x => x.deptId === deptId)
                .map(x => {
                    model = {
                        code: x.entryId,
                        description: x.client
                    };
                    Object.assign(model, x);
                    this.clientsList.push(model);
                });

            this.showLoader = false;
        }
    }

    selectedDepartment($event) {
        this.items = {};
        this.clientsList = [];
        this.clientData = [];
        let selectedDepartment;

        this.departmentsList
            .filter(x => x.code === $event)
            .map(x => {
                selectedDepartment = x.code;
            });

        this.updateClientsListingDropdown.next(selectedDepartment);
    }

    selectedClient($event) {
        console.log($event);
        this.items = {};
        this.clientData
            .filter(x => x.entryId === $event)
            .map(x => {
                const model = {
                    'Dep. Name': x.departmentName,
                    'Client': x.client,
                    'Email': x.email,
                    'Phone': x.phone,
                    'Suburb': x.suburb,
                };
                Object.assign(this.items, model);
            });
    }

    logout() {
        this.showLoader = false;
        this._authService.logoutUser();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === "top";
                this.rightNavbar = settings.layout.navbar.position === "right";
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang,
        });

        this.subscription = this._authService.auth$.subscribe();
        this.user$ = this.store.select<UserProfile>("user");

        this.updateClientsListingDropdown.subscribe((deptId) => {
            this.getClientsFromAPI(deptId);
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.subscription.unsubscribe();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(): void {
        // Do your search here...

    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    GenerateClientContactProfile() {
        this.showLoader = true;
        this.items = {};
        this.clientsList = [];
        this.clientData = [];
        this.departmentsList = [];
        this.getAllDepartmentsByUserId();

        this.clientContactProfile.getClientContactList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                response => {
                    this.clientContactProfile.clientContactList = response;
                    this.getClientsFromAPI();
                },
                err => {
                    this.toastService.generateToast(err, '400', 2000);
                },
                () => {
                    this.showLoader = false;
                });

        this.ShowClientContactModal = true;
    }
}
