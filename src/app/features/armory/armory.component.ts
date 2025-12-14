import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { EquipmentRecipe, ResourceCost, EquipmentSlot } from '../../core/models/game.interfaces';
import { RESOURCE_NAMES } from '../../core/models/resources.data';
import { EQUIPMENT_SLOT_NAMES, EQUIPMENT_BONUS_NAMES } from '../../core/models/equipment.data';

@Component({
  selector: 'app-armory',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Armory" 
      windowId="armory"
      [initialX]="300" 
      [initialY]="100" 
      [width]="420"
      (closed)="onClose()">
      <div class="armory-content">
        <div class="armory-description">
          <p>Forge magical equipment from collected materials.</p>
        </div>

        <div class="filter-bar">
          <label class="filter-toggle">
            <input type="checkbox" [checked]="showCraftableOnly()" (change)="toggleCraftableFilter()">
            Show Craftable Only
          </label>
        </div>

        <div class="recipe-list">
          @for (slot of slots; track slot.id) {
            <fieldset class="slot-section">
              <legend>{{ slot.name }}</legend>
              @for (recipe of getRecipesBySlot(slot.id); track recipe.id) {
                <div class="recipe-item" [class.crafted]="hasCrafted(recipe)">
                  <div class="recipe-header">
                    <span class="recipe-name" [class]="recipe.resultItem.rarity">
                      {{ recipe.resultItem.name }}
                    </span>
                    <span class="recipe-rarity">[{{ recipe.resultItem.rarity }}]</span>
                  </div>
                  <div class="recipe-desc">{{ recipe.resultItem.description }}</div>
                  <div class="recipe-bonuses">
                    @for (bonus of recipe.resultItem.bonuses; track $index) {
                      <span class="bonus" [class.negative]="bonus.value < 0">
                        {{ formatBonus(bonus) }}
                      </span>
                    }
                  </div>
                  <div class="recipe-cost">
                    @for (cost of recipe.cost; track cost.resourceId) {
                      <span class="cost-item" [class.affordable]="hasResource(cost)">
                        {{ cost.amount }}x {{ getResourceName(cost.resourceId) }}
                      </span>
                    }
                  </div>
                  <button 
                    class="btn btn-craft"
                    [disabled]="!canCraft(recipe)"
                    (click)="craft(recipe.id)">
                    [+] Forge
                  </button>
                </div>
              }
            </fieldset>
          }
        </div>

        @if (craftedEquipment().length > 0) {
          <fieldset class="crafted-section">
            <legend>Crafted Equipment ({{ craftedEquipment().length }})</legend>
            <div class="crafted-list">
              @for (item of craftedEquipment(); track $index) {
                <div class="crafted-item" [class]="item.rarity">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-slot">[{{ getSlotName(item.slot) }}]</span>
                </div>
              }
            </div>
          </fieldset>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .armory-content {
      display: flex;
      flex-direction: column;
      max-height: 450px;
      overflow-y: auto;
    }
    .armory-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }
    .filter-bar {
      margin-bottom: 8px;
      padding: 4px 8px;
      background-color: #d4d0c8;
      border: 1px solid #808080;
    }
    .filter-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      cursor: pointer;
    }
    .filter-toggle input {
      cursor: pointer;
    }
    .slot-section {
      margin: 4px 0;
      padding: 4px 8px;
    }
    .recipe-item {
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #808080;
      background-color: #e0e0e0;
      &.crafted { background-color: #d0ffd0; }
    }
    .recipe-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .recipe-name {
      &.mundane { color: #404040; }
      &.elevated { color: #008800; }
      &.exceptional { color: #0066cc; }
      &.primal { color: #9900cc; }
      &.epochal { color: #cc6600; }
      &.unique { color: #cc0066; font-weight: bold; }
    }
    .recipe-rarity { font-size: 9px; color: #606060; }
    .recipe-desc { font-size: 10px; color: #404040; margin: 2px 0; }
    .recipe-bonuses {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 4px 0;
    }
    .bonus {
      font-size: 10px;
      padding: 1px 4px;
      background-color: #ccffcc;
      border: 1px solid #88cc88;
      &.negative { background-color: #ffcccc; border-color: #cc8888; }
    }
    .recipe-cost {
      font-size: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 4px 0;
    }
    .cost-item {
      padding: 1px 4px;
      background-color: #ffcccc;
      &.affordable { background-color: #ccffcc; }
    }
    .btn-craft {
      padding: 2px 8px;
      font-size: 10px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      &:disabled {
        color: #808080;
        cursor: not-allowed;
      }
      &:not(:disabled):hover { background-color: #d0d0d0; }
      &:not(:disabled):active { border-color: #808080 #ffffff #ffffff #808080; }
    }
    .crafted-section { margin-top: 8px; }
    .crafted-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .crafted-item {
      font-size: 10px;
      padding: 2px 6px;
      border: 1px solid #808080;
      background-color: #f0f0f0;
      &.mundane { border-color: #808080; }
      &.elevated { border-color: #008800; background-color: #e8ffe8; }
      &.exceptional { border-color: #0066cc; background-color: #e8f0ff; }
      &.primal { border-color: #9900cc; background-color: #f8e8ff; }
      &.epochal { border-color: #cc6600; background-color: #fff8e8; }
      &.unique { border-color: #cc0066; background-color: #ffe8f0; }
    }
    .item-slot { color: #606060; margin-left: 4px; }
  `]
})
export class ArmoryComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly recipes = this.gameState.equipmentRecipes;
  readonly resources = this.gameState.resources;
  readonly craftedEquipment = this.gameState.craftedEquipment;

  readonly showCraftableOnly = signal(false);

  readonly slots: { id: EquipmentSlot; name: string }[] = [
    { id: 'head', name: 'Head' },
    { id: 'face', name: 'Face' },
    { id: 'accessory', name: 'Accessory' },
    { id: 'body', name: 'Body' },
    { id: 'handL', name: 'Left Hand' },
    { id: 'handR', name: 'Right Hand' },
    { id: 'relic', name: 'Relic' },
  ];

  getRecipesBySlot(slot: EquipmentSlot): EquipmentRecipe[] {
    let recipes = this.recipes().filter(r => r.resultItem.slot === slot && r.unlocked);
    if (this.showCraftableOnly()) {
      recipes = recipes.filter(r => !this.hasCrafted(r) && this.canCraft(r));
    }
    return recipes;
  }

  toggleCraftableFilter(): void {
    this.showCraftableOnly.update(v => !v);
  }

  getResourceName(id: string): string {
    return RESOURCE_NAMES[id] || id;
  }

  getSlotName(slot: EquipmentSlot): string {
    return EQUIPMENT_SLOT_NAMES[slot] || slot;
  }

  hasResource(cost: ResourceCost): boolean {
    return (this.resources().crafting[cost.resourceId] || 0) >= cost.amount;
  }

  canCraft(recipe: EquipmentRecipe): boolean {
    return recipe.cost.every(c => this.hasResource(c));
  }

  hasCrafted(recipe: EquipmentRecipe): boolean {
    return this.craftedEquipment().some(i => i.id === recipe.resultItem.id) ||
      Object.values(this.gameState.equippedItems()).some(i => i?.id === recipe.resultItem.id);
  }

  formatBonus(bonus: { type: string; stat?: string; value: number }): string {
    const sign = bonus.value >= 0 ? '+' : '';
    if (bonus.type === 'stat' && bonus.stat) {
      return `${sign}${bonus.value} ${bonus.stat}`;
    }
    const name = EQUIPMENT_BONUS_NAMES[bonus.type] || bonus.type;
    const isPercent = ['damagePercent', 'critChance', 'critDamage', 'lootChance', 'lootQuantity'].includes(bonus.type);
    return `${sign}${bonus.value}${isPercent ? '%' : ''} ${name}`;
  }

  craft(recipeId: string): void {
    this.gameState.craftEquipment(recipeId);
  }

  onClose(): void {
    this.closed.emit();
  }
}
