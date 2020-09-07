import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthGuard } from "./guards/auth-guard";
import { AuthService } from "./services/ml-auth/ml-auth.service";
import { FuseSharedModule } from '@fuse/shared.module';
import { ML_SharedModule } from 'ml-shared/ml-shared.module';

@NgModule({

    imports: [CommonModule, ReactiveFormsModule, FuseSharedModule, ML_SharedModule],
    exports: [FuseSharedModule, ML_SharedModule]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [AuthService, AuthGuard]
        };
    }
}
