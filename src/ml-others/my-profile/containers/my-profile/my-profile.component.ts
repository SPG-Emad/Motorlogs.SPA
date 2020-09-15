import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'ml-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    encapsulation: ViewEncapsulation.None, animations: fuseAnimations
})
export class MyProfileComponent implements OnInit {

    
    constructor() { }

    ngOnInit() {
    }

    
}
