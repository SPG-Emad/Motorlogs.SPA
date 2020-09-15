import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { GlobalConstants } from 'ml-shared/common/global-constants';

const SALESLOG_API = `${GlobalConstants.apiURL}ViewsData`;


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: any[];

private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(`${SALESLOG_API}/GetLiveSheetDataForViews`)
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferchartdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }
}