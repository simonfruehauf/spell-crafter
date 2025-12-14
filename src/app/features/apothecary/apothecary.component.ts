import { Component, inject, output, computed, signal, effect, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Potion, ResourceCost } from '../../core/models/game.interfaces';
import { POTIONS, POTIONS_MAP } from '../../core/models/potions.data';
import { RESOURCE_NAMES } from '../../core/models/resources.data';

@Component({
  selector: 'app-apothecary',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Apothecary" 
      windowId="apothecary"
      [initialX]="400" 
      [initialY]="100" 
      [width]="360"
      (closed)="onClose()">
      <div class="apothecary-content">
        <div class="apothecary-description">
          <p>Brew potions from creature parts and mana. Potions can be used in combat after researching Combat Alchemy.</p>
        </div>

        <!-- Potion Inventory -->
        @if (hasPotions()) {
          <div class="inventory-section">
            <div class="section-header">Your Potions</div>
            <div class="inventory-list">
              @for (potion of potionsWithCount(); track potion.id) {
                <div class="inventory-item">
                  <span class="potion-symbol">{{ potion.symbol }}</span>
                  <span class="potion-name">{{ potion.name }}</span>
                  <span class="potion-count">x{{ potion.count }}</span>
                  <button class="btn-drink" (click)="drink(potion.id)" title="Drink potion">~drink!~</button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Brewing Progress -->
        @if (isBrewing()) {
          <div class="progress-section">
            <div class="progress-label">Brewing {{ activePotionName() }}...</div>
            <div class="progress-container">
              <div class="progress-bar" [style.width.%]="progressPercent()"></div>
            </div>
            <div class="progress-time">{{ remainingSeconds() }}s remaining</div>
            <button class="btn btn-cancel" (click)="cancel()">[X] Cancel</button>
          </div>
        } @else {
          <!-- Potion Recipes -->
          <div class="section-header">Brew Potions</div>
          <div class="filter-bar">
            <label class="filter-toggle">
              <input type="checkbox" [checked]="showCraftableOnly()" (change)="toggleCraftableFilter()">
              Show Craftable Only
            </label>
          </div>
          <div class="recipe-list">
            @for (potion of filteredPotions(); track potion.id) {
              <div class="recipe-item">
                <div class="recipe-header">
                  <span class="potion-symbol">{{ potion.symbol }}</span>
                  <span class="recipe-name">{{ potion.name }}</span>
                </div>
                <div class="recipe-desc">{{ potion.description }}</div>
                <div class="recipe-costs">
                  <span class="cost-label">Cost:</span>
                  @for (cost of potion.craftCost; track cost.resourceId) {
                    <span class="cost-item" [class.affordable]="hasResource(cost)">
                      {{ cost.amount }}x {{ getResourceName(cost.resourceId) }}
                    </span>
                  }
                  <span class="cost-item mana" [class.affordable]="hasManaCost(potion)">
                    {{ getManaCostDisplay(potion) }} mana
                  </span>
                </div>
                <button 
                  class="btn btn-brew"
                  [disabled]="!canBrew(potion)"
                  (click)="brew(potion.id)">
                  [~] Brew
                </button>
              </div>
            }
          </div>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .apothecary-content {
      display: flex;
      flex-direction: column;
      max-height: 500px;
      overflow-y: auto;
    }
    .apothecary-description {
      padding: 8px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white);
      color: var(--win95-black);
      margin-bottom: 8px;
      font-style: italic;
      font-size: 11px;
    }
    .section-header {
      background-color: var(--win95-blue);
      color: var(--win95-white);
      padding: 2px 6px;
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 4px;
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
    .inventory-section {
      margin-bottom: 8px;
    }
    .inventory-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 4px;
      background: var(--win95-white);
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    }
    .inventory-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      background-color: var(--win95-light-gray);
      border: 1px solid var(--win95-dark-gray);
      color: var(--win95-black);
      font-size: 10px;
    }
    .potion-symbol { color: var(--win95-blue); }
    .potion-count { font-weight: bold; color: #008800; } // Keep green but consistent
    .btn-drink {
      margin-left: auto;
      padding: 0 4px;
      font-size: 10px;
      background-color: var(--win95-gray);
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      cursor: pointer;
      color: var(--win95-blue);
      font-weight: bold;
      &:hover { background-color: var(--win95-light-gray); }
      &:active { border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray); }
    }
    .recipe-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .recipe-item {
      padding: 6px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-light-gray);
    }
    .recipe-header {
      display: flex;
      gap: 6px;
      font-weight: bold;
    }
    .recipe-name { color: var(--win95-blue); }
    .recipe-desc { 
      font-size: 10px; 
      color: var(--win95-black); 
      margin: 2px 0 4px 0; 
    }
    .recipe-costs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      font-size: 10px;
      margin-bottom: 4px;
    }
    .cost-label {
      font-weight: bold;
      color: var(--win95-black);
    }
    .cost-item {
      padding: 1px 4px;
      // Theme aware: use white background, black text
      background-color: var(--win95-white);
      border: 1px solid var(--win95-dark-gray);
      color: var(--win95-black);
      
      &.affordable { 
        background-color: var(--win95-white); 
        border-color: var(--win95-blue); // Blue border for affordable/active
        font-weight: bold;
      }
      &.mana {
        // Special styling for mana if desired, but keep it readable
        border-color: var(--win95-blue);
        color: var(--win95-blue);
        &.affordable {
          font-weight: bold;
        }
      }
    }
    .btn-brew {
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
    
    /* Progress section - Win95 style */
    .progress-section {
      padding: 12px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-gray);
      text-align: center;
    }
    .progress-label {
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--win95-blue);
    }
    .progress-container {
      background: var(--win95-white);
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      height: 20px;
      padding: 2px;
      margin-bottom: 4px;
    }
    .progress-bar {
      background: repeating-linear-gradient(
        90deg, 
        var(--win95-blue) 0px, var(--win95-blue) 8px, 
        var(--win95-gray) 8px, var(--win95-gray) 10px
      );
      height: 100%;
    }
    .progress-time {
      font-size: 10px;
      color: var(--win95-black);
      margin-bottom: 8px;
    }
    .btn-cancel {
      padding: 2px 8px;
      font-size: 10px;
      background-color: var(--win95-gray);
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      color: var(--win95-black);
      cursor: pointer;
      &:hover { background-color: var(--win95-light-gray); }
      &:active { border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray); }
    }
  `]
})
export class ApothecaryComponent implements OnDestroy {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly potions = POTIONS;
  readonly resources = this.gameState.resources;
  readonly potionInventory = this.gameState.potions;
  readonly brewing = this.gameState.brewing;

  readonly showCraftableOnly = signal(false);

  // Tick signal for progress updates
  private readonly tick = signal(0);
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  readonly isBrewing = computed(() => this.brewing().activePotionId !== null);

  readonly activePotionName = computed(() => {
    const potionId = this.brewing().activePotionId;
    if (!potionId) return '';
    const potion = POTIONS_MAP[potionId];
    return potion?.name ?? '';
  });

  readonly progressPercent = computed(() => {
    this.tick(); // Depend on tick for reactive updates
    const b = this.brewing();
    if (!b.activePotionId) return 0;
    const total = b.brewEndTime - b.brewStartTime;
    const elapsed = Date.now() - b.brewStartTime;
    return Math.min(100, (elapsed / total) * 100);
  });

  readonly remainingSeconds = computed(() => {
    this.tick();
    const b = this.brewing();
    if (!b.activePotionId) return 0;
    const remaining = Math.max(0, b.brewEndTime - Date.now());
    return Math.ceil(remaining / 1000);
  });

  readonly hasPotions = computed(() => {
    const inv = this.potionInventory();
    return Object.values(inv).some(count => count > 0);
  });

  readonly potionsWithCount = computed(() => {
    const inv = this.potionInventory();
    return POTIONS
      .filter(p => inv[p.id] > 0)
      .map(p => ({ ...p, count: inv[p.id] }));
  });

  readonly filteredPotions = computed(() => {
    if (!this.showCraftableOnly()) return POTIONS;
    return POTIONS.filter(p => this.canBrew(p));
  });

  constructor() {
    effect(() => {
      if (this.isBrewing()) {
        this.startTicking();
      } else {
        this.stopTicking();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopTicking();
  }

  private startTicking(): void {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => {
      this.tick.update(t => t + 1);
    }, 100);
  }

  private stopTicking(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  getResourceName(id: string): string {
    return RESOURCE_NAMES[id] || id;
  }

  hasResource(cost: ResourceCost): boolean {
    return (this.resources().crafting[cost.resourceId] || 0) >= cost.amount;
  }

  getManaCost(potion: Potion): number {
    if (potion.manaCostPercent && potion.manaCostPercent > 0) {
      return Math.floor(this.resources().maxMana * (potion.manaCostPercent / 100));
    }
    return potion.manaCost;
  }

  getManaCostDisplay(potion: Potion): string {
    if (potion.manaCostPercent && potion.manaCostPercent > 0) {
      return `${potion.manaCostPercent}%`;
    }
    return String(potion.manaCost);
  }

  hasManaCost(potion: Potion): boolean {
    return this.resources().mana >= this.getManaCost(potion);
  }

  canBrew(potion: Potion): boolean {
    if (this.isBrewing()) return false;
    const hasMaterials = potion.craftCost.every(c => this.hasResource(c));
    const hasMana = this.hasManaCost(potion);
    return hasMaterials && hasMana;
  }

  brew(potionId: string): void {
    this.gameState.startBrewing(potionId);
  }

  cancel(): void {
    this.gameState.cancelBrewing();
  }

  drink(potionId: string): void {
    this.gameState.drinkPotion(potionId);
  }

  toggleCraftableFilter(): void {
    this.showCraftableOnly.update(v => !v);
  }

  onClose(): void {
    this.closed.emit();
  }
}
