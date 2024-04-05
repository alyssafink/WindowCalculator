import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sound-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule],
  templateUrl: './sound-report.component.html',
  styleUrl: './sound-report.component.scss'
})
export class SoundReportComponent {
  faQuestion = faQuestionCircle;
}
