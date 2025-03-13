import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserDataService } from './user-data/user-data.service';
import { WindowDataModel } from './user-data/window-data-model';
import { CardHeaderComponent } from "../card-header/card-header.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-data-collection',
    standalone: true,
    templateUrl: './data-collection.component.html',
    styleUrl: './data-collection.component.scss',
    imports: [RouterOutlet, CardHeaderComponent, CommonModule, RouterLink, HeaderComponent, FooterComponent]
})
export class DataCollectionComponent {

  constructor(private userDataService: UserDataService) {}
}

