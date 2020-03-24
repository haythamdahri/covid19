import { Component } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AboutAuthorComponent} from './about-author/about-author.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid19-dashboard';

  constructor(private bottomSheet: MatBottomSheet) {}

  openBottomSheet(): void {
    this.bottomSheet.open(AboutAuthorComponent);
  }
}
