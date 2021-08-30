import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'app/shared/services/encryption.service';

@Component({
  selector: 'ml-arriving',
  templateUrl: './arriving.component.html',
  styleUrls: ['./arriving.component.scss']
})
export class ArrivingComponent {
  routineSelected: number = 3;
}
