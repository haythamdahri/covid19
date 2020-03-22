import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../shared/statistics.service';
import Statistics from '../models/statistics.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Title} from '@angular/platform-browser';
import { getCode, getName } from 'country-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'active', 'critical', 'timestamp'];
  data: Statistics[] = [];
  dataSource;
  private statisticsSubscription: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private statisticsService: StatisticsService, private titleService: Title) {
  }

  ngOnInit(): void {
    // Set component title
    this.titleService.setTitle(`COVID19 - ${getName('MA')}`);
    // Retrieve data from service
    this.statisticsSubscription = this.statisticsService.getData().subscribe(
      (data) => {
        this.data = data.snapshots.reverse();
        this.dataSource = new MatTableDataSource<Statistics>(this.data);
        // Paginator
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        alert(error);
      }
    );
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
