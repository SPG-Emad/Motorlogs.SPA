import { Component, ViewChild } from "@angular/core";
import * as moment from "moment";

@Component({
    selector: "dropdown-renderer",
    template: `<app-single-selection-example
        [colDef]="colDef"
        [itemArray]="itemsArray"
        [flag]="customFlag"
        [selected]="selected"
        [rowDate]="rowDate" 
    ></app-single-selection-example> `,
})
export class DropDownRenderer {
    private params1: any;
    item: string = "UU";
    options: ["Cancelled", "Pending", "TBA", "Delete"];
    dateFlag: boolean = false;
    rowDate:string;
    customFlag: boolean = false;
    itemsArray: any[];
    colDef: any;
    selected: string;

    agInit(params): void {
        this.colDef = params;
        this.itemsArray = params.data["cellOptions_" + params.colDef.colCode];
        
        console.log('**********');
        console.log('items array: ', this.itemsArray);
        console.log('**********');

        console.log('**********');
        console.log('params: ', params);
        console.log('**********');

        if(params.value != null && this.itemsArray.find(x=> x.code.toLowerCase() === params.value.toLowerCase()) === undefined){
            // console.log('not found ', params.value);
            // const newItem = {
            //     id: 1,
            //     code: params.value,
            //     valText: params.value,
            //     details: null
            // };
            // this.itemsArray.unshift(newItem);
            this.rowDate = params.value;
            this.selected = params.value;
        }else{
            console.log('found');
        }
        
        // agar this.itemsarray mein code == params.value na miley tou usme add karado
        // id
        // code
        // valtext
        // details

        console.log("params :::: ", params);
        console.log("this.itemsArray :::: ", this.itemsArray);

        if (params.value != null) {
            params.data["cellOptions_" + params.colDef.colCode] &&
            params.data["cellOptions_" + params.colDef.colCode].length > 0
                ? params.data["cellOptions_" + params.colDef.colCode][0].details
                : "no cell option data";
        } else {
            console.log("No Data");
        }

    }
}
