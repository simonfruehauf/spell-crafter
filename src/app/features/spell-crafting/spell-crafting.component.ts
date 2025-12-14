import { Component, inject, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Rune, Spell, ResourceCost } from '../../core/models/game.interfaces';
import { RESOURCE_NAMES } from '../../core/models/resources.data';

@Component({
  selector: 'app-spell-crafting',
  standalone: true,
  imports: [CommonModule, FormsModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Scriptorium" 
      windowId="scriptorium"
      [initialX]="30" 
      [initialY]="320" 
      [width]="440"
      (closed)="onClose()">
      <div class="scriptorium-content">
        <div class="scriptorium-description">
          <p>Combine runes to forge powerful incantations. Spells require materials.</p>
        </div>

        <div class="crafting-area d-flex gap-2">
          <!-- Runes -->
          <div class="rune-list">
            <div class="section-header">Known Runes</div>
            <div class="list-box" style="height: 130px;">
              @for (rune of knownRunes(); track rune.id) {
                <div class="list-item rune-item" 
                     [class.disabled]="isAtMaxRunes()"
                     (click)="addRune(rune)">
                  <span class="rune-symbol">{{ rune.symbol }}</span>
                  <span class="rune-name">{{ rune.name }}</span>
                  <span class="rune-type">[{{ rune.damageType }}]</span>
                </div>
              } @empty {
                <div class="empty-msg">No runes...</div>
              }
            </div>
          </div>

          <!-- Assembly -->
          <div class="spell-assembly">
            <div class="section-header">Assembly ({{ selectedRunes().length }}/{{ maxRunes() }})</div>
            <div class="inset spell-slots">
              @for (rune of selectedRunes(); track $index) {
                <div class="spell-slot" (click)="removeRune($index)">
                  {{ rune.symbol }} {{ rune.name }} [x]
                </div>
              } @empty {
                <div class="empty-msg">Click runes to add...</div>
              }
            </div>
          </div>
        </div>

        <!-- Spell Stats -->
        <fieldset class="mt-1">
          <legend>Spell Properties</legend>
          <div class="stat-row">
            <span>Mana Cost:</span><span>{{ totalManaCost() }}</span>
          </div>
          @if (calculatedHealing() > 0) {
            <div class="stat-row heal-stat">
              <span>Healing:</span><span>{{ calculatedHealing() }}</span>
            </div>
          }
          @if (calculatedDamage() > 0 || calculatedHealing() === 0) {
            <div class="stat-row">
              <span>Base Damage:</span><span>{{ calculatedDamage() }}</span>
            </div>
          }
          <div class="stat-row">
            <span>Damage Types:</span><span>{{ damageTypes().join(', ') || 'None' }}</span>
          </div>
          @if (hasSpecialEffects()) {
            <div class="stat-row">
              <span>Effects:</span><span>{{ specialEffects().join(', ') }}</span>
            </div>
          }
        </fieldset>

        <!-- Material Cost -->
        @if (selectedRunes().length > 0) {
          <fieldset class="mt-1">
            <legend>Material Cost</legend>
            <div class="cost-list">
              @for (cost of aggregateMaterialCost(); track cost.resourceId) {
                <span class="cost-item" [class.affordable]="canAfford(cost)">
                  {{ cost.amount }}x {{ getResourceName(cost.resourceId) }}
                </span>
              }
            </div>
          </fieldset>
        }

        <!-- Name & Symbol -->
        <div class="spell-name mt-1 d-flex gap-2 align-center">
          <label>Name:</label>
          <input type="text" [(ngModel)]="spellName" placeholder="Spell name..." style="flex: 1;">
          <label>Symbol:</label>
          <input type="text" [(ngModel)]="spellSymbol" placeholder="?" maxlength="1" style="width: 28px; text-align: center;">
        </div>

        <div class="actions mt-1 d-flex gap-2 justify-between">
          <button class="btn" (click)="clear()">Clear</button>
          <button class="btn" [disabled]="!canCraft()" (click)="craftSpell()">
            [*] Craft Spell
          </button>
        </div>

      </div>
    </app-window>
  `,
  styles: [`
    .scriptorium-content { display: flex; flex-direction: column; }
    .scriptorium-description {
      padding: 8px; border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white); color: var(--win95-black); margin-bottom: 8px; font-style: italic;
    }
    .crafting-area { display: flex; }
    .rune-list, .spell-assembly { flex: 1; }
    .section-header {
      background-color: var(--win95-blue); color: var(--win95-white);
      padding: 2px 6px; font-weight: bold; margin-bottom: 4px;
      font-family: 'Courier New', monospace;
    }
    .rune-item {
      display: flex; gap: 4px; font-family: 'Courier New', monospace;
      .rune-symbol { color: var(--win95-blue); }
      .rune-type { font-size: 9px; color: var(--win95-dark-gray); margin-left: auto; }
    }
    .spell-slots {
      padding: 4px; display: flex; flex-wrap: wrap;
      align-content: flex-start; gap: 4px;
      height: 130px; overflow-y: auto;
    }
    .spell-slot {
      display: inline-flex; padding: 2px 6px;
      background-color: var(--win95-light-gray); border: 1px solid var(--win95-blue);
      cursor: pointer; font-size: 11px; font-family: 'Courier New', monospace;
      color: var(--win95-black);
      &:hover { background-color: var(--win95-white); }
    }
    .rune-item.disabled {
      opacity: 0.5; cursor: not-allowed;
    }
    .empty-msg { color: var(--win95-dark-gray); font-style: italic; padding: 8px; text-align: center; }
    .stat-row { display: flex; justify-content: space-between; font-size: 11px; }
    .stat-row.heal-stat { color: #008000; }
    .cost-list { display: flex; flex-wrap: wrap; gap: 4px; font-size: 10px; }
    .cost-item {
      padding: 1px 4px; background-color: var(--win95-white); border: 1px solid var(--win95-dark-gray);
      color: var(--win95-black);
      &.affordable { border-color: var(--win95-blue); font-weight: bold; }
    }
    .spell-item {
      display: flex; align-items: center; gap: 6px;
      font-family: 'Courier New', monospace;
      .spell-symbol { color: var(--win95-blue); }
      .spell-name { font-weight: bold; }
      .spell-stats { font-size: 10px; color: var(--win95-dark-gray); flex: 1; }
    }
    .btn-tiny {
      padding: 0 4px; font-size: 10px; font-family: 'Courier New', monospace;
      background-color: var(--win95-gray); border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white); cursor: pointer;
    }
  `]
})
export class SpellCraftingComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly knownRunes = this.gameState.knownRunes;
  readonly craftedSpells = this.gameState.craftedSpells;
  readonly resources = this.gameState.resources;
  readonly player = this.gameState.player;

  readonly selectedRunes = signal<Rune[]>([]);
  spellName = '';
  spellSymbol = '';

  totalManaCost(): number {
    return this.selectedRunes().reduce((s, r) => s + r.manaCost, 0);
  }

  calculatedDamage(): number {
    const runes = this.selectedRunes();
    if (!runes.length) return 0;
    const base = runes.reduce((s, r) => s + r.baseDamage, 0);
    return Math.floor(base * (1 + this.player().ARC * 0.1));
  }

  damageTypes(): string[] {
    return [...new Set(this.selectedRunes().map(r => r.damageType))];
  }

  calculatedHealing(): number {
    const runes = this.selectedRunes();
    if (!runes.length) return 0;
    let healing = 0;
    for (const rune of runes) {
      if (rune.effect.type === 'heal' || rune.effect.type === 'hot' || rune.effect.type === 'lifesteal') {
        healing += rune.effect.value;
      }
    }
    // WIS bonus for healing
    return Math.floor(healing * (1 + this.player().WIS * 0.1));
  }

  hasSpecialEffects(): boolean {
    return this.selectedRunes().some(r =>
      ['buff', 'debuff', 'shield', 'stun', 'dot', 'hot'].includes(r.effect.type)
    );
  }

  specialEffects(): string[] {
    const effects: string[] = [];
    for (const rune of this.selectedRunes()) {
      switch (rune.effect.type) {
        case 'buff': effects.push(`+${rune.effect.value} ${rune.effect.targetStat || 'stat'}`); break;
        case 'debuff': effects.push(`-${rune.effect.value} enemy stat`); break;
        case 'shield': effects.push(`${rune.effect.value} shield`); break;
        case 'stun': effects.push(`${rune.effect.duration || 1}t stun`); break;
        case 'dot': effects.push(`${rune.effect.value}/t for ${rune.effect.duration || 3}t`); break;
        case 'hot': effects.push(`+${rune.effect.value} HP/t for ${rune.effect.duration || 3}t`); break;
      }
    }
    return effects;
  }

  aggregateMaterialCost(): ResourceCost[] {
    const costs: Record<string, number> = {};
    for (const rune of this.selectedRunes()) {
      for (const c of rune.craftCost) {
        costs[c.resourceId] = (costs[c.resourceId] || 0) + c.amount;
      }
    }
    return Object.entries(costs).map(([resourceId, amount]) => ({ resourceId, amount }));
  }

  canAfford(cost: ResourceCost): boolean {
    return (this.resources().crafting[cost.resourceId] || 0) >= cost.amount;
  }

  getResourceName(id: string): string {
    return RESOURCE_NAMES[id] || id;
  }

  maxRunes(): number {
    return this.gameState.getMaxRunesPerSpell();
  }

  isAtMaxRunes(): boolean {
    return this.selectedRunes().length >= this.maxRunes();
  }

  addRune(rune: Rune): void {
    if (this.isAtMaxRunes()) return;
    this.selectedRunes.update(r => [...r, rune]);
  }

  removeRune(idx: number): void {
    this.selectedRunes.update(r => r.filter((_, i) => i !== idx));
  }

  clear(): void {
    this.selectedRunes.set([]);
    this.spellName = '';
    this.spellSymbol = '';
  }

  canCraft(): boolean {
    if (!this.selectedRunes().length || !this.spellName.trim()) return false;
    return this.aggregateMaterialCost().every(c => this.canAfford(c));
  }

  craftSpell(): void {
    if (!this.canCraft()) return;
    const customSymbol = this.spellSymbol.trim() || undefined;
    this.gameState.craftSpell(this.spellName.trim(), this.selectedRunes(), this.aggregateMaterialCost(), customSymbol);
    this.clear();
  }

  deleteSpell(spell: Spell): void {
    this.gameState.deleteSpell(spell.id);
  }

  onClose(): void { this.closed.emit(); }
}
