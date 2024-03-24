import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';
import { DataCollectionComponent } from './data-collection/data-collection.component';
import { HomeHeightComponent } from './data-collection/home-height/home-height.component';
import { WindShieldingComponent } from './data-collection/wind-shielding/wind-shielding.component';
import { HvacSystemsComponent } from './data-collection/hvac-systems/hvac-systems.component';
import { ThermostatSystemsComponent } from './data-collection/thermostat-systems/thermostat-systems.component';
import { WindowPropertiesComponent } from './data-collection/window-properties/window-properties.component';

export const routes: Routes = [
    {
      path: 'report',
      component: ReportComponent
    },
    {
      path: 'data-collection',
      component: DataCollectionComponent,
      children: [
        { path: '0', redirectTo: '/data-collection', pathMatch: 'full' },
        { path: '1', component: HomeHeightComponent },
        { path: '2', component: WindShieldingComponent },
        { path: '3', component: HvacSystemsComponent },
        { path: '4', component: ThermostatSystemsComponent },
        { path: '5', component: WindowPropertiesComponent }
      ]
    },
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
];
