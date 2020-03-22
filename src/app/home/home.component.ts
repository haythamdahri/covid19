import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../shared/statistics.service';
import Statistics from '../models/statistics.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Title} from '@angular/platform-browser';
import {getName, getCodes} from 'country-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['code', 'name'];
  data: Array<any> = new Array<any>();
  private statisticsSubscription: Subscription;
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private statisticsService: StatisticsService, private titleService: Title) {
  }

  ngOnInit(): void {
    // Set component title
    this.titleService.setTitle(`Home - Countries`);
    // Retrieve countries list
    getCodes().forEach(code => {
      this.data = [...this.data, {code: code, name: getName(code)}];
    });
    this.dataSource = new MatTableDataSource<{ code: string, name: string }>(this.data);
    // Paginator
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(): void {
    // Desroy subscription
    if (this.statisticsSubscription != null) {
      this.statisticsSubscription.unsubscribe();
    }
  }


  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
