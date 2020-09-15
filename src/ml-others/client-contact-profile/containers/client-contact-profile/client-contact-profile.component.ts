import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'ml-client-contact-profile',
  templateUrl: './client-contact-profile.component.html',
  styleUrls: ['./client-contact-profile.component.scss'],
  encapsulation: ViewEncapsulation.None, animations: fuseAnimations
})
export class ClientContactProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
