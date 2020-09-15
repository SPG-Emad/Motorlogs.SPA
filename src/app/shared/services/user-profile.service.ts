import { Injectable } from '@angular/core';
import { DepartmentAccessDto, SystemFunctionAccessDto, UserConfigDto } from 'ml-others/shared/services/my-profile/my-profile.service';
import { FuseNavigationItem } from '@fuse/types';
import { navigation } from '../navigation/navigation';
import { EncryptionService } from './encryption.service';

export interface UserProfile {
    authenticated?: boolean | null;
    decodedToken?: any;
    userId: number;
    login: string;
    picture: string;
    roleID: number;
    roleName: string;
    roleCode: string;
    roleLevel: number | null;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    direct: string;
    lastLogin: string;
    enabled: boolean | null;
    name: string;
    sessionId: string;
    token: string;
    showNotifications: boolean | null;
    restrictedAccess: boolean | null;
    canSignInAccessOwnSalesLog: boolean | null;
    canSeeAllDeliveriesWithinDepartment: boolean | null;
    tradeInArriving: boolean;
    departmentAccess: DepartmentAccessDto[];
    functionAccess: SystemFunctionAccessDto[];
    userConfigurations: UserConfigDto[];
    routineMenuAccess: RoutineMenuParent[];
    systemFunctionMenuAccess: RoutineMenuChild[];
}

export interface RoutineMenuParent {
    depId: string;
    depName: string;
    rights: RoutineMenuChild[];
    tradeInArriving: boolean | null;
}

export interface RoutineMenuChild {
    title: string;
    type: string;
    url: string;
    code: string;
}

@Injectable()
export class UserProfileService {
    currentUser: UserProfile | null;

    constructor(private encryptionService: EncryptionService) {
      
    }

    generateApplicationMenu() {
        this.updateRoutineMenuSection();
        this.updateSystemMenuSection();
        this.updateOthersMenuSection();
    }

    updateRoutineMenuSection() {
        const departmentsFetchedFromAPI: RoutineMenuParent[] = this.currentUser.routineMenuAccess;

        if (departmentsFetchedFromAPI.length > 0) {

            navigation.splice(0, 0, {
                id: 'group-dashboard',
                title: 'Group Dashboard',
                type: 'item',
                icon: 'home',
                url: '/group-overview'
            });

            const menuGeneration: FuseNavigationItem =
            {
                id: 'routineFunctions',
                title: 'Routine Functions',
                type: 'group',
                icon: 'pages',
                children: []
            };

            const dynamicMenu: FuseNavigationItem[] = [];

            departmentsFetchedFromAPI
                .map((parent) => {
                    const tempChild: FuseNavigationItem[] = [];

                    parent.rights.map((child) => {
                        tempChild.push(
                            {
                                id: child.title.toLowerCase(),
                                title: child.title,
                                type: 'item',
                                url: this.encryptDepartmentId(child.url)
                            }
                        );
                    });

                    dynamicMenu.push(
                        {
                            id: parent.depId,
                            title: parent.depName,
                            type: 'collapsable',
                            icon: 'assignment',
                            children: tempChild,
                        }
                    );
                });

            const hasTradeInArriving = this.currentUser.tradeInArriving;

            menuGeneration.children = dynamicMenu;

            if (hasTradeInArriving) {
                menuGeneration.children.push({
                    id: 'tradeinlog',
                    title: 'Trade-In-Log',
                    type: 'collapsable',
                    icon: 'assessment',
                    children: [
                        {
                            id: 'arriving',
                            title: 'Arriving',
                            type: 'item',
                            url: '/routine/trade-in-log/arriving'
                        },
                    ]
                });
            }

            navigation.splice(1, 0, menuGeneration);
        }
    }

    encryptDepartmentId(value: string) {
        if (value.indexOf('/') > -1) {
            const charToSearch = value.split('/');
            const lastPartOfUrl = charToSearch[charToSearch.length - 1];
            const encryptedText = this.encryptionService.convertToEncOrDecFormat('encrypt', lastPartOfUrl.toString());
            value = value.replace(lastPartOfUrl, encryptedText);
            return value;
        }
        else {
            return value;
        }
    }

    updateSystemMenuSection() {
        const menuGeneration: FuseNavigationItem =
        {
            id: 'setupfunctions',
            title: 'Setup Functions',
            type: 'group',
            icon: 'pages',
            children: []
        };

        if (this.currentUser.systemFunctionMenuAccess.length > 0) {

            this.currentUser.systemFunctionMenuAccess.filter(x => x.code !== 'MP' && x.code !== 'CCP').map((child) => {
                menuGeneration.children.push({
                    id: child.title.toLowerCase(),
                    title: child.title,
                    type: 'item',
                    icon: 'settings',
                    url: child.url
                });
            });

            navigation.splice(2, 0, menuGeneration);
        }
    }

    updateOthersMenuSection() {
        const menuGeneration: FuseNavigationItem =
        {
            id: 'others',
            title: 'Others',
            type: 'group',
            icon: 'pages',
            children: []
        };

        // If the user have some access to client contact profile then do this
        if (this.currentUser.functionAccess.find(x => x.sysFuncCode === 'CCP')) {
            menuGeneration.children.push(
                {
                    id: 'clientcontactprofile',
                    title: 'Client Contact Profile',
                    type: 'item',
                    icon: 'person',
                    url: '/others/client-contact-profile'
                },
                {
                    id: 'my-profile',
                    title: 'My Profile',
                    type: 'item',
                    icon: 'person',
                    url: '/others/my-profile'
                });
        } else {
            menuGeneration.children.push({
                id: 'my-profile',
                title: 'My Profile',
                type: 'item',
                icon: 'person',
                url: '/others/my-profile'
            });
        }

        navigation.splice(3, 0, menuGeneration);
    }
}
