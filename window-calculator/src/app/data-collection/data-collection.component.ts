import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from './user-data/user-data.service';
import { WindowDataModel } from './user-data/window-data-model';
import { CardHeaderComponent } from "../card-header/card-header.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-data-collection',
    standalone: true,
    templateUrl: './data-collection.component.html',
    styleUrl: './data-collection.component.scss',
    imports: [RouterOutlet, CardHeaderComponent, CommonModule, RouterLink]
})
export class DataCollectionComponent {
// two-way bind variables from child components to pass to report
// pass through vars to report component through router link
  currentStage: number;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.currentStage = 0;
  }

  incrementStage() {
    this.currentStage++;
  }

  decrementStage() {
    this.currentStage--;
  }
}

// use breadcrumbs with icons maybe to display progress bar
