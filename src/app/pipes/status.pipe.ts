import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'status', standalone: true })
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Alive':
        return '🟢 Vivant';
      case 'Dead':
        return '🔴 Mort';
      case 'unknown':
        return '⚪ Inconnu';
      default:
        return value;
    }
  }
}
