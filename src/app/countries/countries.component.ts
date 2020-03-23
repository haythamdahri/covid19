import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../shared/statistics.service';
import Statistics from '../models/statistics.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Title} from '@angular/platform-browser';
import {getName, getCodes} from 'country-list';
import {CountriesService} from '../shared/countries.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['alpha2Code', 'name', 'region', 'subregion', 'nativeName', 'flag'];
  data: Array<any> = new Array<any>();
  private statisticsSubscription: Subscription;
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  private countriesSubscription: Subscription;
  isLoading = true;
  isError = false;

  constructor(private countriesService: CountriesService, private titleService: Title, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // Set component title
    this.titleService.setTitle(`Home - Countries`);
    // Retrieve countries list
    this.countriesSubscription = this.countriesService.getCountries().subscribe(
      (data) => {
        console.log(data);
        this.data = data;
        this.dataSource = new MatTableDataSource<any>(this.data);
        // Paginator
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.snackBar.open('An error occurred', 'Undo', {
          duration: 6000,
        });
        this.isError = true;
      },
      () => {
        // Disable loading
        this.isLoading = false;
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
