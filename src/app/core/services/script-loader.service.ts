import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private loadedScripts: { [key: string]: boolean } = {};

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts[src]) {
        // Script is already loaded
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = true;
      script.onload = () => {
        this.loadedScripts[src] = true;
        resolve();
      };
      script.onerror = () => reject(`Failed to load script: ${src}`);
      document.body.appendChild(script);
    });
  }
}