import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'app/shared/services/encryption.service';

@Component({
    selector: 'ml-delivered',
    templateUrl: './delivered.component.html',
    styleUrls: ['./delivered.component.scss']
})
export class DeliveredComponent implements OnInit {

    decryptedDepartmentId: string;
    routineSelected: number = 2;
    constructor(private route: ActivatedRoute, private encryptionService: EncryptionService) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.decryptedDepartmentId = this.encryptionService.convertToEncOrDecFormat('decrypt', params.get("id"));
        });
    }

}
