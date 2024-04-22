import { Component } from '@angular/core';
import { DataCollectionComponent } from "../data-collection/data-collection.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserDataService } from '../data-collection/user-data/user-data.service';
import { FormsModule, NgModel } from '@angular/forms';
import { WindowDataModel } from '../data-collection/user-data/window-data-model';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [DataCollectionComponent, HeaderComponent, FooterComponent, FormsModule, RouterLink, CommonModule]
})
export class HomeComponent {
  homeName: string;
  hover = false;
  buttonClicked: number = 0;

  constructor(private userDataService: UserDataService, private router: Router, private route: ActivatedRoute) {}

  startModel(): void {
    let userData = new WindowDataModel();
    userData.homeName = this.homeName;
    this.userDataService.setUserWindowData(userData);
    this.router.navigate(['/data-collection/1']);
  }
}
