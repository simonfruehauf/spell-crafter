import { Component, inject, output, computed, signal, effect, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { AlchemyRecipe, ResourceCost } from '../../core/models/game.interfaces';
import { RESOURCE_NAMES } from '../../core/models/resources.data';

@Component({
  selector: 'app-alchemy',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Alembic" 
      windowId="alchemy"
      [initialX]="350" 
      [initialY]="120" 
      [width]="380"
      (closed)="onClose()">
      <div class="alchemy-content">
        <div class="alchemy-description">
          <p>Transmute creature parts and reagents into elemental essences.</p>
        </div>

        @if (isCrafting()) {
          <div class="progress-section">
            <div class="progress-label">Transmuting {{ activeRecipeName() }}...</div>
            <div class="progress-container">
              <div class="progress-bar" [style.width.%]="progressPercent()"></div>
            </div>
            <div class="progress-time">{{ remainingSeconds() }}s remaining</div>
            <button class="btn btn-cancel" (click)="cancel()">[X] Cancel</button>
          </div>
        } @else {
          <div class="recipe-list">
            @for (recipe of recipes(); track recipe.id) {
              <div class="recipe-item">
                <div class="recipe-header">
                  <span class="recipe-name">{{ recipe.name }}</span>
                  <span class="recipe-time">[{{ recipe.craftTimeMs / 1000 }}s]</span>
                </div>
                <div class="recipe-desc">{{ recipe.description }}</div>
                <div class="recipe-io">
                  <div class="recipe-inputs">
                    <span class="io-label">Requires:</span>
                    @for (cost of recipe.inputs; track cost.resourceId) {
                      <span class="cost-item" [class.affordable]="hasResource(cost)">
                        {{ cost.amount }}x {{ getResourceName(cost.resourceId) }}
                      </span>
                    }
                  </div>
                  <div class="recipe-outputs">
                    @if (recipe.outputs && recipe.outputs.length > 0) {
                      <span class="io-label">Yields:</span>
                      @for (output of recipe.outputs; track output.resourceId) {
                        <span class="output-item">
                          {{ output.amount }}x {{ getResourceName(output.resourceId) }}
                        </span>
                      }
                    } @else if (recipe.possibleOutputs && recipe.possibleOutputs.length > 0) {
                      <span class="io-label">Chance of:</span>
                      @for (po of recipe.possibleOutputs; track $index) {
                        @for (output of po.outputs; track output.resourceId) {
                          <span class="output-item random">
                            {{ output.amount }}x {{ getResourceName(output.resourceId) }}
                          </span>
                        }
                      }
                    }
                  </div>
                </div>
                <button 
                  class="btn btn-transmute"
                  [disabled]="!canCraft(recipe)"
                  (click)="transmute(recipe.id)">
                  [~] Transmute
                </button>
              </div>
            }
          </div>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .alchemy-content {
      display: flex;
      flex-direction: column;
      max-height: 450px;
      overflow-y: auto;
    }
    .alchemy-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
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
      justify-content: space-between;
      font-weight: bold;
    }
    .recipe-name { color: #000080; }
    .recipe-time { font-size: 9px; color: #606060; }
    .recipe-desc { 
      font-size: 10px; 
      color: #404040; 
      margin: 2px 0 4px 0; 
    }
    .recipe-io {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin: 4px 0;
    }
    .recipe-inputs, .recipe-outputs {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      font-size: 10px;
    }
    .io-label {
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
    }
    .output-item {
      padding: 1px 4px;
      background-color: #cce0ff;
      border: 1px solid #8899cc;
      &.random {
        background-color: #ffe0cc;
        border-color: #cc9988;
      }
    }
    .btn-transmute {
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
        navy 0px, navy 8px, 
        #c0c0c0 8px, #c0c0c0 10px
      );
      height: 100%;
      /* No transition - steps discretely like Win95 */
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
export class AlchemyComponent implements OnDestroy {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly recipes = this.gameState.alchemyRecipes;
  readonly resources = this.gameState.resources;
  readonly alchemy = this.gameState.alchemy;

  // Tick signal for progress updates (updated every 100ms while crafting)
  private readonly tick = signal(0);
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  readonly isCrafting = computed(() => this.alchemy().activeRecipeId !== null);

  readonly activeRecipeName = computed(() => {
    const recipeId = this.alchemy().activeRecipeId;
    if (!recipeId) return '';
    const recipe = this.recipes().find(r => r.id === recipeId);
    return recipe?.name ?? '';
  });

  readonly progressPercent = computed(() => {
    this.tick(); // Depend on tick for reactive updates
    const a = this.alchemy();
    if (!a.activeRecipeId) return 0;
    const total = a.craftEndTime - a.craftStartTime;
    const elapsed = Date.now() - a.craftStartTime;
    return Math.min(100, (elapsed / total) * 100);
  });

  readonly remainingSeconds = computed(() => {
    this.tick(); // Depend on tick for reactive updates
    const a = this.alchemy();
    if (!a.activeRecipeId) return 0;
    const remaining = Math.max(0, a.craftEndTime - Date.now());
    return Math.ceil(remaining / 1000);
  });

  constructor() {
    // Effect to start/stop tick interval when crafting state changes
    effect(() => {
      if (this.isCrafting()) {
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

  canCraft(recipe: AlchemyRecipe): boolean {
    return recipe.unlocked && recipe.inputs.every(c => this.hasResource(c));
  }

  transmute(recipeId: string): void {
    this.gameState.startAlchemy(recipeId);
  }

  cancel(): void {
    this.gameState.cancelAlchemy();
  }

  onClose(): void {
    this.closed.emit();
  }
}
