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
import { DataService } from '../services/data.service';


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
  public lifetimeCarbonSavings;
  public lifetimeCarbonImpact;
  public numTrees = {};
  public treePic = {};
  loaded = true;

  public esLifespan;

  userInputFrameMaterial = this.newFrameMaterial.METAL;

  constructor(private userDataService: UserDataService, private dataService: DataService, private calculationService: CalculationService) {}

  recalculateEmbodiedCarbon() {
    let userData = this.userDataService.getUserWindowData();
    this.calculateProductLifespan(this.userInputFrameMaterial, RetrofitWindowType.ENERGY_STAR);
    this.calculateUpfrontCarbonImpact(userData, RetrofitWindowType.ENERGY_STAR);
    this.calculateLifetimeEnergySavings(userData, RetrofitWindowType.ENERGY_STAR);
    this.calculateLifetimeEnergyImpact(RetrofitWindowType.ENERGY_STAR);
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

  calculateUpfrontCarbonImpact(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let frameGWP = this.calculateFrameGWP(homeData.windowProperties, retrofitWindowType);
    let glazeGWP = this.calculationService.calculateGlazeGWP(homeData.windowProperties, retrofitWindowType);
    this.embodiedCarbon[retrofitWindowType] = frameGWP + glazeGWP;
  }

  calculateFrameGWP(windowData: WindowPropertiesModel[], retrofitWindowType: RetrofitWindowType) {
    let Mf = this.dataService.getRetrofitFrameGWP(this.userInputFrameMaterial, retrofitWindowType);
    let Pt = 0;
    for (let window of windowData) {
      Pt += window.perimeter;
    }

    return Mf * Pt;
  }

  calculateLifetimeEnergySavings(homeData: WindowDataModel, retrofitWindowType: RetrofitWindowType) {
    let heatingSavings = this.calculationService.calculateLifetimeOperationalHeatingSavings_noLifespan(homeData.heatingSystem, retrofitWindowType) * this.esLifespan;
    let coolingSavings = this.calculationService.calculateLifetimeOperationalCoolingSavings_noLifespan(homeData.coolingSystem, retrofitWindowType) * this.esLifespan;
    this.lifetimeCarbonSavings[retrofitWindowType] = heatingSavings + coolingSavings;
  }

  calculateLifetimeEnergyImpact(retrofitWindowType: RetrofitWindowType) {
    this.lifetimeCarbonImpact[retrofitWindowType] = this.lifetimeCarbonSavings[retrofitWindowType] - this.embodiedCarbon[retrofitWindowType];
  }

  calculateLifetimeTreeImpact(retrofitWindowType: RetrofitWindowType) {
    const EPA_TREE_FACTOR = 60;
    this.numTrees[retrofitWindowType] = this.lifetimeCarbonImpact[retrofitWindowType] / EPA_TREE_FACTOR;
  }

  calculateProductLifespan(frame: NewFrameType, retrofitWindowType: RetrofitWindowType) {
    this.esLifespan = this.dataService.getProductLifespan(frame, retrofitWindowType)
  }
}
