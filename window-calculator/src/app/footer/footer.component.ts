import { Component } from '@angular/core';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ShareButtonsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
