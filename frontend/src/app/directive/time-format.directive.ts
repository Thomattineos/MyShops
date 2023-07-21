import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTimeFormat]',
})
export class TimeFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substr(0, 4);

    const hours = parseInt(value.substr(0, 2), 10);
    if (hours > 23) {
      value = '23' + value.substr(2);
    }

    const minutes = parseInt(value.substr(2), 10);
    if (minutes > 59) {
      value = value.substr(0, 2) + '59';
    }

    if (value.length > 2) {
      input.value = `${value.substr(0, 2)}:${value.substr(2)}`;
    } else {
      input.value = value;
    }
  }
}
