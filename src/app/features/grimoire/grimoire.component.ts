import { Component, inject, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-grimoire',
  standalone: true,
  imports: [CommonModule, WindowComponent, ConfirmationModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Grimoire" 
      windowId="grimoire"
      [initialX]="480" 
      [initialY]="40" 
      [width]="320"
      (closed)="onClose()">
      
      <!-- Content -->
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
                @if (!spell.isDefault) {
                  <button class="uncraft-btn" (click)="onUncraftClick(spell, $event)" title="Uncraft Spell (Recover 50% resources)">[x]</button>
                }
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

      <!-- Modal -->
      @if (uncraftTarget()) {
        <app-confirmation-modal
          title="Uncraft Spell"
          [message]="'Are you sure you want to uncraft ' + uncraftTarget()!.name + '? You will recover roughly 50% of the materials used.'"
          confirmText="Uncraft"
          cancelText="Cancel"
          (confirm)="confirmUncraft()"
          (cancel)="cancelUncraft()">
        </app-confirmation-modal>
      }
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
      background-color: var(--win95-white); // was #ffffcc
      color: var(--win95-black);
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
      background-color: var(--win95-light-gray); // was #f0f0ff
      color: var(--win95-black);
    }
    .spell-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      .spell-symbol { color: var(--win95-blue); }
      .spell-level { margin-left: auto; font-size: 10px; color: var(--win95-black); opacity: 0.7; }
      .uncraft-btn {
        background: none;
        border: none;
        color: #cc0000;
        cursor: pointer;
        font-size: 10px;
        padding: 0 2px;
        &:hover { font-weight: bold; }
      }
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
      color: var(--win95-black);
      opacity: 0.8;
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
      background-color: var(--win95-white); // was #e0e0ff
      border: 1px solid var(--win95-blue);
      color: var(--win95-black); 
      &.default { 
        background-color: var(--win95-white); // was #ffe0e0
        border-color: #cc0000; 
        color: var(--win95-black);
      }
    }
    .empty-msg { color: #808080; font-style: italic; padding: 8px; text-align: center; }
  `]
})
export class GrimoireComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly craftedSpells = this.gameState.craftedSpells;
  readonly player = this.gameState.player;

  // State for modal
  readonly uncraftTarget = signal<{ id: string; name: string } | null>(null);

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

  onUncraftClick(spell: { id: string; name: string }, event: Event): void {
    event.stopPropagation();
    this.uncraftTarget.set(spell);
  }

  confirmUncraft(): void {
    const target = this.uncraftTarget();
    if (target) {
      this.gameState.uncraftSpell(target.id);
      this.uncraftTarget.set(null);
    }
  }

  cancelUncraft(): void {
    this.uncraftTarget.set(null);
  }
}
