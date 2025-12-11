import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    Output
  } from '@angular/core';
  import { GridApi, IDatasource, IGetRowsParams } from 'ag-grid-community';
  import { EMPTY } from 'rxjs';
  import { catchError, tap } from 'rxjs/operators';
  import { LoadModelApi } from './load-model-api';
  
  @Directive({
    selector: '[remoteGridBinding]'
  })
  export class RemoteGridBindingDirective {
    @Input()
    remoteGridBinding: LoadModelApi | any;
  
    @Output()
    remoteGridReady = new EventEmitter();
  
    constructor() {}
  
    @HostListener('gridReady', ['$event']) gridReady(gridApi: GridApi) {
      this.updateGridApi(gridApi);
    }
  
    updateGridApi(gridApi) {
      gridApi.api.setDatasource(this.dataSource);
      this.remoteGridReady.emit(gridApi);
    }
  
    handleError(err) {
      this.remoteGridBinding.getDataError(err);
      return EMPTY;
    }
  
    dataSource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        this.remoteGridBinding
          .getData(params)
          .pipe(
            tap(({ data, totalRecords }) =>
              params.successCallback(data, totalRecords)
            ),
            catchError(err => this.handleError(err))
          )
          .subscribe();
      }
    };
  }
  