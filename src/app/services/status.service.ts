import { HttpService } from './http.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Nation } from '../model/nation';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { State } from '../model/state';
import { District } from '../model/district';
import { Status } from '../model/status';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';
import { GlobalStatus } from '../model/global-status';
import { Country } from '../model/country';
import { WorldStatus } from '../model/world-status';

@Injectable({
    providedIn: 'root'
  })
export class StatusService extends HttpService{

    // stateSelected = new EventEmitter<{stateCode : string}>();
    private stateSelected = new BehaviorSubject<{stateCode : string}>({stateCode : 'KL'});
    stateSelected$ = this.stateSelected.asObservable();
    states: any[];
    status : Nation;
    
    worldStatus : any;
    countries : any[];

    constructor(http : HttpClient) {
        super(http);
    }

    getConsolidateData () : Observable<any> {
        var _states : State[] = [];
        var _districts : District[] = [];
        var districts : any[];    
        var _ditrictNewStatus : Status = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
        var _stateStatus : Status = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
        var _nationalStatus : Status = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
        var _newStatus : Status = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
        var _nationStatus : Nation;
        
        return this.get("https://api.covid19india.org/v2/state_district_wise.json") 
          .pipe(map(response =>{
            this.states = (response as any[]);
            this.states.forEach(state => {
              districts = (state.districtData as any[]);
              _stateStatus = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
              _ditrictNewStatus = { active : 0, deceased : 0, recovered : 0, total : 0, recoveryRate : 0 };
              districts.forEach(district => {
                _stateStatus.total += district.confirmed;
                _stateStatus.active += district.active;
                _stateStatus.deceased += district.deceased;
                _stateStatus.recovered += district.recovered;
                _nationalStatus.total += district.confirmed;
                _nationalStatus.active += district.active;
                _nationalStatus.deceased += district.deceased;
                _nationalStatus.recovered += district.recovered;
                _ditrictNewStatus.deceased += district.delta.deceased;
                _ditrictNewStatus.recovered += district.delta.recovered;
                _ditrictNewStatus.total += district.delta.confirmed;
                _newStatus.deceased += district.delta.deceased;
                _newStatus.recovered += district.delta.recovered;
                _newStatus.active += district.delta.confirmed;
    
                _districts.push({
                  districtName : district.district,
                  status : {
                    active : district.active,
                    deceased : district.deceased,
                    recovered : district.recovered,
                    total : district.confirmed,
                    recoveryRate : Number(Number(district.confirmed > 0 ? ((district.recovered / district.confirmed) * 100) : 0).toFixed(2)) 
                  },
                  newStatus : {
                    confirmed : district.delta.confirmed,
                    deceased : district.delta.deceased,
                    recovered : district.delta.recovered
                  }
                });
              });
              _stateStatus.recoveryRate = Number(Number(_stateStatus.total > 0 ? (_stateStatus.recovered + _stateStatus.deceased) / _stateStatus.total * 100 : 0).toFixed(2));
              _states.push({
                stateCode : state.statecode,
                stateName : state.state,
                status  : _stateStatus,
                newStatus : _ditrictNewStatus,
                districts : _districts 
              })
              _districts = [];
            });
    
          _nationStatus = {
            newCase : {
              confirmed : _newStatus.active,
              deceased : _newStatus.deceased,
              recovered : _newStatus.recovered
            },
            states : _states,
            status : {
              active : _nationalStatus.active,
              deceased : _nationalStatus.deceased,
              recovered : _nationalStatus.recovered,
              total : _nationalStatus.total,
              recoveryRate : (_nationalStatus.recovered / _nationalStatus.total) * 100
            }
          }
          _nationStatus.states.sort((a, b): number => this.getConsolidatedDataSorted(a, b));
          return _nationStatus;
          }),catchError(this.errorHandler));  
      }
    
    getConsolidatedDataSorted(a, b){
      if (a.status.total < b.status.total) return 1;
      if (a.status.total > b.status.total) return -1;
      return 0;
    }

    getGloablData() : Observable<any>{
      var _countries : Country[] = [];
      var _globalStatus : GlobalStatus = { newConfirmed : 0, totalConfirmed : 0, totalDeaths : 0, totalRecovered : 0, newDeaths : 0, newRecovered : 0 };
      var _consolidatedStatus : WorldStatus = { consolidated : _globalStatus, countries : _countries };
      return this.get("https://api.covid19api.com/summary")
      .pipe(map(response =>{
        this.worldStatus = response as any;
        _globalStatus.newConfirmed  = this.worldStatus.Global.NewConfirmed;
        _globalStatus.newDeaths = this.worldStatus.Global.NewDeaths;
        _globalStatus.newRecovered = this.worldStatus.Global.NewRecovered;
        _globalStatus.totalConfirmed = this.worldStatus.Global.TotalConfirmed;
        _globalStatus.totalDeaths = this.worldStatus.Global.TotalDeaths;
        _globalStatus.totalRecovered = this.worldStatus.Global.TotalRecovered;
        this.worldStatus.Countries.forEach(country=>{
          // console.log(country);
          _countries.push({
            country : country.Country,
            countryCode : country.CountryCode,
            newConfirmed : country.NewConfirmed,
            newDeaths : country.NewDeaths,
            newRecovered : country.NewRecovered,
            totalConfirmed : country.TotalConfirmed,
            totalDeaths : country.TotalDeaths,
            totalRecovered : country.TotalRecovered
          })
        });
        _consolidatedStatus.consolidated = _globalStatus;
        _consolidatedStatus.countries = _countries;
        // console.log(_consolidatedStatus);
        return _consolidatedStatus;
      }),catchError(this.errorHandler));
    }

    errorHandler(error: HttpErrorResponse) {
      if(error.status === 404)
        return throwError (new NotFoundError(error));
  
      return throwError(new AppError(error));
    }

    OnStateSelected(code : string){
      this.stateSelected.next({stateCode : code});
    }
}