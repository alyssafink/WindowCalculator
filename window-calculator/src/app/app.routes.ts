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
import { FinanceReportComponent } from './report/finance-report/finance-report.component';
import { EnvironmentReportComponent } from './report/environment-report/environment-report.component';
import { ComfortReportComponent } from './report/comfort-report/comfort-report.component';
import { SoundReportComponent } from './report/sound-report/sound-report.component';
import { LowEInfoComponent } from './info/low-e-info/low-e-info.component';
import { StormInfoComponent } from './info/storm-info/storm-info.component';
import { EnergyStarInfoComponent } from './info/energy-star-info/energy-star-info.component';
import { InfoComponent } from './info/info.component';
import { ReportHomeComponent } from './report/report-home/report-home.component';

export const routes: Routes = [
    {
      path: 'report',
      component: ReportComponent,
      children: [
        { path: '', component:  ReportHomeComponent },
        { path: 'finance', component: FinanceReportComponent },
        { path: 'environment', component: EnvironmentReportComponent },
        { path: 'thermal', component: ComfortReportComponent },
        { path: 'sound', component: SoundReportComponent }
      ]
    },
    {
      path: 'info',
      component: InfoComponent,
      children: [
        { path: 'film', component: LowEInfoComponent },
        { path: 'storm', component: StormInfoComponent },
        { path: 'energy-star', component: EnergyStarInfoComponent },
      ]
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
