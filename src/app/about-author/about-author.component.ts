import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.css']
})
export class AboutAuthorComponent implements OnInit {

  now = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
