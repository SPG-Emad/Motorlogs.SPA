import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// if we want to switch to prod mode then we have to change the environment path to environmnet.prod.ts
import { environment } from './environments/environment';
import { hmrBootstrap } from 'hmr';
import { LicenseManager } from "@ag-grid-enterprise/core";


LicenseManager.setLicenseKey("CompanyName=Lennock Motors,LicensedApplication=Motorlogs,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-007418,ExpiryDate=19_March_2021_[v2]_MTYxNjExMjAwMDAwMA==acb550ff06660236f5dfab2f4be98c1a");

if ( environment.production )
{
    enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if ( environment.hmr )
{
    if ( module['hot'] )
    {
        hmrBootstrap(module, bootstrap);
    }
    else
    {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
    }
}
else
{
    bootstrap().catch(err => console.error(err));
}