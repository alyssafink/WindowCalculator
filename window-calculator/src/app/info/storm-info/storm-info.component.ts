import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-storm-info',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './storm-info.component.html',
  styleUrl: './storm-info.component.scss'
})
export class StormInfoComponent {
  showAnswer: boolean = false;
}
