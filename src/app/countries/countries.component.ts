import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Title } from "@angular/platform-browser";
import { CountriesService } from "../shared/countries.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TrafficService } from '../shared/traffic.service';

@Component({
  selector: "app-home",
  templateUrl: "./countries.component.html",
  styleUrls: ["./countries.component.css"],
})
export class CountriesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "alpha2Code",
    "name",
    "region",
    "subregion",
    "nativeName",
    "flag",
  ];
  data: Array<any> = new Array<any>();
  private statisticsSubscription: Subscription;
  private routeSubscription: Subscription;
  regionName: string = null;
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private countriesSubscription: Subscription;
  isLoading = true;
  isError = false;

  constructor(
    private countriesService: CountriesService,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private trafficService: TrafficService
  ) {}

  ngOnInit(): void {
    // Increment views
    this.trafficService.incrementViews();
    // Set component title
    this.titleService.setTitle(`COVID19 - Countries`);
    // Subscribe to route
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        const region = params.region;
        this.regionName = region;
        // Retrieve countries list
        this.countriesSubscription = this.countriesService
          .getCountries(region)
          .subscribe(
            (data) => {
              // Check if data exists
              if( data != null && data.length != 0 ) {
                this.data = data;
                this.dataSource = new MatTableDataSource<any>(this.data);
                // Paginator
                this.dataSource.paginator = this.paginator;
                // Sort
                this.dataSource.sort = this.sort;
              } else {
                this.snackBar.open("No countries found", "Undo", {
                  duration: 6000,
                });
                this.isError = true;
              }
            },
            (error) => {
              this.snackBar.open("An error occurred", "Undo", {
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
    );
  }

  ngOnDestroy(): void {
    // Desroy subscription
    if (this.statisticsSubscription != null) {
      this.statisticsSubscription.unsubscribe();
    }
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
    this.regionName = null;
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCountryDetails(alpha2Code) {
    this.router.navigateByUrl('/countries/' + alpha2Code);
  }
}
