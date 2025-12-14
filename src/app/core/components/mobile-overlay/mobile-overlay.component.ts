import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mobile-overlay',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="mobile-overlay">
      <div class="message-box">
        <div class="title-bar">
          <span>Error</span>
          <button class="close-btn">X</button>
        </div>
        <div class="content">
          <div class="icon-section">
            <div class="error-icon">❌</div>
          </div>
          <div class="text-section">
            <p><strong>System Error: Resolution Too Low</strong></p>
            <p class="mt-2">The Arcanum requires a higher resolution display to function correctly.</p>
            <p class="mt-2">Please access the Spell-Crafter Chronicles from a desktop terminal.</p>
          </div>
        </div>
        <div class="button-section">
          <button class="win95-btn">OK</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #008080; /* Win95 Teal */
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Tahoma', 'MS Sans Serif', 'Segoe UI', sans-serif;
    }

    .message-box {
      width: 300px;
      background-color: #c0c0c0;
      border: 2px solid;
      border-color: #dfdfdf #808080 #808080 #dfdfdf;
      box-shadow: 2px 2px 0px #000;
      padding: 2px;
      display: flex;
      flex-direction: column;
    }

    .title-bar {
      background: linear-gradient(90deg, #000080, #1084d0);
      color: white;
      padding: 2px 4px;
      font-weight: bold;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #dfdfdf #808080 #808080 #dfdfdf;
      width: 16px;
      height: 14px;
      font-size: 10px;
      line-height: 10px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 2px;
    }

    .content {
      padding: 16px 12px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .error-icon {
      font-size: 32px;
    }

    .text-section {
      font-size: 12px;
      color: black;
    }

    .button-section {
      display: flex;
      justify-content: center;
      padding-bottom: 12px;
    }

    .win95-btn {
      background-color: #c0c0c0;
      border: 2px solid;
      border-color: #dfdfdf #808080 #808080 #dfdfdf;
      color: black;
      padding: 4px 24px;
      font-size: 12px;
      font-family: inherit;
      outline: 1px dotted transparent;
      outline-offset: -4px;
    }
    
    .win95-btn:active {
      border-color: #808080 #dfdfdf #dfdfdf #808080;
      padding: 5px 23px 3px 25px;
    }

    .mt-2 { margin-top: 8px; }

    @media (min-width: 768px) {
      .mobile-overlay {
        display: none !important;
      }
    }
  `]
})
export class MobileOverlayComponent { }
