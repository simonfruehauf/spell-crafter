import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { RESOURCE_DEFS } from '../../core/models/resources.data';
import { ResourceDef } from '../../core/models/game.interfaces';

@Component({
  selector: 'app-laboratory',
  standalone: true,
  imports: [CommonModule, FormsModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Laboratory" 
      windowId="laboratory"
      [initialX]="400" 
      [initialY]="300" 
      [width]="480"
      (closed)="onClose()">
      
      <div class="lab-container">
        <!-- Info Header -->
        <div class="info-header">
          <p class="mb-1">Deconstruct reagents to gain Arcane Knowledge.</p>
          <div class="resource-row">
            <span class="resource knowledge">Knowledge: {{ resources().crafting['knowledge'] || 0 }}</span>
            <span class="resource insight">Insight: {{ resources().crafting['insight'] || 0 }}</span>
            <span class="resource percipience">Percipience: {{ resources().crafting['percipience'] || 0 }}</span>
          </div>
        </div>

        <!-- Main Workspace -->
        <div class="workspace">
          
          <!-- Inventory List -->
          <div class="inventory-panel">
            <div class="panel-header">Available Reagents</div>
            <div class="item-list">
              @for (item of inventoryItems(); track item.id) {
                <div 
                  class="item-row"
                  [class.selected]="selectedItem()?.id === item.id"
                  (click)="selectItem(item)">
                  <span>{{ item.name }} ({{ item.count }})</span>
                  <span class="rarity-tag" [class.selected]="selectedItem()?.id === item.id">[{{ item.rarity }}]</span>
                </div>
              }
              @if (inventoryItems().length === 0) {
                <div class="empty-text">No deconstructible items found.</div>
              }
            </div>
          </div>

          <!-- Deconstruction Panel -->
          <div class="deconstruct-panel">
            
            <div class="deconstruct-inner">
              <!-- Defragmentation Overlay/Display -->
              <div class="defrag-overlay" *ngIf="deconstructState() === 'processing' || deconstructState() === 'complete'">
                
                <!-- Status Bar -->
                <div class="defrag-status">
                  <span>{{ deconstructState() === 'complete' ? 'Deconstruction Complete' : 'Unraveling Essence...' }}</span>
                  <span>{{ currentSector() > -1 ? Math.floor((currentSector() / 240) * 100) + '%' : '0%' }}</span> 
                </div>

                <!-- Grid -->
                <div class="defrag-grid">
                  @for (block of blockGrid(); track $index) {
                     <div class="defrag-block" 
                          [style.background-color]="getBlockColor(block)"></div>
                  }
                  
                  <!-- Success Message Overlay -->
                  @if (resultMessage()) {
                    <div class="result-overlay">
                      <div class="result-box">
                        <div class="result-title">Success</div>
                        <div class="result-message">{{ resultMessage() }}</div>
                      </div>
                    </div>
                  }
                </div>

                <!-- Legend -->
                <div class="defrag-legend">
                   <div class="legend-item"><div class="legend-swatch pure"></div>Pure</div>
                   <div class="legend-item"><div class="legend-swatch unraveling"></div>Unraveling</div>
                   <div class="legend-item"><div class="legend-swatch raw"></div>Raw</div>
                </div>
              </div>

              @if (deconstructState() === 'idle') {
                @if (selectedItem(); as item) {
                <div class="item-name">{{ item.name }}</div>
                
                <div class="item-description">{{ item.description }}</div>

                <div class="yield-section">
                  <div class="yield-label">Yields per unit:</div>
                  <div class="yield-row">
                    <span class="yield-amount">{{ getYieldAmount(item) }}x</span>
                    <span>{{ getYieldName(item) }}</span>
                  </div>

                  <div class="amount-section">
                     <label class="amount-label">Amount to Deconstruct:</label>
                     <div class="amount-row">
                       <input type="number" 
                              class="amount-input" 
                              [min]="1" 
                              [max]="item.count" 
                              [disabled]="deconstructState() !== 'idle'"
                              [ngModel]="deconstructAmount()"
                              (ngModelChange)="setAmount($event, item.count)">
                       <button class="all-btn" 
                               [disabled]="deconstructState() !== 'idle'"
                               (click)="setAmount(item.count, item.count)">All</button>
                     </div>
                  </div>

                  <button 
                    class="deconstruct-btn"
                    [disabled]="deconstructAmount() <= 0 || deconstructState() !== 'idle'"
                    (click)="deconstruct()">
                    {{ deconstructState() === 'processing' ? 'PROCESSING...' : 'DECONSTRUCT' }}
                  </button>
                </div>
              } @else {
                <div class="placeholder-text">
                  Select an item from the inventory to deconstruct.
                </div>
              }
              }
            </div>
          
          </div>
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .lab-container { display: flex; flex-direction: column; gap: 8px; height: 100%; }
    .info-header {
      background-color: var(--win95-white);
      padding: 8px;
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      color: var(--win95-black);
      margin-bottom: 4px;
    }
    .resource-row { display: flex; gap: 16px; font-size: 12px; font-weight: bold; }
    .resource.knowledge { color: #1e3a8a; }
    .resource.insight { color: #6b21a8; }
    .resource.percipience { color: #9a3412; }
    .workspace { display: flex; gap: 8px; height: 300px; }
    .inventory-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      background-color: white;
      padding: 4px;
    }
    .panel-header {
      background-color: var(--win95-blue);
      color: white;
      padding: 0 4px;
      margin-bottom: 4px;
      font-weight: bold;
      font-size: 12px;
    }
    .item-list { overflow-y: auto; flex: 1; background-color: white; }
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
      &:hover { background-color: var(--win95-blue); color: white; }
      &.selected { background-color: var(--win95-blue); color: white; }
    }
    .rarity-tag { font-size: 10px; opacity: 0.7; }
    .rarity-tag.selected { color: white; }
    .empty-text { color: #6b7280; text-align: center; font-style: italic; padding: 16px; font-size: 12px; }
    .deconstruct-panel { width: 180px; display: flex; flex-direction: column; gap: 8px; }
    .deconstruct-inner {
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      background-color: var(--win95-gray);
      padding: 8px;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .defrag-overlay {
      position: absolute;
      inset: 0;
      z-index: 10;
      background-color: black;
      padding: 2px;
      display: flex;
      flex-direction: column;
      font-family: var(--win95-font-mono);
    }
    .defrag-status {
      background-color: var(--win95-blue);
      color: white;
      font-size: 10px;
      padding: 0 4px;
      margin-bottom: 1px;
      display: flex;
      justify-content: space-between;
    }
    .defrag-grid {
      flex: 1;
      background-color: black;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 1px;
      overflow: hidden;
      padding: 1px;
      position: relative;
    }
    .defrag-block { width: 7px; height: 7px; border: 1px solid black; }
    .result-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(1px);
    }
    .result-box {
      background-color: var(--win95-gray);
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      padding: 8px;
      text-align: center;
      box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .result-title { font-size: 12px; font-weight: bold; margin-bottom: 4px; color: black; }
    .result-message { font-size: 10px; color: #1e3a8a; }
    .defrag-legend {
      background-color: var(--win95-gray);
      border-top: 1px solid var(--win95-white);
      display: flex;
      gap: 8px;
      padding: 4px;
      font-size: 9px;
      margin-top: 1px;
    }
    .legend-item { display: flex; align-items: center; gap: 4px; }
    .legend-swatch { width: 8px; height: 8px; }
    .legend-swatch.pure { background-color: #00aaaa; }
    .legend-swatch.unraveling { background-color: #0066cc; }
    .legend-swatch.raw { background-color: #0000aa; }
    .item-name {
      text-align: center;
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 1px solid #9ca3af;
      padding-bottom: 4px;
    }
    .item-description { font-size: 10px; margin-bottom: 16px; text-align: justify; }
    .yield-section { margin-top: auto; }
    .yield-label { font-size: 10px; margin-bottom: 4px; font-weight: bold; }
    .yield-row { display: flex; align-items: center; gap: 4px; margin-bottom: 4px; font-size: 12px; }
    .yield-amount { color: #1e3a8a; font-weight: bold; }
    .amount-section { margin: 8px 0; border-top: 1px solid #9ca3af; padding-top: 8px; }
    .amount-label { font-size: 10px; display: block; margin-bottom: 4px; }
    .amount-row { display: flex; gap: 4px; margin-bottom: 8px; }
    .amount-input {
      width: 100%;
      font-size: 12px;
      padding: 4px;
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    }
    .all-btn {
      padding: 0 8px;
      font-size: 10px;
      background-color: var(--win95-gray);
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      &:active {
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      }
    }
    .deconstruct-btn {
      width: 100%;
      padding: 4px;
      font-weight: bold;
      font-size: 12px;
      color: #7f1d1d;
      background-color: var(--win95-gray);
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      &:active {
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      }
      &:disabled { opacity: 0.5; }
    }
    .placeholder-text {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-size: 12px;
      text-align: center;
      padding: 8px;
    }
    .mb-1 { margin-bottom: 4px; }
  `]
})
export class LaboratoryComponent {
  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly selectedItem = signal<(ResourceDef & { count: number }) | null>(null);
  readonly deconstructAmount = signal<number>(1);
  protected readonly Math = Math;

  readonly inventoryItems = computed(() => {
    const crafting = this.resources().crafting;
    return Object.entries(crafting)
      .map(([id, count]) => {
        const def = RESOURCE_DEFS[id];
        return def ? { ...def, count } : null;
      })
      .filter((item): item is (ResourceDef & { count: number }) =>
        !!item &&
        item.count > 0 &&
        (item.category === 'reagent' || item.category === 'essence' || item.category === 'gem' || item.category === 'enchanted')
      ) // Only these categories are deconstructible for now
      .sort((a, b) => b.rarity.localeCompare(a.rarity) || a.name.localeCompare(b.name));
  });

  onClose() {
    this.gameState.closeWindow('laboratory');
  }

  selectItem(item: ResourceDef & { count: number }) {
    this.selectedItem.set(item);
    this.deconstructAmount.set(1);
  }

  setAmount(val: number, max: number) {
    if (val < 0) val = 0;
    if (val > max) val = max;
    this.deconstructAmount.set(val);
  }

  getBlockColor(type: number): string {
    switch (type) {
      case 0: {
        return '#000000';
      } // Empty
      case 1: {
        return '#0000aa';
      } // Fragmented (Blue)
      case 2: {
        return '#0066cc';
      } // Optimized (Mana) 
      case 3: {
        return '#00aaaa';
      } // Reading (Cyan)
      case 4: {
        return '#00aa00';
      } // Writing (Green)
      default: {
        return '#000000';
      }
    }
  }

  getYieldName(item: ResourceDef): string {
    switch (item.rarity) {
      case 'common': {
        return 'Knowledge';
      }
      case 'uncommon': {
        return 'Knowledge';
      }
      case 'rare': {
        return 'Insight';
      }
      case 'epic': {
        return 'Insight';
      }
      case 'legendary': {
        return 'Percipience';
      }
      default: {
        return 'Knowledge';
      }
    }
  }

  getYieldAmount(item: ResourceDef): number {
    switch (item.rarity) {
      case 'common': {
        return 1;
      }
      case 'uncommon': {
        return 5;
      }
      case 'rare': {
        return 1;
      }
      case 'epic': {
        return 5;
      }
      case 'legendary': {
        return 1;
      }
      default: {
        return 1;
      }
    }
  }

  deconstructState = signal<'idle' | 'processing' | 'complete'>('idle');
  resultMessage = signal<string>('');
  // 0: Empty, 1: Fragmented (Blue), 2: Optimized (Cyan), 3: Reading (Yellow), 4: Writing (Green)
  blockGrid = signal<number[]>(new Array<number>(240).fill(0));
  currentSector = signal<number>(-1);

  deconstruct() {
    const item = this.selectedItem();
    const amount = this.deconstructAmount();

    if (!item || amount <= 0 || amount > item.count || this.deconstructState() !== 'idle') return;

    this.deconstructState.set('processing');
    this.resultMessage.set('');

    // Initialize Grid with "Fragmented" data
    // Create a random distribution of "used sectors"
    const newGrid = new Array<number>(240).fill(0).map(() => Math.random() > 0.6 ? 0 : 1);
    this.blockGrid.set(newGrid);

    // Animation Logic
    let readPtr = 0;
    let writePtr = 0;
    const totalBlocks = 240;

    // Calculate speed to fit in 14-24 seconds
    const duration = 12_000 + Math.random() * 12_000;
    const intervalTime = duration / totalBlocks;

    const intervalId = setInterval(() => {
      // Check if done
      if (readPtr >= totalBlocks) {
        clearInterval(intervalId);

        // Perform actual game logic
        const result = this.completeDeconstruction(item, amount);

        if (result) {
          this.currentSector.set(240); // Force 100%
          this.resultMessage.set(`Unraveled essence. Gained ${result.amount} ${result.name}.`);
          this.deconstructState.set('complete');

          // Show success for 3 seconds then reset
          setTimeout(() => {
            this.deconstructState.set('idle');
            this.currentSector.set(-1);
            this.resultMessage.set('');
          }, 3000);
        } else {
          // Fallback if failed
          this.deconstructState.set('idle');
        }
        return;
      }

      this.currentSector.set(readPtr);

      const grid = [...this.blockGrid()];

      // If current block is used (Fragmented)
      if (grid[readPtr] === 1) {
        // Mark as reading
        grid[readPtr] = 3;
        this.blockGrid.set([...grid]);

        // "Move" to write position
        setTimeout(() => {
          if (this.deconstructState() === 'idle') return; // Guard against resets

          const currentGrid = [...this.blockGrid()];
          // Clear read position (unless it's same as write)
          if (readPtr !== writePtr) {
            currentGrid[readPtr] = 0;
          }
          // Mark write position as Optimized
          currentGrid[writePtr] = 2; // Cyan

          this.blockGrid.set(currentGrid);
          writePtr++;
        }, intervalTime / 2);
      }

      readPtr++;
    }, intervalTime);
  }

  private completeDeconstruction(item: ResourceDef & { count: number }, amount: number): { name: string, amount: number } | null {
    // Re-verify quantity
    if (this.resources().crafting[item.id] < amount) {
      return null;
    }

    // Calculate Yield
    const yieldName = this.getYieldName(item).toLowerCase(); // 'knowledge', 'insight', 'percipience'
    const yieldAmount = this.getYieldAmount(item) * amount;

    // Execute Transaction
    const success = this.gameState.spendCraftingResources([{ resourceId: item.id, amount }]);
    if (success) {
      this.gameState.addCraftingResource(yieldName, yieldAmount);

      // Update selection logic
      if (amount >= item.count) {
        this.selectedItem.set(null);
        this.deconstructAmount.set(0);
      } else {
        this.selectedItem.update(prev => prev ? { ...prev, count: prev.count - amount } : null);
        this.deconstructAmount.set(1);
      }

      return { name: yieldName.charAt(0).toUpperCase() + yieldName.slice(1), amount: yieldAmount };
    }
    return null;
  }
}
