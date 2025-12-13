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
          <div class="recipe-list">
            @for (potion of potions; track potion.id) {
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
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
      font-size: 11px;
    }
    .section-header {
      background-color: #800080;
      color: white;
      padding: 2px 6px;
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 4px;
    }
    .inventory-section {
      margin-bottom: 8px;
    }
    .inventory-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      padding: 4px;
      background: white;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
    }
    .inventory-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      background-color: #e0ffe0;
      border: 1px solid #80c080;
      font-size: 10px;
    }
    .potion-symbol { color: #800080; }
    .potion-count { font-weight: bold; color: #008000; }
    .btn-drink {
      margin-left: auto;
      padding: 0 4px;
      font-size: 10px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      color: #800080;
      font-weight: bold;
      &:hover { background-color: #d0d0d0; }
      &:active { border-color: #808080 #ffffff #ffffff #808080; }
    }
    .recipe-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .recipe-item {
      padding: 6px;
      border: 1px solid #808080;
      background-color: #e0e0e0;
    }
    .recipe-header {
      display: flex;
      gap: 6px;
      font-weight: bold;
    }
    .recipe-name { color: #000080; }
    .recipe-desc { 
      font-size: 10px; 
      color: #404040; 
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
      color: #404040;
    }
    .cost-item {
      padding: 1px 4px;
      background-color: #ffcccc;
      border: 1px solid #cc8888;
      &.affordable { 
        background-color: #ccffcc; 
        border-color: #88cc88;
      }
      &.mana {
        background-color: #ccccff;
        border-color: #8888cc;
        &.affordable {
          background-color: #ccccff;
          border-color: #8888cc;
        }
      }
    }
    .btn-brew {
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
    
    /* Progress section - Win95 style */
    .progress-section {
      padding: 12px;
      border: 1px solid #808080;
      background-color: #c0c0c0;
      text-align: center;
    }
    .progress-label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #800080;
    }
    .progress-container {
      background: #ffffff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
      height: 20px;
      padding: 2px;
      margin-bottom: 4px;
    }
    .progress-bar {
      background: repeating-linear-gradient(
        90deg, 
        #800080 0px, #800080 8px, 
        #c0c0c0 8px, #c0c0c0 10px
      );
      height: 100%;
    }
    .progress-time {
      font-size: 10px;
      color: #404040;
      margin-bottom: 8px;
    }
    .btn-cancel {
      padding: 2px 8px;
      font-size: 10px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      &:hover { background-color: #d0d0d0; }
      &:active { border-color: #808080 #ffffff #ffffff #808080; }
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

  onClose(): void {
    this.closed.emit();
  }
}
