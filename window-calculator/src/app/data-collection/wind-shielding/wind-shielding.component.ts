import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { WindShieldingEnum, WindowDataModel } from '../user-data/window-data-model';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../user-data/user-data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wind-shielding',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink],
  templateUrl: './wind-shielding.component.html',
  styleUrl: './wind-shielding.component.scss'
})
export class WindShieldingComponent {
  faQuestion = faQuestionCircle;
  windShieldingEnum = WindShieldingEnum;
  userData: WindowDataModel;
  currentlyClickedCardIndex = -1;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userData = this.userDataService.getUserWindowData();
  }

  selectOption(value: WindShieldingEnum, index: number) {
    this.currentlyClickedCardIndex = index;
    this.userData.windShielding = value;
    this.userDataService.setUserWindowData(this.userData);
  }

  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }
}
