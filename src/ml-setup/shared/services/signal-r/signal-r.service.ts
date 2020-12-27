import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { GlobalConstants } from 'ml-shared/common/global-constants';

const SALESLOG_API = `${GlobalConstants.apiURL}ViewsData`;


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: any[];
  public bradcastedData: any;

  public hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://motorlogs1.azurewebsites.net/LiveSheetDataForViews')
                            .build();

    this.hubConnection
      .start()
      .then(() =>console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('TransferLiveSheetData', (data) => {
      this.data = data;
      // console.log(data);
    });
  }


  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastchartdata', this.data)
    .catch(err => console.error(err));
  }
  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastchartdata', (data) => {
      this.bradcastedData = data;
    })
  }

}