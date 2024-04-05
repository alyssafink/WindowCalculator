import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { RetrofitWindowType } from '../retrofit-window';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-environment-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule],
  templateUrl: './environment-report.component.html',
  styleUrl: './environment-report.component.scss'
})
export class EnvironmentReportComponent {
  faQuestion = faQuestionCircle;
  retrofitWindowTypes = RetrofitWindowType;
  public embodiedCarbon;
  public annualCarbonSavings;
  public lifetimeCarbonImpact;
  public numTrees = {};
  public treePic = {};
  loaded = true;
}
