import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsStyleManagerService {
  constructor() {}

  initializeStyleManager(editor: any): void {
    // Add a custom style manager sector
    editor.StyleManager.addSector('custom-style', {
      name: 'Custom Style',
      open: true,
      buildProps: ['width', 'height'], // Only include width and height
      properties: [
        {
          id: 'width',
          name: 'Width',
          property: 'width',
          type: 'integer',
          units: ['px', '%', 'em', 'rem'],
          defaults: 'auto',
          min: 0,
        },
        {
          id: 'height',
          name: 'Height',
          property: 'height',
          type: 'integer',
          units: ['px', '%', 'em', 'rem'],
          defaults: 'auto',
          min: 0,
        },
      ],
    });

    // Listen for the component:selected event
    editor.on('component:selected', () => {
      const selectedComponent = editor.getSelected();

      // Check if the selected component is a row (e.g., by tag name or class)
      if (selectedComponent && selectedComponent.is('row')) {
        // Activate the custom style manager
        editor.StyleManager.getSectors().reset([
          {
            name: 'Custom Style',
            open: true,
            buildProps: ['width', 'height'],
          },
        ]);
      }
    });
  }
}