import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Bank, BANKS, ItemObj } from '../demo-data';


declare var $: any;



@Component({
  selector: 'app-single-selection-example',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss']
})


export class SingleSelectionExampleComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('singleSelect' , {static:false}) singleSelect: MatSelect;
  @Input ('flag') customDropdownFlag:boolean;
  @Input ('rowDate') rowDate : string;
  @Input ('itemArray') itemArray :any;
  @Input ('selected') selected : string;
  @Input ('header')  header :string;
  /** list of banks */
 // protected items: Bank[] = BANKS;


 protected items: ItemObj[] = [];
 protected dateitems: ItemObj[] = [];

  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<ItemObj[]> = new ReplaySubject<ItemObj[]>(1);

 

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  private selectedItem : string ;
  
  private selected_date : string;
  private cellItem : string;
  private  flag : boolean = false;
  private openFlag:boolean;
  
  
  constructor() {  
  
   //console.log( this.selected_date);
  //  console.log($("#_datetimepicker4").val());
  }
  open(){
    console.log('cal open');
  /**   $.datetimepicker.setLocale('en');
    $('#datetimepicker3').datetimepicker({
     inline:true
     });**/

   


     $.datetimepicker.setLocale('en');
     $('#_datetimepicker4').datetimepicker({
       format:'d.m.Y H:i',
       allowTimes:[
         '0:00','9:00', '9:30','10:00','10:30', '11:00','11:30',
         '12:00','12:30','01:00','1:30','2:30','3:00',
         '3:30','4:00','4:30','5:00','5:30'
         ],
      inline:true
      });

  }

  
 

  openedChange(opened: boolean) {
    
   // this.ngOnInit();
    this.open();
    // console.log($("#_datetimepicker4").val());
   

    $('[id^="mat-input"]').attr('placeholder','Search');
    $('.mat-select-search-no-entries-found').text("");
    // console.log(this.itemArray);
    
    opened ? $("#calDisplay").show():$("#calDisplay").hide();
   
    //this.selectedItem= this.rowDate!=null?this.rowDate:this.selected_date;
    //this.controls['bankCtrl'].setValue("skhsk ");
  //  console.log( this.cellItem);
    // console.log(opened ? 'opened' : 'closed');
    
}



doSomething () {
  
  this.selectedItem = $("#_datetimepicker4").val();
  // console.log($("#_datetimepicker4").val());

  
  // console.log(this.selectedItem+!this.flag);
  // console.log(this.items.some(x => x.code === "TBA"));
  
  if(this.items.length == this.itemArray.length && this.selectedItem!=null){
    // console.log(this.selectedItem +" "+this.items.length);
    // console.log(this.items);
    let item = new ItemObj();
   
    item.name=this.selectedItem ;
    item.id=this.selectedItem ;
    item.code=null;
    item.details=null;
    this.dateitems.push(item);
 
    // console.log(this.dateitems);
    //this.ngOnInit();
  }
  if(this.items.length == this.itemArray.length+1 && this.selectedItem!=null ){
    // console.log(this.selectedItem+ " "+this.items.length);
    this.items.splice(0,1); // delete the last item
  //  this.items.push({code:  this.selectedItem, id:  this.selectedItem ,name:null ,details:null});
    // console.log(this.items);
    let item = new ItemObj();
   
    item.name=this.selectedItem ;
    item.id=this.selectedItem ;
    item.code=null;
    item.details=null;
    this.dateitems.push(item);
    
    // console.log(this.dateitems);
   // this.ngOnInit();
  }
  
    this.ngOnInit();
  //console.log(e);
}


dateTimePushToItems(items , item): boolean {

   if(this.items.some(x => x.code === item)){
  return true;
    }else {
           return false;
         }


}



  ngOnInit() {
    // $.datetimepicker.setLocale('en');
    //,'search');
    
    
    // console.log("this.itemArray.:",this.itemArray);


    // console.log("Selected "+this.selected +" Header "+this.header);
    let itemObjArray: ItemObj[]=[];
    let selected = this.selected;
    if(this.itemArray){

      this.itemArray.forEach(function(k :any){
        let item = new ItemObj();
      
        item.name=k.valText;
        item.id=k.id;
        item.code=k.code;
        item.details=k.details;
        if(item.name!=selected) {
        itemObjArray.push(item);
        }
    
      });
    }
    if(this.dateitems.length >=1) {
    this.items = this.dateitems.concat( itemObjArray); // add date time to existing combo value from json
    // console.log( this.items);
    } else {
      this.items =  itemObjArray; // add date time to existing combo value from json
      // console.log( this.items);
    }
    //this.selectedItem= this.rowDate!=null?this.rowDate:this.selected_date;

    // set initial selection
    this.bankCtrl.setValue(this.items[10]);

    // load the initial bank list
    this.filteredBanks.next(this.items.slice());

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
  
    this.setInitialValue();
  }
  ngAfterContentInit() {
   
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
   
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: ItemObj, b: ItemObj) => a && b && a.id === b.id;
      }); 

   
  
      

  }

  private filterBanks() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value!=null?this.bankFilterCtrl.value:this.selectedItem;
    // console.log(search);
    if (!search) {
      this.filteredBanks.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.items.filter(ItemObj => (ItemObj.name.toLowerCase().indexOf(search) >-1 || ItemObj.code.toLowerCase().indexOf(search) >-1))
    );
  }


  protected filterBanksOld() {
    if (!this.items) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    // console.log(search);
    if (!search) {
      this.filteredBanks.next(this.items.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    
     this.filteredBanks.next(
      this.items.filter(ItemObj => ItemObj.code.toLowerCase().indexOf(search) > -1)
    );
  }

 
  go(event){
    console.log($("#_datetimepicker4").val());
    console.log(this.selectedItem, this.selected,event);
    if(event.value && event.value.name){
      this.selectedItem  = event.value.name;
      console.log(event);
    }
    //event.value.name =this.selected_date;


  }
  

}

  
