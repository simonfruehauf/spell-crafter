import { Component, inject, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { getResourcesByCategory } from '../../core/models/resources.data';
import { ResourceCategory, ResourceDef } from '../../core/models/game.interfaces';

/** Pre-computed category display data with resource amounts */
interface CategoryDisplayData {
  id: ResourceCategory;
  name: string;
  resources: (ResourceDef & { amount: number })[];
  count: number;
  hasResources: boolean;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Vault" 
      windowId="inventory"
      [initialX]="720" 
      [initialY]="40" 
      [width]="300"
      (closed)="onClose()">
      <div class="inventory-content">
        <div class="inventory-description">
          <p>Your collection of magical reagents.</p>
        </div>

        <div class="gold-display">
          <span class="label">(o) Gold:</span>
          <span class="value">{{ resources().gold }}</span>
        </div>

        <div class="resources-section mt-1">
          <!-- ⚡ Uses pre-computed categoryData signal - no function calls in template -->
          @for (cat of categoryData(); track cat.id) {
            <fieldset>
              <legend>{{ cat.name }} ({{ cat.count }})</legend>
              @for (res of cat.resources; track res.id) {
                <div class="resource-row" [class.rarity]="res.rarity">
                  <span class="resource-name" [class]="res.rarity">{{ res.name }}</span>
                  <span class="resource-amount">{{ res.amount }}</span>
                </div>
              }
            </fieldset>
          }
        </div>

        @if (totalResources() === 0) {
          <div class="empty-msg">No resources collected yet...</div>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .inventory-content {
      display: flex;
      flex-direction: column;
      max-height: 450px;
      overflow-y: auto;
    }
    .inventory-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: var(--win95-white); // was #ffffcc
      color: var(--win95-black);
      margin-bottom: 8px;
      font-style: italic;
    }
    .gold-display {
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
      background-color: #000080;
      color: #ffcc00;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
    .resources-section {
      fieldset { padding: 4px 8px; margin: 4px 0; }
      legend { font-size: 11px; padding: 0 4px; }
    }
    .resource-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 4px;
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }
    .resource-name {
      &.common { color: #404040; }
      &.uncommon { color: #008800; }
      &.rare { color: #0066cc; }
      &.epic { color: #9900cc; }
      &.legendary { color: #cc6600; font-weight: bold; }
    }
    .resource-amount { min-width: 30px; text-align: right; }
    .empty-msg { color: #808080; font-style: italic; padding: 16px; text-align: center; }
  `]
})
export class InventoryComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly resources = this.gameState.resources;

  /** Static category metadata */
  private readonly categories: { id: ResourceCategory; name: string }[] = [
    { id: 'essence', name: 'Essences' },
    { id: 'reagent', name: 'Reagents' },
    { id: 'gem', name: 'Gems' },
    { id: 'metal', name: 'Metals' },
    { id: 'herb', name: 'Herbs' },
    { id: 'creature', name: 'Creature Parts' },
    { id: 'enchanted', name: 'Enchanted Items' },
    { id: 'rune_mat', name: 'Rune Materials' },
    { id: 'artifact', name: 'Artifacts' },
    { id: 'currency', name: 'Currencies' },
  ];

  /**
   * ⚡ COMPUTED SIGNAL: Pre-computes all category display data.
   * Only recalculates when resources().crafting changes.
   * Eliminates: getAmount(), hasResourcesInCategory(), getCategoryCount() calls in template.
   */
  readonly categoryData = computed<CategoryDisplayData[]>(() => {
    const crafting = this.resources().crafting;
    return this.categories
      .map(cat => {
        const resourcesInCat = getResourcesByCategory(cat.id);
        const resourcesWithAmount = resourcesInCat
          .filter(r => (crafting[r.id] || 0) > 0)
          .map(r => ({ ...r, amount: crafting[r.id] || 0 }));
        return {
          ...cat,
          resources: resourcesWithAmount,
          count: resourcesWithAmount.length,
          hasResources: resourcesWithAmount.length > 0
        };
      })
      .filter(cat => cat.hasResources);
  });

  /**
   * ⚡ COMPUTED SIGNAL: Total resource count for empty state check.
   * Only recalculates when resources().crafting changes.
   */
  readonly totalResources = computed(() => {
    return Object.values(this.resources().crafting).reduce((s, v) => s + v, 0);
  });

  onClose(): void { this.closed.emit(); }
}
