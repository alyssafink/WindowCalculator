import { Component } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RetrofitWindowType } from '../retrofit-window';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink],
  templateUrl: './finance-report.component.html',
  styleUrl: './finance-report.component.scss'
})
export class FinanceReportComponent {
  faQuestion = faQuestionCircle;
  retrofitWindowTypes = RetrofitWindowType;
  public initialCosts_low;
  public initialCosts_high;
  public lifespan;
  public yearlySavings;
  public lifetimeSavings;
}
