import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comfort-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, RouterLink],
  templateUrl: './comfort-report.component.html',
  styleUrl: './comfort-report.component.scss'
})
export class ComfortReportComponent {
  faQuestion = faQuestionCircle;
}