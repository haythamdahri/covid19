import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { StatisticsService } from "../shared/statistics.service";
import StatisticsModel from "../models/statistics.model";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Params } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { getName } from "country-list";
import { CountriesService } from "../shared/countries.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { checkDateDifference, compareDate } from "../shared/global.functions";

@Component({
  selector: "app-country-details",
  templateUrl: "./country-details.component.html",
  styleUrls: ["./country-details.component.css"],
})
export class CountryDetailsComponent implements OnInit, OnDestroy {
  country: any = null;
  dateForm: FormGroup;

  displayedColumns: string[] = [
    "cases",
    "todayCases",
    "deaths",
    "todayDeaths",
    "recovered",
    "active",
    "critical",
    "timestamp",
  ];
  dataSource: MatTableDataSource<StatisticsModel>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  statisticsSubscription: Subscription;
  routeSubsription: Subscription;
  isLoading = true;
  isError = false;

  public lineChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: false,
        },
      }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public lineChartLabels: Label[] = [];
  public lineChartType: ChartType = "line";
  public polarAreaChartType: ChartType = "polarArea";
  public lineChartLegend = true;
  public lineChartPlugins = [pluginDataLabels];
  public lineChartColors: Color[] = [
    {
      // dark grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];

  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: "Number of cases",
      fill: false,
    },
    {
      data: [],
      label: "Recovered people",
      fill: false,
    },
    {
      data: [],
      label: "Number of deaths",
      fill: false,
    },
    {
      data: [],
      label: "Critical cases",
      fill: false,
    },
  ];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "top",
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [
    ["Number Of", "Cases"],
    ["Recovered", "People"],
    ["Number Of", "Deaths"],
    ["Critical", "Cases"],
  ];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        "rgb(54, 162, 235)",
        "rgb(51, 255, 67)",
        "#fece56",
        "#ff6c59",
      ],
    },
  ];

  constructor(
    private statisticsService: StatisticsService,
    private route: ActivatedRoute,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private countriesService: CountriesService
  ) {}

  ngOnInit(): void {
    // Set component title
    this.titleService.setTitle("COVID19");
    // Date form
    this.dateForm = new FormGroup(
      {
        startPicker: new FormControl(new Date().toString(), [
          Validators.required,
        ]),
        endPicker: new FormControl(new Date().toString(), [
          Validators.required,
        ]),
      },
      { validators: checkDateDifference }
    );
    // Check country code
    this.routeSubsription = this.route.params.subscribe((params: Params) => {
      const countryCode = params.code;
      // Retrieve country info
      this.fetchCountryData(countryCode);
      // Retrieve data from service
      this.fetchData(countryCode);
    });
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

  fetchCountryData(alpha2Code: string) {
    this.countriesService
      .getCountry(alpha2Code)
      .toPromise()
      .then((countries) => {
        this.country = countries[0];
      });
  }

  fetchData(countryCode: string, startDate: Date = null, endDate: Date = null) {
    // Init data
    this.initializeData();
    // Fetch data
    this.statisticsSubscription = this.statisticsService
      .getData(countryCode, startDate, endDate)
      .subscribe(
        (data) => {
          // Check if data is not null
          if (data != null) {
            this.titleService.setTitle(`COVID19 - ${getName(countryCode)}`);
            // Change datasource if no date range is required
            if (startDate == null && endDate == null) {
              this.dataSource = new MatTableDataSource<StatisticsModel>(
                data.snapshots
              );
              // Paginator
              this.dataSource.paginator = this.paginator;
              // Sort
              this.dataSource.sort = this.sort;
            }
            // Push data into chart from first day until now
            data.snapshots.reverse()
              .forEach((row) => {
                // Number of cases
                this.lineChartData[0]["data"].push(row.cases);
                // Recovered people
                this.lineChartData[1]["data"].push(row.recovered);
                // Number of deaths
                this.lineChartData[2]["data"].push(row.deaths);
                // Critical cases
                this.lineChartData[3]["data"].push(row.critical);
                this.lineChartLabels = [...this.lineChartLabels, row.timestamp];
              });
            // Pie chart data
            if( data.snapshots != null && data.snapshots.length > 0 ) {
              this.pieChartData = [
                data.snapshots.reverse()[0].cases,
                data.snapshots.reverse()[0].recovered,
                data.snapshots.reverse()[0].deaths,
                data.snapshots.reverse()[0].critical,
              ];
            }
          } else {
            this.isError = true;
            this.snackBar.open("No country found", "Undo", {
              duration: 2000,
            });
          }
        },
        (error) => {
          this.snackBar.open("No country found", "Undo", {
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

  // Reset data
  private initializeData() {
    // Init line Chart
    for (let i = 0; i < 4; i++) {
      this.lineChartData[i].data = [];
    }
    // Init Pie Chart
    this.pieChartData = [0, 0, 0, 0];
    // Init Charts labels
    this.lineChartLabels = [];
  }

  public changeStyle(): void {
    this.lineChartData = this.lineChartData.map((row) => {
      row.fill = !row.fill;
      return row;
    });
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDateRangeUpdate() {
    // Check form validity
    if (this.dateForm.invalid) {
      this.snackBar.open("Invalid date range", "Undo", {
        duration: 2000,
      });
    } else {
      // Refetch data with range
      this.fetchData(
        this.country.alpha2Code.toLowerCase(),
        new Date(this.dateForm.controls.startPicker.value),
        new Date(this.dateForm.controls.endPicker.value)
      );
    }
  }
}
