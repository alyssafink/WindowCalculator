import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { NewFrameType, RetrofitWindowType } from '../retrofit-window';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CalculationService } from '../services/calculation.service';
import { UserDataService } from '../../data-collection/user-data/user-data.service';
import { WindowDataModel } from '../../data-collection/user-data/window-data-model';
import { WindowPropertiesModel } from '../../data-collection/user-data/window-properties-model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-environment-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './environment-report.component.html',
  styleUrl: './environment-report.component.scss'
})
export class EnvironmentReportComponent {
  faQuestion = faQuestionCircle;
  retrofitWindowTypes = RetrofitWindowType;
  newFrameMaterial = NewFrameType;
  public embodiedCarbon;
  public annualCarbonSavings;
  public lifetimeCarbonImpact;
  public numTrees = {};
  public treePic = {};
  loaded = true;

  userInputFrameMaterial = this.newFrameMaterial.METAL;

  constructor(private userDataService: UserDataService, private calculationService: CalculationService) {}

  recalculateEmbodiedCarbon() {
    let userData = this.userDataService.getUserWindowData();
    this.calculateUpfrontCarbonImpact(userData)
    this.recalculateTrees();
  }

  recalculateTrees() {
    this.calculateLifetimeTreeImpact(RetrofitWindowType.ENERGY_STAR);
    let key = RetrofitWindowType.ENERGY_STAR;
    this.numTrees[RetrofitWindowType.ENERGY_STAR] = Math.round(this.numTrees[RetrofitWindowType.ENERGY_STAR]);
    this.treePic[key] = Math.round(this.numTrees[key] / 100);
    this.treePic[key] = this.treePic[key] > 10 ? 10 : this.treePic[key]; // 10 is upper bound for pics
    this.treePic[key] = this.treePic[key] < 1 ? 1 : this.treePic[key]; // 1 is lower bound for pics
  }

  calculateLifetimeTreeImpact(retrofitWindowType: RetrofitWindowType) {
    const EPA_TREE_FACTOR = 60;
    this.numTrees[retrofitWindowType] = this.lifetimeCarbonImpact[retrofitWindowType] / EPA_TREE_FACTOR;
  }

  calculateUpfrontCarbonImpact(homeData: WindowDataModel) {
    let frameGWP = this.calculateFrameGWP(homeData.windowProperties, RetrofitWindowType.ENERGY_STAR);
    let glazeGWP = this.calculateGlazeGWP(homeData.windowProperties, RetrofitWindowType.ENERGY_STAR);
    this.embodiedCarbon[RetrofitWindowType.ENERGY_STAR] = frameGWP + glazeGWP;
    this.lifetimeCarbonImpact[RetrofitWindowType.ENERGY_STAR] = this.annualCarbonSavings[RetrofitWindowType.ENERGY_STAR] - this.embodiedCarbon[RetrofitWindowType.ENERGY_STAR];
  }

  calculateFrameGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mf = this.calculationService.getRetrofitFrameGWP(this.userInputFrameMaterial, retrofitWindowType);
    let Pt = 0;
    for (let window of windowData) {
      Pt += window.perimeter;
    }

    return Mf * Pt;
  }

  calculateGlazeGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mg = this.calculationService.getRetrofitGlazeGWP(retrofitWindowType);
    let At = 0;
    for (let window of windowData) {
      At += window.area;
    }

    return Mg * At;
  }
}
