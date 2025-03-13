import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RetrofitWindowType } from '../retrofit-window';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comfort-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, RouterLink, CommonModule],
  templateUrl: './comfort-report.component.html',
  styleUrl: './comfort-report.component.scss'
})
export class ComfortReportComponent {
  faQuestion = faQuestionCircle;
  windowType = RetrofitWindowType;

  public coolingSetPoint;
  public existingTempIncrease;
  public upgradeTempIncreases;
  public readonly NEW_HOME_INCR = 1.3;
}
