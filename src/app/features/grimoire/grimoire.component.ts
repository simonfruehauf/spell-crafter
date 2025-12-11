import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
    selector: 'app-grimoire',
    standalone: true,
    imports: [CommonModule, WindowComponent],
    template: `
    <app-window 
      title="Grimoire" 
      windowId="grimoire"
      [initialX]="480" 
      [initialY]="40" 
      [width]="320"
      (closed)="onClose()">
      <div class="grimoire-content">
        <div class="grimoire-description">
          <p>Your bound spells and their mastery.</p>
        </div>

        <div class="spell-list">
          @for (spell of craftedSpells(); track spell.id) {
            <div class="spell-entry">
              <div class="spell-header">
                <span class="spell-symbol">{{ spell.symbol }}</span>
                <span class="spell-name">{{ spell.name }}</span>
                <span class="spell-level">Lv.{{ spell.level }}</span>
              </div>
              <div class="spell-xp-bar">
                <div class="xp-fill" [style.width.%]="getXpPercent(spell)"></div>
                <span class="xp-text">{{ spell.experience }}/{{ getXpToLevel(spell) }} XP</span>
              </div>
              <div class="spell-stats">
                <span>Mana: {{ spell.totalManaCost }}</span>
                <span>Dmg: {{ getSpellDamage(spell) }}</span>
                <span>{{ spell.damageTypes.join(', ') }}</span>
              </div>
              <div class="spell-effects">
                @for (rune of spell.runes; track $index) {
                  <span class="effect-tag">{{ rune.name }}: {{ rune.effect.type }}</span>
                }
                @if (spell.isDefault) {
                  <span class="effect-tag default">Basic Attack</span>
                }
              </div>
            </div>
          } @empty {
            <div class="empty-msg">No spells bound...</div>
          }
        </div>
      </div>
    </app-window>
  `,
    styles: [`
    .grimoire-content {
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow-y: auto;
    }
    .grimoire-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }
    .spell-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .spell-entry {
      padding: 6px;
      border: 1px solid #808080;
      background-color: #f0f0ff;
    }
    .spell-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      .spell-symbol { color: #000080; }
      .spell-level { margin-left: auto; font-size: 10px; color: #606060; }
    }
    .spell-xp-bar {
      position: relative;
      height: 12px;
      background-color: #e0e0e0;
      border: 1px inset #808080;
      margin: 4px 0;
    }
    .xp-fill {
      height: 100%;
      background: linear-gradient(180deg, #8080ff 0%, #4040cc 100%);
    }
    .xp-text {
      position: absolute;
      top: 0; left: 0; right: 0;
      text-align: center;
      font-size: 9px;
      line-height: 12px;
      color: #000;
    }
    .spell-stats {
      display: flex;
      gap: 8px;
      font-size: 10px;
      color: #404040;
    }
    .spell-effects {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      margin-top: 3px;
    }
    .effect-tag {
      font-size: 9px;
      padding: 1px 4px;
      background-color: #e0e0ff;
      border: 1px solid #8080cc;
      &.default { background-color: #ffe0e0; border-color: #cc8080; }
    }
    .empty-msg { color: #808080; font-style: italic; padding: 8px; text-align: center; }
  `]
})
export class GrimoireComponent {
    @Output() closed = new EventEmitter<void>();
    private gameState = inject(GameStateService);
    readonly craftedSpells = this.gameState.craftedSpells;
    readonly player = this.gameState.player;

    getXpPercent(spell: { experience: number; level: number }): number {
        const xpToLevel = spell.level * 50;
        return Math.min(100, (spell.experience / xpToLevel) * 100);
    }

    getXpToLevel(spell: { level: number }): number {
        return spell.level * 50;
    }

    getSpellDamage(spell: { calculatedDamage: number; level: number }): number {
        // Level bonus: +10% per level
        return Math.floor(spell.calculatedDamage * (1 + (spell.level - 1) * 0.1));
    }

    onClose(): void { this.closed.emit(); }
}
