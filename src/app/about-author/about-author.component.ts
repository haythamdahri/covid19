import { Component, OnInit } from '@angular/core';
import { TrafficService } from '../shared/traffic.service';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.css']
})
export class AboutAuthorComponent implements OnInit {

  now = new Date();

  constructor(private trafficService: TrafficService) { }

  ngOnInit(): void {
    // Increment views
    this.trafficService.incrementViews();
  }

}
