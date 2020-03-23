import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../shared/statistics.service';
import StatisticsModel from '../models/statistics.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Title} from '@angular/platform-browser';
import {getCode, getName} from 'country-list';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css']
})
export class CountryDetailsComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'active', 'critical', 'timestamp'];
  data: StatisticsModel[] = [];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  statisticsSubscription: Subscription;
  routeSubsription: Subscription;
  isLoading = true;
  isError = false;

  constructor(private statisticsService: StatisticsService, private route: ActivatedRoute, private titleService: Title,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // Set component title
    this.titleService.setTitle('COVID19');
    // Check country code
    this.routeSubsription = this.route.params.subscribe(
      (params: Params) => {
        const countryCode = params.code;
        // Retrieve data from service
        this.statisticsSubscription = this.statisticsService.getData(countryCode).subscribe(
          (data) => {
            // Check if data is not null
            if (data !== null && data !== 'null') {
              this.titleService.setTitle(`COVID19 - ${getName(countryCode)}`);
              this.data = data.snapshots.reverse();
              this.dataSource = new MatTableDataSource<StatisticsModel>(this.data);
              // Paginator
              this.dataSource.paginator = this.paginator;
            } else {
              this.isError = true;
              this.snackBar.open('No country found', 'Undo', {
                duration: 2000,
              });
            }
          },
          (error) => {
            this.snackBar.open('No country found', 'Undo', {
              duration: 2000,
            });
            this.isError = true;
          },
          () => {
            // Disable loading
            this.isLoading = false;
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    // Desroy subscription
    if (this.statisticsSubscription != null) {
      this.statisticsSubscription.unsubscribe();
    }
    if (this.routeSubsription != null) {
      this.routeSubsription.unsubscribe();
    }
  }


  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
