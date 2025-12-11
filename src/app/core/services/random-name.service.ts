import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomNameService {
  generateRandomName(prefix: string): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomDigits}`;
  }
}
