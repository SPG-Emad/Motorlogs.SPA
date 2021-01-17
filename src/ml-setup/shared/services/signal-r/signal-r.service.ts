import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { GlobalConstants } from 'ml-shared/common/global-constants';

const SALESLOG_API = `${GlobalConstants.apiURL}ViewsData`;

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data: any[];
    public broadcastedData: any;

    public hubConnection: signalR.HubConnection

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            // .withUrl('https://motorlogs1.azurewebsites.net/LiveSheetDataForViews')
            .withUrl('http://localhost:5000/LiveSheetDataForViews')
            .build();

        this.hubConnection
            .start()
            .then(() => {console.log('Connection started');  this.BroadcastLiveSheetData();})
            .catch(err => console.log('Error while starting connection: ' + err))

           
    }

    public addTransferChartDataListener = () => {
        this.hubConnection.on('TransferLiveSheetData', (data) => {
            this.data = data;
            console.log(data);
        });
    }

    public BroadcastLiveSheetData = () => {
        console.log('BroadcastLiveSheetData');
        this.hubConnection.invoke('TransferLiveSheetData', this.data)
        .then((x) => console.log(x))
        .catch(err => console.error(err));
    }

    public BroadcastLiveSheetDataForViews = () => {
        this.hubConnection.invoke('BroadcastLiveSheetDataForViews', this.data)
            .catch(err => console.error(err));
    }

    public addBroadcastLiveSheetDataForViewsListener = () => {
        this.hubConnection.on('BroadcastLiveSheetDataForViews', (data) => {
            this.broadcastedData = data;
        })
    }

}