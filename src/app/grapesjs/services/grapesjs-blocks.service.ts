import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GrapesJsBlocksService {
  constructor() {}

  addBlocks(editor: any): void {
    if (!editor || !editor.BlockManager) {
      console.error('Editor is not initialized yet');
      return;
    }

    console.log('Adding blocks to GrapesJS...'); // Debugging

    /* editor.BlockManager.add('h1-block', {
      label: 'Heading',
      media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" /></svg>',
      content: '<h1>Put your title here</h1>',
      category: 'Basic',
      attributes: {
        title: 'Insert h1 block'
      }
    }); */

    editor.BlockManager.add('1-column', {
      label: 'Single Block',
      media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"></path>
    </svg>`,
      category: 'Containers',
      attributes: { class: '' },
      content: `
        <div class="gjs-row" style="display: flex;padding: 10px;">
          <div class="gjs-cell" style="width: 100%; height: 75px;display:table-cell"></div>
        </div>
      `
    });

    editor.BlockManager.add('3-columns', {
      label: 'H Split Block',
      media: `<svg viewBox="0 0 23 24">
        <path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"></path>
      </svg>`,
      category: 'Containers',
      attributes: { class: '' },
      content: `
        <div class="gjs-row" style="display: flex;padding: 10px;">
          <div class="gjs-cell" style="width: 100%; min-height: 75px;display:table-cell"></div>
          <div class="gjs-cell" style="width: 100%; min-height: 75px;display:table-cell"></div>
          <div class="gjs-cell" style="width: 100%; min-height: 75px;display:table-cell"></div>
        </div>
      `
    });

    editor.BlockManager.add('vertical-1-3-section', {
      label: 'V Split Block',
      media: `
          <svg viewBox="0 0 23 24">
            <g transform="rotate(90, 11.5, 12)">
              <path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"></path>
            </g>
          </svg>`,
      content: `<table draggable="true" class="vertical-section">
        <tbody draggable="true">
          <tr draggable="true">
            <td data-gjs-type="cell" draggable="true"></td>
          </tr>
          <tr draggable="true">
            <td data-gjs-type="cell" draggable="true"></td>
          </tr>
          <tr draggable="true">
            <td data-gjs-type="cell" draggable="true"></td>
          </tr>
        </tbody>
      </table>`,
      category: 'Containers',
    });

    editor.CssComposer.addRules(`
      .vertical-section {
          margin: 0 auto 10px auto;
          padding: 5px 5px 5px 5px;
          width: 100%;
      }
      .vertical-section td {
          padding: 0;
          margin: 0;
          vertical-align: top;
          width: 100%;
          height: 60px;
      }
  `);

    console.log('Block added successfully'); // Debugging
  }
}
