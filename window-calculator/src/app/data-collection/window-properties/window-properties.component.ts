import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faQuestionCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FrameTypeEnum, GlassTypeEnum, OperabilityTypeEnum, OrientationTypeEnum, WindowPropertiesModel } from '../user-data/window-properties-model';
import { RetrofitWindowType } from '../../report/retrofit-window';
import { WindowDataModel } from '../user-data/window-data-model';
import { UserDataService } from '../user-data/user-data.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-window-properties',
  standalone: true,
  imports: [FontAwesomeModule, NgbTooltipModule, CommonModule, FormsModule,  RouterLink],
  templateUrl: './window-properties.component.html',
  styleUrl: './window-properties.component.scss'
})
export class WindowPropertiesComponent {
// Will be a collection of "settings"
  faQuestion = faQuestionCircle;
  faEdit = faPenToSquare;
  faDelete = faTrash;
  view = "";
  glassTypeEnum = GlassTypeEnum;
  frameTypeEnum = FrameTypeEnum;
  windowTypeEnum = OperabilityTypeEnum;
  orientationList_Simp = ["Evenly Distributed", "North", "East", "South", "West"];
  orientationList_Det = ["North", "East", "South", "West", "Evenly Distributed"];

  editing: number = -1;
  hover = false;

  windows: WindowPropertiesModel[];
  simpleWindow: WindowPropertiesModel;
  userData: WindowDataModel;
  currentlyClickedGlassCardIndex = -1;
  currentlyClickedFrameCardIndex = -1;
  currentlyClickedOperabilityCardIndex = -1;
  currentlyClickedOrientationCardIndex = -1;

  windowHeight: number;
  windowWidth: number;
  windowName: string = "";

  newWindow: WindowPropertiesModel;

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.userData = this.userDataService.getUserWindowData();
    this.newWindow = new WindowPropertiesModel();
    this.simpleWindow = new WindowPropertiesModel();
    this.simpleWindow.area = 247; // Set default value
    this.simpleWindow.perimeter = 256; // Set default value
    this.simpleWindow.simplified = true;

    this.windows = [];
  }

  calculateSize() {
    let heightFt = this.windowHeight / 12;
    let widthFt = this.windowWidth / 12;

    this.newWindow.width = this.windowWidth;
    this.newWindow.height = this.windowHeight;
    this.newWindow.area = heightFt * widthFt;
    this.newWindow.perimeter = heightFt + heightFt + widthFt + widthFt;
    console.log(this.newWindow.area, this.newWindow.perimeter);
  }

  editWindow(index: number) {
    // Open modal with window values selected
    this.editing = index;

    let w = this.windows[index];
    this.windowName = w.name;
    this.windowHeight = w.height;
    this.windowWidth = w.width;
    this.currentlyClickedFrameCardIndex = Object.values(FrameTypeEnum).sort().indexOf(w.frame);
    this.currentlyClickedGlassCardIndex = Object.values(GlassTypeEnum).sort().indexOf(w.glass);
    this.currentlyClickedOperabilityCardIndex = Object.values(OperabilityTypeEnum).sort().indexOf(w.operability);
    this.currentlyClickedOrientationCardIndex = this.orientationList_Det.indexOf(w.orientation);
  }

  deleteWindow(index: number) {
    this.windows.splice(index, 1);
  }

  addWindow() {
    this.newWindow = new WindowPropertiesModel();
    this.editing = -1;
  }

  saveWindow() {
    this.newWindow.name = this.windowName;
    this.newWindow.height = this.windowHeight;
    this.newWindow.width = this.windowWidth;
    console.log(this.newWindow);

    if (this.editing == -1) {
      this.windows.push(this.newWindow);
    } else {
      this.windows[this.editing] = this.newWindow;
      this.editing = -1;
    }

    this.currentlyClickedFrameCardIndex = -1;
    this.currentlyClickedGlassCardIndex = -1;
    this.currentlyClickedOperabilityCardIndex = -1;
    this.currentlyClickedOrientationCardIndex = -1;
    this.windowName = "";
    this.windowWidth = undefined;
    this.windowHeight = undefined;
  }

  submitData() {
    if (this.view == "Detailed") {
      this.userData.windowProperties = this.windows;
      this.userDataService.setUserWindowData(this.userData);
    }
  }

  selectSimplifiedGlassOption(value: GlassTypeEnum, index: number) {
    this.currentlyClickedGlassCardIndex = index;
    this.simpleWindow.glass = value;
    this.userData.windowProperties = [ this.simpleWindow ];
    this.userDataService.setUserWindowData(this.userData);
  }

  selectSimplifiedFrameOption(value: FrameTypeEnum, index: number) {
    this.currentlyClickedFrameCardIndex = index;
    this.simpleWindow.frame = value;
    this.userData.windowProperties = [ this.simpleWindow ];
    this.userDataService.setUserWindowData(this.userData);
  }

  selectSimplifiedOperabilityOption(value: OperabilityTypeEnum, index: number) {
    this.currentlyClickedOperabilityCardIndex = index;
    this.simpleWindow.operability = value;
    this.userData.windowProperties = [ this.simpleWindow ];
    this.userDataService.setUserWindowData(this.userData);
  }

  selectSimplifiedOrientationOption(value: string, index: number) {
    this.currentlyClickedOrientationCardIndex = index;
    this.simpleWindow.orientation = value as OrientationTypeEnum;
    this.userData.windowProperties = [ this.simpleWindow ];
    this.userDataService.setUserWindowData(this.userData);
  }

  selectDetailedGlassOption(value: GlassTypeEnum, index: number) {
    this.currentlyClickedGlassCardIndex = index;
    this.newWindow.glass = value;
  }

  selectDetailedFrameOption(value: FrameTypeEnum, index: number) {
    this.currentlyClickedFrameCardIndex = index;
    this.newWindow.frame = value;
  }

  selectDetailedOperabilityOption(value: OperabilityTypeEnum, index: number) {
    this.currentlyClickedOperabilityCardIndex = index;
    this.newWindow.operability = value;
  }

  selectDetailedOrientationOption(value: string, index: number) {
    this.currentlyClickedOrientationCardIndex = index;
    console.log(value, OrientationTypeEnum[value])
    this.newWindow.orientation = value as OrientationTypeEnum;
  }

  public checkIfOperabilityCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedOperabilityCardIndex;
  }

  public checkIfGlassCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedGlassCardIndex;
  }

  public checkIfFrameCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedFrameCardIndex;
  }

  public checkIfOrientationCardIsClicked(cardIndex: number): boolean {
    return cardIndex === this.currentlyClickedOrientationCardIndex;
  }

  selectSimplifiedView() {
    this.view = "Simplified";
  }

  selectDetailedView() {
    this.view = "Detailed";
  }
}
