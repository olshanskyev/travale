import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, LOCALE_ID, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import type { ECharts, EChartsOption } from 'echarts';
import { combineLatest } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { registerMap } from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { Country } from 'src/app/@core/data/countries.data';
import { CountriesService } from 'src/app/@core/service/countries.service';
import { City } from 'src/app/@core/data/cities.data';
import { Destination, PopularDestinations } from 'src/app/@core/data/destination.data';

@Component({
  selector: 'travale-select-destination-map',
  templateUrl: './select-destination-map.component.html',
  styleUrls: ['./select-destination-map.component.scss']
})
export class SelectDestinationMapComponent implements OnDestroy {

  @Output() countrySelect: EventEmitter<Country> = new EventEmitter();
  @Output() citySelect: EventEmitter<City> = new EventEmitter();
  @Output() popularDestinationsSelect: EventEmitter<PopularDestinations> = new EventEmitter();

  options: EChartsOption = {};
  echartInstance: ECharts;

  inputValue = '';
  bubbleTheme: any;

  private alive = true;

  constructor(private theme: NbThemeService,
              private http: HttpClient,
              private translateService: TranslateService,
              private countriesService: CountriesService,
              @Inject(LOCALE_ID) private locale: string) {

    combineLatest([
      this.http.get('assets/map/world.json'),
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([map, config]: [any, any]) => {
        registerMap('world', map);

        this.bubbleTheme = config.variables.bubbleMap;
        this.options = this.getChartOptions();
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onChartInit(event: ECharts) {
    this.echartInstance = event;
  }

  getChartOptions(country?: string, zoom?: number, center?: number[]): EChartsOption {

    return {
      title: {
        text: this.translateService.instant('selectCountryMap.selectCountry'),
        left: 'center',
        top: '10px',
        textStyle: {
          color: this.bubbleTheme.titleColor,
        },
      },
      tooltip: {

      },
      geo: {
        type: 'map',
        map: 'world',
        roam: true,
        label: {
          show: false
        },
        selectedMode: 'single',
        selectedMap: (country) ? {
          [country]: true
        } : {},
        stateAnimation: {
          animation: true,
          animationDuration: 2000,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: this.bubbleTheme.areaHoverColor,
          }
        },
        center: (center)? center : [0, 15],
        select: {
          label: {
            show: false,
          },
          itemStyle: {
            areaColor: this.bubbleTheme.areaHoverColor,
          },
        },

        itemStyle: {
          areaColor: this.bubbleTheme.areaColor,
          borderColor: this.bubbleTheme.areaBorderColor,
        },
        zoom: (zoom)? zoom : 0,
      },
      series: [
      ],
    };
  }

  onSelectCountryByMap($event: any) {
    this.countriesService.getCountryByCommonName($event.region.name).subscribe(res => {
      this.inputValue = this.countriesService.getCountryNameTranslation(res, this.locale);
      res.type = 'country';
      this.countrySelect.emit(res);
    });
  }

  selectCountryOnMap(countryName: string) {
    const opts: EChartsOption = this.echartInstance.getOption() as EChartsOption;
    const geoOption: any = opts.geo;
    this.options = this.getChartOptions(countryName, geoOption[0].zoom, geoOption[0].center);
  }

  onSelectDestinationByInput(destination: Destination) {
    switch (destination.type) {
      case 'country': {
        const country: Country = destination as Country;
        this.countrySelect.emit(country);
        this.selectCountryOnMap(country.name.common);
        break;
      }
      case 'city': {
        const city: City = destination as City;
        this.citySelect.emit(city);
        // to select country on map. country name can be in local name
        this.countriesService.findCountriesByPattern(city.country).subscribe(res => {
          if (res[0])
            this.selectCountryOnMap(res[0].name.common);
        });

        break;
      }
      case 'popular_destinations': {
        this.popularDestinationsSelect.emit(destination as PopularDestinations);
        break;
      }
    }

  }
}
