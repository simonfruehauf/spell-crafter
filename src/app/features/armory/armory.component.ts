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
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white);
      color: var(--win95-black);
      margin-bottom: 8px;
      font-style: italic;
    }
    .filter-bar {
      margin-bottom: 8px;
      padding: 4px 8px;
      background-color: var(--win95-light-gray);
      border: 1px solid var(--win95-dark-gray);
    }
    .filter-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      cursor: pointer;
      color: var(--win95-black);
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
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-light-gray);
      &.crafted { 
        background-color: var(--win95-white); // Simplified for theme support
        border: 1px dashed var(--win95-dark-gray); // Visual distinction
      }
    }
    .recipe-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .recipe-name {
      // Use standard colors or theme variables if possible, otherwise keep hardcoded but ensure contrast
      &.mundane { color: var(--win95-black); }
      &.elevated { color: #008800; } // Consider varying by theme, but fine for now on light-gray
      &.exceptional { color: #0044cc; } // Slightly darker for better contrast
      &.primal { color: #8800bb; }
      &.epochal { color: #cc5500; }
      &.unique { color: #bb0055; font-weight: bold; }
    }
    // High contrast adjustments for dark mode could be done via more complex CSS or just acceptable mid-tones
    
    .recipe-rarity { font-size: 9px; color: var(--win95-dark-gray); }
    .recipe-desc { font-size: 10px; color: var(--win95-black); margin: 2px 0; }
    .recipe-bonuses {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 4px 0;
    }
    .bonus {
      font-size: 10px;
      padding: 1px 4px;
      // Use theme vars instead of hardcoded pale green
      background-color: var(--win95-white);
      border: 1px solid var(--win95-dark-gray);
      color: var(--win95-black);
      
      &.negative { 
         color: #cc0000;
         border-color: #cc0000;
      }
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
      background-color: var(--win95-white); // Keep consistent background
      border: 1px solid var(--win95-dark-gray);
      color: var(--win95-black);
      opacity: 0.7; // Fade out unaffordable? Or just plain style
      
      &.affordable { 
        opacity: 1;
        font-weight: bold;
        background-color: var(--win95-white);
        border-color: var(--win95-black);
      }
      // If we want red/green cues, use text color or border, not background
    }
    .btn-craft {
      padding: 2px 8px;
      font-size: 10px;
      background-color: var(--win95-gray);
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      color: var(--win95-black);
      cursor: pointer;
      &:disabled {
        color: var(--win95-dark-gray);
        cursor: not-allowed;
      }
      &:not(:disabled):hover { background-color: var(--win95-light-gray); }
      &:not(:disabled):active { border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray); }
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
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-light-gray);
      color: var(--win95-black);
      
      &.mundane { border-color: var(--win95-dark-gray); }
      &.elevated { border-color: #008800; }
      &.exceptional { border-color: #0066cc; }
      &.primal { border-color: #9900cc; }
      &.epochal { border-color: #cc6600; }
      &.unique { border-color: #cc0066; }
    }
    .item-slot { color: var(--win95-dark-gray); margin-left: 4px; }
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
