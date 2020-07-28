import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private subject = new Subject<any>();
  private clearSubject = new Subject<any>();

  sendClickEvent() {
    this.subject.next();
  }

  getClickEvent(): Observable<any>{ 
    return this.subject.asObservable();
  }

  sendClearEvent() {
    this.clearSubject.next();
  }

  getClearEvent(): Observable<any>{ 
    return this.clearSubject.asObservable();
  }
}
