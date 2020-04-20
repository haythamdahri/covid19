import { Component, OnInit } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AboutAuthorComponent} from './about-author/about-author.component';
import { TrafficService } from './shared/traffic.service';
import { Observable } from 'rxjs';
import { Traffic } from './models/traffic.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'covid19-dashboard';
  traffic: Observable<Traffic>;

  constructor(private bottomSheet: MatBottomSheet, public trafficService: TrafficService) {}

  ngOnInit() {
    this.traffic = this.trafficService.getViews();
  }

  openBottomSheet(): void {
    this.bottomSheet.open(AboutAuthorComponent);
  }
}
