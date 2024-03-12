import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
    {path: 'report', component: ReportComponent},
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
];
