
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" (click)="onCancel($event)">
      <div class="modal-window" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <span class="modal-title">{{ title() }}</span>
          <button class="close-btn" (click)="onCancel($event)">×</button>
        </div>
        <div class="modal-content">
          <p class="modal-message">{{ message() }}</p>
          <div class="modal-actions">
            <button class="win95-btn" (click)="onConfirm($event)">{{ confirmText() }}</button>
            <button class="win95-btn" (click)="onCancel($event)">{{ cancelText() }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(1px);
    }
    .modal-window {
      width: 200px;
      background-color: #c0c0c0; /* win95 gray */
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff; /* win95 3d border */
      box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      background: linear-gradient(90deg, #000080, #1084d0);
      color: white;
      padding: 2px 4px;
      font-weight: bold;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .close-btn {
      background: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #404040 #404040 #ffffff;
      color: black;
      font-size: 11px;
      width: 14px;
      height: 14px;
      line-height: 12px;
      text-align: center;
      cursor: pointer;
      &:active {
        border-color: #404040 #ffffff #ffffff #404040;
      }
    }
    .modal-content {
      padding: 12px;
      text-align: center;
    }
    .modal-message {
      margin-bottom: 16px;
      font-size: 11px;
      color: #000;
    }
    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .win95-btn {
      padding: 4px 12px;
      background-color: #c0c0c0;
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      font-size: 11px;
      cursor: pointer;
      &:active {
        border-color: #808080 #ffffff #ffffff #808080;
        transform: translate(1px, 1px);
      }
    }
  `]
})
export class ConfirmationModalComponent {
  title = input('');
  message = input('');
  confirmText = input('Yes');
  cancelText = input('No');

  confirm = output<void>();
  closed = output<void>();

  onConfirm(event: Event): void {
    event.stopPropagation();
    this.confirm.emit();
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.closed.emit();
  }
}
