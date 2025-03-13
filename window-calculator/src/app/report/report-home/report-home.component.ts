import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-report-home',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './report-home.component.html',
  styleUrl: './report-home.component.scss'
})
export class ReportHomeComponent {
  faArrow: IconDefinition = faArrowRight;
}
