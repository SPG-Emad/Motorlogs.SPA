import { Component, OnInit , ChangeDetectionStrategy} from '@angular/core';
import { LegendsService } from 'ml-setup/shared/services/permissions/legends.service';
import { SlideInOutAnimation } from 'app/shared/animation/animation';

@Component({
  selector: 'ml-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [SlideInOutAnimation]

})
export class LegendsComponent implements OnInit {

  constructor(private legendService: LegendsService) { }
  editLegend: false;
  newLegend: false;
  reportLegend: false;
  animationState = 'out';

  legends: any[] = [];

  ngOnInit() {

    /*Fetch all legends*/ 
    this.getAllLegends();
    /*-----------------*/ 

  }

  toggleShowDiv(divName: string) {
    if (divName === 'divA') {
      console.log(this.animationState);
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
      console.log(this.animationState);
    }
  }

  getAllLegends(){
    this.legendService.getLegends().subscribe(res=>{
      this.legends = res;
    });
  }

}
