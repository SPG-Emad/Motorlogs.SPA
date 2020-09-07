import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';
import { noop } from 'rxjs';
@Pipe({
  name: 'boldText'
})
export class BoldTextPipe implements PipeTransform {

  constructor(
    private sanitizer: Sanitizer
  ) {}

  list = [
    {
      'value':'department'
    },
    {
      'value':'user role'
    },
  ]

  transform(value: string): any {
    let regex = this.list.find(el=>value.indexOf(el.value)!==-1);
    return this.sanitize(this.replace(value, regex.value));
  }

  replace(str, regex) {
    return str.replace(new RegExp(`(${regex})`, 'gi'), '<b>$1</b>');
  }

  sanitize(str) {
    return this.sanitizer.sanitize(SecurityContext.HTML, str);
  }
}
