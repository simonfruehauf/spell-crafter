import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Upgrade, ResourceCost } from '../../core/models/game.interfaces';
import { RESOURCE_NAMES } from '../../core/models/resources.data';

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Workshop" 
      windowId="workshop"
      [initialX]="450" 
      [initialY]="300" 
      [width]="380"
      (closed)="onClose()">
      <div class="workshop-content">
        <div class="workshop-description">
          <p>Forge permanent upgrades using collected resources.</p>
        </div>

        <div class="upgrade-categories">
          @for (cat of categories; track cat.id) {
            <fieldset class="mt-1">
              <legend>{{ cat.name }}</legend>
              @for (upgrade of getUpgradesByCategory(cat.id); track upgrade.id) {
                <div class="upgrade-item" [class.maxed]="upgrade.level >= upgrade.maxLevel">
                  <div class="upgrade-header">
                    <span class="upgrade-name">{{ upgrade.name }}</span>
                    <span class="upgrade-level">Lv.{{ upgrade.level }}/{{ upgrade.maxLevel }}</span>
                  </div>
                  <div class="upgrade-desc">{{ upgrade.description }}</div>
                  @if (upgrade.level < upgrade.maxLevel) {
                    <div class="upgrade-cost">
                      @for (cost of getUpgradeCost(upgrade); track cost.resourceId) {
                        <span class="cost-item" [class.affordable]="hasResource(cost)">
                          {{ cost.amount }}x {{ getResourceName(cost.resourceId) }}
                        </span>
                      }
                    </div>
                    <button 
                      class="btn btn-sm mt-1" 
                      [disabled]="!canAffordUpgrade(upgrade.id)"
                      (click)="purchaseUpgrade(upgrade.id)">
                      [+] Upgrade
                    </button>
                  } @else {
                    <div class="maxed-text">[MAX]</div>
                  }
                </div>
              }
            </fieldset>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .workshop-content {
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow-y: auto;
    }
    .workshop-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }
    .upgrade-item {
      padding: 6px;
      margin: 4px 0;
      border: 1px solid #808080;
      background-color: #e0e0e0;
      &.maxed { background-color: #90ee90; }
    }
    .upgrade-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .upgrade-level { font-family: 'Courier New', monospace; font-size: 10px; }
    .upgrade-desc { font-size: 10px; color: #404040; margin: 2px 0; }
    .upgrade-cost { font-size: 10px; display: flex; flex-wrap: wrap; gap: 4px; }
    .cost-item { 
      padding: 1px 4px; 
      background-color: #ffcccc; 
      &.affordable { background-color: #ccffcc; }
    }
    .maxed-text { color: #008800; font-weight: bold; text-align: center; }
    .btn-sm { padding: 2px 8px; font-size: 10px; }
  `]
})
export class WorkshopComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly upgrades = this.gameState.upgrades;
  readonly resources = this.gameState.resources;

  readonly categories = [
    { id: 'stats', name: 'Statistics' },
    { id: 'combat', name: 'Combat' },
    { id: 'idle', name: 'Idle' },
    { id: 'crafting', name: 'Crafting' },
    { id: 'special', name: 'Special' },
  ];

  getUpgradesByCategory(cat: string): Upgrade[] {
    return this.upgrades().filter(u => u.category === cat && u.unlocked);
  }

  getUpgradeCost(u: Upgrade): ResourceCost[] {
    return this.gameState.getUpgradeCost(u);
  }

  getResourceName(id: string): string {
    return RESOURCE_NAMES[id] || id;
  }

  hasResource(cost: ResourceCost): boolean {
    return (this.resources().crafting[cost.resourceId] || 0) >= cost.amount;
  }

  canAffordUpgrade(id: string): boolean {
    return this.gameState.canAffordUpgrade(id);
  }

  purchaseUpgrade(id: string): void {
    this.gameState.purchaseUpgrade(id);
  }

  onClose(): void { this.closed.emit(); }
}
