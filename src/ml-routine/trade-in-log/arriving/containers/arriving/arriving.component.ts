import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'app/shared/services/encryption.service';

@Component({
  selector: 'ml-arriving',
  templateUrl: './arriving.component.html',
  styleUrls: ['./arriving.component.scss']
})
export class ArrivingComponent implements OnInit {

  decryptedDepartmentId: string;
  routineSelected: number = 3;
  constructor(private router: Router, private route: ActivatedRoute, private encryptionService: EncryptionService) { }

  ngOnInit() {
      this.route.paramMap.subscribe(params => {
          this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
      });
  }
}
