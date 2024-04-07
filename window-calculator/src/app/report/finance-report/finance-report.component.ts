import { Component } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RetrofitWindowType } from '../retrofit-window';
import { RouterLink } from '@angular/router';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

@Component({
  selector: 'app-finance-report',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, RouterLink],
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

  ngAfterViewInit() {
    this.createFilmChart();
    this.createStormChart();
    this.createEnergyStarChart();
  }

  createFilmChart() {
    this.initialCosts_high[this.retrofitWindowTypes.WINDOW_FILM] = 1000;
    this.initialCosts_low[this.retrofitWindowTypes.WINDOW_FILM] = 100;
    this.paybackDates[this.retrofitWindowTypes.WINDOW_FILM] = 2030;
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

    console.log(data)
    let payback = new Date(this.paybackDates[this.retrofitWindowTypes.WINDOW_FILM],0);
    let filmChart = Plot.plot({
      color: {legend: true},
      marks: [
        Plot.ruleY([0]),
        Plot.ruleX([new Date(startingYear,0)]),
        Plot.lineY(data, {x: "Year", y: "Low", stroke: (d) => "Low", tip: { format: {x: (d) => `${d.getFullYear()}`,}}}),
        Plot.lineY(data, {x: "Year", y: "High", stroke: (d) => "High", tip: { format: {x: (d) => `${d.getFullYear()}`,}}}),
        Plot.ruleX([payback]),
        Plot.areaY(data, {x: "Year", y1: "Low", y2: "High", opacity: 0.2}),
      ],
      x: {domain: [new Date(startingYear,0), new Date(endingYear,0)], grid: true, label: "Year"},
      y: {label: "Savings ($)"}
    });

    const div = document.querySelector("#filmChart");
    div.append(filmChart);
  }

  createStormChart() {

  }

  createEnergyStarChart() {

  }
}
