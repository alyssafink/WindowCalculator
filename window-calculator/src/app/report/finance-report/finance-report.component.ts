import { Component } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RetrofitWindowType } from '../retrofit-window';
import { RouterLink } from '@angular/router';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink, FormsModule],
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
  public paybackDates;
  public readonly YEAR_SPAN = 45;

  userInputUpfrontCost_energyStar: number;
  userInputUpfrontCost_storm: number;
  userInputUpfrontCost_film: number;

  ngAfterViewInit() {
    this.createFilmChart();
    this.createStormChart();
    this.createEnergyStarChart();
  }

  createUserInputFilmChart() {
    if (this.userInputUpfrontCost_film) {
      let currentYear = new Date().getFullYear();
      let upfrontCost = this.userInputUpfrontCost_film;
      let endingYear = currentYear + this.YEAR_SPAN;
      let productEndYear = currentYear + this.lifespan[this.retrofitWindowTypes.WINDOW_FILM];
      let data = [];

      for (let i of d3.range(currentYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Savings": -upfrontCost + ((i - currentYear) * this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM]),
        });
      }

      this.paybackDates[this.retrofitWindowTypes.WINDOW_FILM] = currentYear + (upfrontCost / this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM]);

      let filmChart = Plot.plot({
        color: {range: [d3.rgb(4,76,88)]},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(data, {x: "Year", y: "Savings", strokeWidth: 2.5, stroke: (d) => "Your Savings", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
          Plot.ruleX([this.paybackDates[this.retrofitWindowTypes.WINDOW_FILM]], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
          Plot.gridX({strokeOpacity: 0.2}),
          Plot.gridY({strokeOpacity: 0.2}),
          Plot.frame({strokeOpacity: 0.2})
        ],
        x: {domain: [new Date(currentYear,0), new Date(endingYear,0)], label: "Year"},
        y: {label: "Savings ($)"},
      });

      const div = document.querySelector("#filmChart");
      div.innerHTML = '';
      div.append(filmChart);
    } else {
      this.createFilmChart();
    }
  }

  createUserInputStormChart() {
    if (this.userInputUpfrontCost_storm) {
      let currentYear = new Date().getFullYear();
      let upfrontCost = this.userInputUpfrontCost_storm;
      let endingYear = currentYear + this.YEAR_SPAN;
      let productEndYear = currentYear + this.lifespan[this.retrofitWindowTypes.STORM];
      let data = [];

      for (let i of d3.range(currentYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Savings": -upfrontCost + ((i - currentYear) * this.yearlySavings[this.retrofitWindowTypes.STORM]),
        });
      }

      this.paybackDates[this.retrofitWindowTypes.STORM] = currentYear + (upfrontCost / this.yearlySavings[this.retrofitWindowTypes.STORM]);

      let stormChart = Plot.plot({
        color: {range: [d3.rgb(4,76,88)]},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(data, {x: "Year", y: "Savings", strokeWidth: 2.5, stroke: (d) => "Your Savings", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
          Plot.ruleX([this.paybackDates[this.retrofitWindowTypes.STORM]], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
          Plot.gridX({strokeOpacity: 0.2}),
          Plot.gridY({strokeOpacity: 0.2}),
          Plot.frame({strokeOpacity: 0.2})
        ],
        x: {domain: [new Date(currentYear,0), new Date(endingYear,0)], label: "Year"},
        y: {label: "Savings ($)"},
      });

      const div = document.querySelector("#stormChart");
      div.innerHTML = '';
      div.append(stormChart);
    } else {
      this.createStormChart();
    }
  }

  createUserInputESChart() {
    if (this.userInputUpfrontCost_energyStar) {
      let currentYear = new Date().getFullYear();
      let upfrontCost = this.userInputUpfrontCost_energyStar;
      let endingYear = currentYear + this.YEAR_SPAN;
      let productEndYear = currentYear + this.lifespan[this.retrofitWindowTypes.ENERGY_STAR];
      let data = [];

      for (let i of d3.range(currentYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Savings": -upfrontCost + ((i - currentYear) * this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR]),
        });
      }

      this.paybackDates[this.retrofitWindowTypes.ENERGY_STAR] = currentYear + (upfrontCost / this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR]);

      let esChart = Plot.plot({
        color: {range: [d3.rgb(4,76,88)]},
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(data, {x: "Year", y: "Savings", strokeWidth: 2.5, stroke: (d) => "Your Savings", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
          Plot.ruleX([this.paybackDates[this.retrofitWindowTypes.ENERGY_STAR]], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
          Plot.gridX({strokeOpacity: 0.2}),
          Plot.gridY({strokeOpacity: 0.2}),
          Plot.frame({strokeOpacity: 0.2})
        ],
        x: {domain: [new Date(currentYear,0), new Date(endingYear,0)], label: "Year"},
        y: {label: "Savings ($)"},
      });

      const div = document.querySelector("#esChart");
      div.innerHTML = '';
      div.append(esChart);
    } else {
      this.createEnergyStarChart();
    }
  }

  createFilmChart() {
    console.log(this.initialCosts_high, this.initialCosts_low)
    let startingYear = new Date().getFullYear();
    let endingYear = startingYear + this.YEAR_SPAN;
    let productEndYear = startingYear + this.lifespan[this.retrofitWindowTypes.WINDOW_FILM];
    let data = [];

    for (let i of d3.range(startingYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Low": -this.initialCosts_low[this.retrofitWindowTypes.WINDOW_FILM] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM]),
          "High": -this.initialCosts_high[this.retrofitWindowTypes.WINDOW_FILM] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM])
        });
    }

    let paybackLow = new Date(startingYear + (this.initialCosts_low[this.retrofitWindowTypes.WINDOW_FILM] / this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM]),0);
    let paybackHigh = new Date(startingYear + (this.initialCosts_high[this.retrofitWindowTypes.WINDOW_FILM] / this.yearlySavings[this.retrofitWindowTypes.WINDOW_FILM]),0);

    let filmChart = Plot.plot({
      color: {range: [d3.rgb(4,76,88), d3.rgb(244,121,44)]},
      marks: [
        Plot.areaY(data, {x: "Year", y1: "Low", y2: "High", opacity: 0.2}),
        Plot.lineY(data, { x: "Year", y: "Low", strokeWidth: 2.5, stroke: (d) => "Low Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        Plot.lineY(data, {x: "Year", y: "High", strokeWidth: 2.5, stroke: (d) => "High Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        //Plot.ruleX([paybackLow], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
        //Plot.ruleX([paybackHigh], {tip: {format: {x: (d) => `${d.getFullYear()}`}}}),
        Plot.ruleY([0]),
        Plot.gridX({strokeOpacity: 0.2}),
        Plot.gridY({strokeOpacity: 0.2}),
        Plot.frame({strokeOpacity: 0.2})
      ],
      x: {domain: [new Date(startingYear,0), new Date(endingYear,0)], label: "Year"},
      y: {label: "Savings ($)"},
    });

    const div = document.querySelector("#filmChart");
    div.innerHTML = '';
    div.append(filmChart);
  }

  createStormChart() {
    let startingYear = new Date().getFullYear();
    let endingYear = startingYear + this.YEAR_SPAN;
    let productEndYear = startingYear + this.lifespan[this.retrofitWindowTypes.STORM];
    let data = [];

    for (let i of d3.range(startingYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Low": -this.initialCosts_low[this.retrofitWindowTypes.STORM] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.STORM]),
          "High": -this.initialCosts_high[this.retrofitWindowTypes.STORM] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.STORM])
        });
    }

    let paybackLow = new Date(startingYear + (this.initialCosts_low[this.retrofitWindowTypes.STORM] / this.yearlySavings[this.retrofitWindowTypes.STORM]),0);
    let paybackHigh = new Date(startingYear + (this.initialCosts_high[this.retrofitWindowTypes.STORM] / this.yearlySavings[this.retrofitWindowTypes.STORM]),0);

    let stormChart = Plot.plot({
      color: {range: [d3.rgb(4,76,88), d3.rgb(244,121,44)]},
      marks: [
        Plot.areaY(data, {x: "Year", y1: "Low", y2: "High", opacity: 0.2}),
        Plot.lineY(data, { x: "Year", y: "Low", strokeWidth: 2.5, stroke: (d) => "Low Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        Plot.lineY(data, {x: "Year", y: "High", strokeWidth: 2.5, stroke: (d) => "High Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        //Plot.ruleX([paybackLow], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
        //Plot.ruleX([paybackHigh], {tip: {format: {x: (d) => `${d.getFullYear()}`}}}),
        Plot.ruleY([0]),
        Plot.gridX({strokeOpacity: 0.2}),
        Plot.gridY({strokeOpacity: 0.2}),
        Plot.frame({strokeOpacity: 0.2})
      ],
      x: {domain: [new Date(startingYear,0), new Date(endingYear,0)], label: "Year"},
      y: {label: "Savings ($)"},
    });

    const div = document.querySelector("#stormChart");
    div.innerHTML = '';
    div.append(stormChart);
  }

  createEnergyStarChart() {
    let startingYear = new Date().getFullYear();
    let endingYear = startingYear + this.YEAR_SPAN;
    let productEndYear = startingYear + this.lifespan[this.retrofitWindowTypes.ENERGY_STAR];
    let data = [];

    for (let i of d3.range(startingYear, productEndYear + 1)) {
        data.push({
          "Year": new Date(i, 0),
          "Low": -this.initialCosts_low[this.retrofitWindowTypes.ENERGY_STAR] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR]),
          "High": -this.initialCosts_high[this.retrofitWindowTypes.ENERGY_STAR] + ((i - startingYear) * this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR])
        });
    }

    let paybackLow = new Date(startingYear + (this.initialCosts_low[this.retrofitWindowTypes.ENERGY_STAR] / this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR]),0);
    let paybackHigh = new Date(startingYear + (this.initialCosts_high[this.retrofitWindowTypes.ENERGY_STAR] / this.yearlySavings[this.retrofitWindowTypes.ENERGY_STAR]),0);

    let esChart = Plot.plot({
      color: {range: [d3.rgb(4,76,88), d3.rgb(244,121,44)]},
      marks: [
        Plot.areaY(data, {x: "Year", y1: "Low", y2: "High", opacity: 0.2}),
        Plot.lineY(data, { x: "Year", y: "Low", strokeWidth: 2.5, stroke: (d) => "Low Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        Plot.lineY(data, {x: "Year", y: "High", strokeWidth: 2.5, stroke: (d) => "High Initial Cost", tip: { format: {x: (d) => `${d.getFullYear()}`, stroke: false, z: false}}}),
        //Plot.ruleX([paybackLow], {tip:{format: {x: (d) => `${d.getFullYear()}`}}, stroke:'red'}),
        //Plot.ruleX([paybackHigh], {tip: {format: {x: (d) => `${d.getFullYear()}`}}}),
        Plot.ruleY([0]),
        Plot.gridX({strokeOpacity: 0.2}),
        Plot.gridY({strokeOpacity: 0.2}),
        Plot.frame({strokeOpacity: 0.2})
      ],
      x: {domain: [new Date(startingYear,0), new Date(endingYear,0)], label: "Year"},
      y: {label: "Savings ($)"},
    });

    const div = document.querySelector("#esChart");
    div.innerHTML = '';
    div.append(esChart);
  }
}
