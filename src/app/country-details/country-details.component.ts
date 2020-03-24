import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StatisticsService} from '../shared/statistics.service';
import StatisticsModel from '../models/statistics.model';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {ChartColor, ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label, SingleDataSet} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {DatePipe} from '@angular/common';
import {getName} from 'country-list';


@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.css'],
})
export class CountryDetailsComponent implements OnInit, OnDestroy {


  displayedColumns: string[] = ['cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'active', 'critical', 'timestamp'];
  dataSource: MatTableDataSource<StatisticsModel>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  statisticsSubscription: Subscription;
  routeSubsription: Subscription;
  isLoading = true;
  isError = false;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [/*'2006', '2007', '2008', '2009', '2010', '2011', '2012'*/];
  public barChartType: ChartType = 'bar';
  public polarAreaChartType: ChartType = 'polarArea';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartColors: Color[] = [
    {backgroundColor: '#ec87b2'},
    {backgroundColor: '#36c436'},
    {backgroundColor: '#fede97'},
    {backgroundColor: '#86c3f1'},
  ];

  public barChartData: ChartDataSets[] = [
    {data: [/*65, 59, 80, 81, 56, 55, 40*/], label: 'Number of cases'},
    {data: [/*65, 59, 80, 81, 56, 55, 40*/], label: 'Recovered people'},
    {data: [/*65, 59, 80, 81, 56, 55, 40*/], label: 'Number of deaths'},
    {data: [/*65, 59, 80, 81, 56, 55, 40*/], label: 'Critical cases'}
  ];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['Number Of', 'Cases'], ['Recovered', 'People'], ['Number Of', 'Deaths'], ['Critical', 'Cases']];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#ec87b2', '#36c436', '#fede97', '#86c3f1'],
    },
  ];

  constructor(private statisticsService: StatisticsService, private route: ActivatedRoute, private titleService: Title,
              private snackBar: MatSnackBar, private datepipe: DatePipe) {
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
              this.dataSource = new MatTableDataSource<StatisticsModel>(data.snapshots.reverse());
              // Paginator
              this.dataSource.paginator = this.paginator;
              // Sort
              this.dataSource.sort = this.sort;
              // Push data into chart from first day until now
              data.snapshots.slice(0, 40).reverse().forEach(row => {
                // Number of cases
                this.barChartData[0]['data'].push(row.cases);
                // Recovered people
                this.barChartData[1]['data'].push(row.recovered);
                // Number of deaths
                this.barChartData[2]['data'].push(row.deaths);
                // Critical cases
                this.barChartData[3]['data'].push(row.critical);
                this.barChartLabels = [...this.barChartLabels, this.datepipe.transform(row.timestamp, 'short')];
              });
              // Pie chart data
              this.pieChartData = [
                data.snapshots[0].cases,
                data.snapshots[0].recovered,
                data.snapshots[0].deaths,
                data.snapshots[0].critical
              ];
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

  public changeStyle(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

