import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ClientContactProfileService } from './services/client-contact-profile/client-contact-profile.service';
import { MyProfileService } from './services/my-profile/my-profile.service';
import { FuseSharedModule } from '@fuse/shared.module';
import { ML_SharedModule } from 'ml-shared/ml-shared.module';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FuseSharedModule, ML_SharedModule],
    exports: [FuseSharedModule, ML_SharedModule],
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [ClientContactProfileService, MyProfileService],
        };
    }
}