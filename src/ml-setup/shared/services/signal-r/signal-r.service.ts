import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { GlobalConstants } from 'ml-shared/common/global-constants';

const LIVE_API = `${GlobalConstants.liveURL}`;

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data: any[];
    public broadcastedData: any;

    public hubConnection: signalR.HubConnection

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(LIVE_API)
            //.withUrl('http://localhost:5000/LiveSheetDataForViews')
            .build();

        this.hubConnection
            .start()
            .then(() => {console.log('Connection started'); })
            .catch(err => console.log('Error while starting connection: ' + err))
    }

    public addTransferChartDataListener = () => {
        this.hubConnection.on('TransferLiveSheetData', (data) => {
            this.data = data;
            alert('on');
            console.log("on");
        });
    }

    public BroadcastLiveSheetData = () => {
        console.log('BroadcastLiveSheetData');
        this.hubConnection.invoke('TransferLiveSheetData', this.data);
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