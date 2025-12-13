import { Component, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Settings" 
      windowId="settings"
      [initialX]="300" 
      [initialY]="200" 
      [width]="320"
      (closed)="onClose()">
      <div class="settings-content">
        <fieldset>
          <legend>Save Management</legend>
          
          <div class="setting-row">
            <button class="btn" (click)="exportSave()">
              [>] Export Save
            </button>
          </div>

          @if (exportedData()) {
            <div class="export-area mt-1">
              <textarea 
                readonly 
                [value]="exportedData()"
                rows="3"
                (click)="selectAll($event)">
              </textarea>
              <div class="hint">Click to select, then copy.</div>
            </div>
          }

          <div class="setting-row mt-2">
            <label>Import Save:</label>
            <textarea 
              [(ngModel)]="importData"
              rows="3"
              placeholder="Paste save data here...">
            </textarea>
          </div>
          <div class="setting-row">
            <button class="btn" (click)="importSave()" [disabled]="!importData">
              [<] Import Save
            </button>
            @if (importMessage()) {
              <span class="import-msg" [class.error]="importError()">{{ importMessage() }}</span>
            }
          </div>
        </fieldset>

        <fieldset class="mt-2">
          <legend>Game Controls</legend>
          <div class="setting-row">
            <button class="btn btn-danger" (click)="confirmReset()">
              [X] Reset Game
            </button>
          </div>
          @if (showResetConfirm()) {
            <div class="confirm-box mt-1">
              <p>Are you sure? This cannot be undone!</p>
              <div class="confirm-buttons">
                <button class="btn" (click)="cancelReset()">Cancel</button>
                <button class="btn btn-danger" (click)="doReset()">Yes, Reset</button>
              </div>
            </div>
          }
        </fieldset>

        <fieldset class="mt-2">
          <legend>Statistics</legend>
          <div class="stat-row">
            <span>Enemies Defeated:</span>
            <span>{{ combat().enemiesDefeated }}</span>
          </div>
          <div class="stat-row">
            <span>Gold Earned:</span>
            <span>{{ resources().gold }}</span>
          </div>
          <div class="stat-row">
            <span>Spells Crafted:</span>
            <span>{{ craftedSpells().length }}</span>
          </div>
        </fieldset>
      </div>
    </app-window>
  `,
  styles: [`
    .settings-content {
      display: flex;
      flex-direction: column;
    }
    .setting-row {
      margin: 4px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    textarea {
      width: 100%;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      padding: 4px;
      resize: none;
    }
    .hint {
      font-size: 9px;
      color: #808080;
      font-style: italic;
    }
    .import-msg {
      font-size: 10px;
      color: #008800;
      &.error { color: #880000; }
    }
    .btn-danger {
      background-color: #ffcccc;
    }
    .confirm-box {
      background-color: #fff0f0;
      border: 2px solid #cc0000;
      padding: 8px;
      text-align: center;
      p { margin: 0 0 8px 0; font-weight: bold; color: #cc0000; }
    }
    .confirm-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      font-size: 11px;
    }
  `]
})
export class SettingsComponent {
  @Output() closed = new EventEmitter<void>();
  private gameState = inject(GameStateService);

  readonly combat = this.gameState.combat;
  readonly resources = this.gameState.resources;
  readonly craftedSpells = this.gameState.craftedSpells;

  readonly exportedData = signal<string>('');
  readonly showResetConfirm = signal(false);
  readonly importMessage = signal<string>('');
  readonly importError = signal(false);
  importData = '';

  exportSave(): void {
    this.exportedData.set(this.gameState.exportSave());
  }

  selectAll(event: Event): void {
    (event.target as HTMLTextAreaElement).select();
  }

  importSave(): void {
    if (this.gameState.importSave(this.importData.trim())) {
      this.importMessage.set('Import successful!');
      this.importError.set(false);
      this.importData = '';
    } else {
      this.importMessage.set('Invalid save data!');
      this.importError.set(true);
    }
    setTimeout(() => this.importMessage.set(''), 3000);
  }

  confirmReset(): void {
    this.showResetConfirm.set(true);
  }

  cancelReset(): void {
    this.showResetConfirm.set(false);
  }

  doReset(): void {
    this.gameState.resetGame();
    this.showResetConfirm.set(false);
  }

  onClose(): void { this.closed.emit(); }
}
