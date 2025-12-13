import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { RUNES } from '../../core/models/game.data';

@Component({
  selector: 'app-runebook',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Runebook" 
      windowId="runebook"
      [initialX]="720" 
      [initialY]="40" 
      [width]="320"
      (closed)="onClose()">
      <div class="runebook-content">
        <div class="runebook-description">
          <p>Your collection of arcane rune knowledge.</p>
        </div>

        <!-- Known Runes -->
        <fieldset>
          <legend>Known Runes ({{ knownRunes().length }})</legend>
          <div class="rune-list">
            @for (rune of knownRunes(); track rune.id) {
              <div class="rune-entry">
                <div class="rune-header">
                  <span class="rune-symbol">{{ rune.symbol }}</span>
                  <span class="rune-name">{{ rune.name }}</span>
                  <span class="rune-element">[{{ rune.damageType }}]</span>
                </div>
                <div class="rune-desc">{{ rune.description }}</div>
                <div class="rune-effect">
                  Effect: {{ getEffectDescription(rune.effect.type) }}
                </div>
              </div>
            } @empty {
              <div class="empty-msg">No runes discovered yet...</div>
            }
          </div>
        </fieldset>

        <!-- Undiscovered Runes -->
        <fieldset class="mt-2">
          <legend>Undiscovered Runes</legend>
          <div class="rune-list">
            @for (rune of undiscoveredRunes; track rune.id) {
              <div class="rune-entry undiscovered">
                <div class="rune-header">
                  <span class="rune-symbol">[?]</span>
                  <span class="rune-name">???</span>
                  <span class="rune-element">[{{ rune.damageType }}]</span>
                </div>
                <div class="rune-desc">Research to unlock this rune.</div>
              </div>
            }
          </div>
        </fieldset>
      </div>
    </app-window>
  `,
  styles: [`
    .runebook-content {
      display: flex;
      flex-direction: column;
      max-height: 450px;
      overflow-y: auto;
    }
    .runebook-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }
    .rune-list {
      max-height: 180px;
      overflow-y: auto;
    }
    .rune-entry {
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #808080;
      background-color: #e8e8ff;
      &.undiscovered { background-color: #e0e0e0; opacity: 0.7; }
    }
    .rune-header {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .rune-symbol { font-family: 'Courier New', monospace; color: #000080; font-weight: bold; }
    .rune-name { font-weight: bold; }
    .rune-element { font-size: 9px; color: #606060; margin-left: auto; }
    .rune-desc { font-size: 10px; color: #404040; margin: 2px 0; }
    .rune-effect { font-size: 10px; color: #006600; font-style: italic; }
    .empty-msg { color: #808080; font-style: italic; padding: 8px; text-align: center; }
  `]
})
export class RunebookComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly knownRunes = this.gameState.knownRunes;

  get undiscoveredRunes() {
    const known = new Set(this.knownRunes().map(r => r.id));
    return Object.values(RUNES).filter(r => !known.has(r.id));
  }

  getEffectDescription(type: string): string {
    const descriptions: Record<string, string> = {
      damage: 'Deals direct damage',
      heal: 'Restores health',
      dot: 'Damage over time',
      hot: 'Healing over time',
      buff: 'Increases a stat',
      debuff: 'Decreases enemy stat',
      lifesteal: 'Damage that heals you',
      shield: 'Absorbs damage',
      manaDrain: 'Restores mana on hit',
      execute: 'Bonus vs low HP',
      crit: 'Chance to double damage',
      stun: 'Briefly stuns enemy',
      slow: 'Slows enemy actions',
      piercing: 'Ignores some armor',
      splash: 'Hits multiple targets',
      chain: 'Jumps between enemies',
    };
    return descriptions[type] || 'Special effect';
  }

  onClose(): void { this.closed.emit(); }
}
