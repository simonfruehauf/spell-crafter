import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
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
          <div class="stat-row">
            <span>Base Damage:</span><span>{{ calculatedDamage() }}</span>
          </div>
          <div class="stat-row">
            <span>Damage Types:</span><span>{{ damageTypes().join(', ') || 'None' }}</span>
          </div>
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

        <!-- Name & Actions -->
        <div class="spell-name mt-1 d-flex gap-2 align-center">
          <label>Name:</label>
          <input type="text" [(ngModel)]="spellName" placeholder="Spell name..." style="flex: 1;">
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
      padding: 8px; border: 1px solid #808080;
      background-color: #ffffcc; margin-bottom: 8px; font-style: italic;
    }
    .crafting-area { display: flex; }
    .rune-list, .spell-assembly { flex: 1; }
    .section-header {
      background-color: #000080; color: white;
      padding: 2px 6px; font-weight: bold; margin-bottom: 4px;
      font-family: 'Courier New', monospace;
    }
    .rune-item {
      display: flex; gap: 4px; font-family: 'Courier New', monospace;
      .rune-symbol { color: #000080; }
      .rune-type { font-size: 9px; color: #606060; margin-left: auto; }
    }
    .spell-slots {
      padding: 4px; display: flex; flex-wrap: wrap;
      align-content: flex-start; gap: 4px;
      height: 130px; overflow-y: auto;
    }
    .spell-slot {
      display: inline-flex; padding: 2px 6px;
      background-color: #e0e0ff; border: 1px solid #8080ff;
      cursor: pointer; font-size: 11px; font-family: 'Courier New', monospace;
      &:hover { background-color: #ffcccc; }
    }
    .rune-item.disabled {
      opacity: 0.5; cursor: not-allowed;
    }
    .empty-msg { color: #808080; font-style: italic; padding: 8px; text-align: center; }
    .stat-row { display: flex; justify-content: space-between; font-size: 11px; }
    .cost-list { display: flex; flex-wrap: wrap; gap: 4px; font-size: 10px; }
    .cost-item {
      padding: 1px 4px; background-color: #ffcccc;
      &.affordable { background-color: #ccffcc; }
    }
    .spell-item {
      display: flex; align-items: center; gap: 6px;
      font-family: 'Courier New', monospace;
      .spell-symbol { color: #000080; }
      .spell-name { font-weight: bold; }
      .spell-stats { font-size: 10px; color: #606060; flex: 1; }
    }
    .btn-tiny {
      padding: 0 4px; font-size: 10px; font-family: 'Courier New', monospace;
      background-color: #c0c0c0; border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff; cursor: pointer;
    }
  `]
})
export class SpellCraftingComponent {
  @Output() closed = new EventEmitter<void>();
  private gameState = inject(GameStateService);

  readonly knownRunes = this.gameState.knownRunes;
  readonly craftedSpells = this.gameState.craftedSpells;
  readonly resources = this.gameState.resources;
  readonly player = this.gameState.player;

  readonly selectedRunes = signal<Rune[]>([]);
  spellName = '';

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
  }

  canCraft(): boolean {
    if (!this.selectedRunes().length || !this.spellName.trim()) return false;
    return this.aggregateMaterialCost().every(c => this.canAfford(c));
  }

  craftSpell(): void {
    if (!this.canCraft()) return;
    this.gameState.craftSpell(this.spellName.trim(), this.selectedRunes(), this.aggregateMaterialCost());
    this.clear();
  }

  deleteSpell(spell: Spell): void {
    this.gameState.deleteSpell(spell.id);
  }

  onClose(): void { this.closed.emit(); }
}
