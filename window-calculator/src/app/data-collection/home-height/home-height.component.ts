import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeHeightEnum, WindowDataModel } from '../user-data/window-data-model';
import { UserDataService } from '../user-data/user-data.service';
import { toArray } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-height',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink],
  templateUrl: './home-height.component.html',
  styleUrl: './home-height.component.scss'
})
export class HomeHeightComponent {
  faQuestion = faQuestionCircle;
  homeHeightEnum = HomeHeightEnum;
  isNotNumber = isNaN;
  userData: WindowDataModel;
  public currentlyClickedCardIndex: number = -1;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userData = this.userDataService.getUserWindowData();
  }

  selectOption(height: number) {
    this.currentlyClickedCardIndex = height;
    this.userData.homeHeight = Number(height);
    this.userDataService.setUserWindowData(this.userData);
  }

  public checkIfCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedCardIndex;
  }
}