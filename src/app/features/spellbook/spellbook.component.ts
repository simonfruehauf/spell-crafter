import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Spell } from '../../core/models/game.interfaces';

@Component({
  selector: 'app-spellbook',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Spellbook" 
      windowId="spellbook"
      [initialX]="600" 
      [initialY]="80" 
      [width]="340"
      (closed)="onClose()">
      
      <div class="spellbook-content">
        <div class="spellbook-description">
          <p>Configure your spell rotation for auto-combat.</p>
        </div>

        <!-- Spell Queue -->
        <fieldset class="queue-section">
          <legend>Spell Queue ({{ spellQueue().length }})</legend>
          <div class="queue-list">
            @for (spellId of spellQueue(); track $index; let i = $index) {
              @if (getSpellById(spellId); as spell) {
                <div class="queue-item" [class.current]="i === currentQueueIndex() && combat().inCombat">
                  <span class="queue-index">{{ i + 1 }}.</span>
                  <span class="spell-symbol">{{ spell.symbol }}</span>
                  <span class="spell-name">{{ spell.name }}</span>
                  <span class="spell-mana">({{ spell.totalManaCost }} MP)</span>
                  <div class="queue-controls">
                    <button (click)="moveUp(i)" [disabled]="i === 0" title="Move Up">[^]</button>
                    <button (click)="moveDown(i)" [disabled]="i === spellQueue().length - 1" title="Move Down">[v]</button>
                    <button (click)="removeFromQueue(i)" class="remove-btn" title="Remove">[x]</button>
                  </div>
                </div>
              }
            } @empty {
              <div class="empty-msg">No spells in queue. Add spells below.</div>
            }
          </div>
          @if (spellQueue().length > 0) {
            <button class="clear-btn" (click)="clearQueue()">Clear Queue</button>
          }
        </fieldset>

        <!-- Available Spells -->
        <fieldset class="available-section">
          <legend>Available Spells</legend>
          <div class="spell-list">
            @for (spell of craftedSpells(); track spell.id) {
              <div class="spell-item">
                <span class="spell-symbol">{{ spell.symbol }}</span>
                <span class="spell-name">{{ spell.name }}</span>
                <span class="spell-mana">{{ spell.totalManaCost }} MP</span>
                <button class="add-btn" (click)="addToQueue(spell.id)" title="Add to Queue">[+]</button>
              </div>
            } @empty {
              <div class="empty-msg">No spells crafted yet.</div>
            }
          </div>
        </fieldset>
      </div>
    </app-window>
  `,
  styles: [`
    .spellbook-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 420px;
      overflow-y: auto;
    }
    .spellbook-description {
      padding: 6px;
      border: 1px solid var(--win95-dark-gray);
      background-color: #ffffcc;
      font-style: italic;
      font-size: 11px;
    }
    fieldset {
      border: 1px solid var(--win95-dark-gray);
      padding: 6px;
      margin: 0;
    }
    legend {
      font-weight: bold;
      font-size: 11px;
      padding: 0 4px;
    }
    .queue-section {
      background-color: var(--win95-white);
    }
    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 150px;
      overflow-y: auto;
    }
    .queue-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 6px;
      background-color: var(--win95-light-gray);
      border: 1px solid var(--win95-dark-gray);
      font-size: 11px;
      &.current {
        background-color: #ccffcc;
        border-color: #80cc80;
      }
    }
    .queue-index {
      color: var(--win95-dark-gray);
      min-width: 18px;
    }
    .spell-symbol {
      color: var(--win95-blue);
      font-weight: bold;
    }
    .spell-name {
      flex: 1;
    }
    .spell-mana {
      color: var(--win95-dark-gray);
      font-size: 10px;
    }
    .queue-controls {
      display: flex;
      gap: 2px;
      button {
        background: var(--win95-gray);
        border: 1px outset var(--win95-white);
        padding: 1px 4px;
        font-size: 9px;
        cursor: pointer;
        &:hover:not(:disabled) { background: var(--win95-light-gray); }
        &:disabled { opacity: 0.5; cursor: default; }
        &.remove-btn { color: #cc0000; }
      }
    }
    .clear-btn {
      margin-top: 6px;
      background: var(--win95-gray);
      border: 1px outset var(--win95-white);
      padding: 2px 8px;
      font-size: 10px;
      cursor: pointer;
      &:hover { background: var(--win95-light-gray); }
    }
    .available-section {
      background-color: var(--win95-white);
    }
    .spell-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      max-height: 120px;
      overflow-y: auto;
    }
    .spell-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      background-color: var(--win95-light-gray);
      border: 1px solid var(--win95-dark-gray);
      font-size: 11px;
    }
    .add-btn {
      background: #90ee90;
      border: 1px outset var(--win95-white);
      padding: 1px 6px;
      font-size: 10px;
      cursor: pointer;
      margin-left: auto;
      &:hover { background: #a0ffa0; }
    }
    .empty-msg {
      color: var(--win95-dark-gray);
      font-style: italic;
      font-size: 10px;
      padding: 4px;
      text-align: center;
    }
  `]
})
export class SpellbookComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly craftedSpells = this.gameState.craftedSpells;
  readonly combat = this.gameState.combat;

  spellQueue = () => this.combat().spellQueue;
  currentQueueIndex = () => this.combat().spellQueueIndex;

  getSpellById(id: string): Spell | undefined {
    return this.craftedSpells().find(s => s.id === id);
  }

  addToQueue(spellId: string): void {
    this.gameState.addToSpellQueue(spellId);
  }

  removeFromQueue(index: number): void {
    this.gameState.removeFromSpellQueue(index);
  }

  moveUp(index: number): void {
    if (index > 0) {
      this.gameState.reorderSpellQueue(index, index - 1);
    }
  }

  moveDown(index: number): void {
    if (index < this.spellQueue().length - 1) {
      this.gameState.reorderSpellQueue(index, index + 1);
    }
  }

  clearQueue(): void {
    this.gameState.clearSpellQueue();
  }

  onClose(): void {
    this.closed.emit();
  }
}
