import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { RESOURCE_NAMES, RESOURCE_DEFS } from '../../core/models/resources.data';
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
      
      <div class="flex flex-col gap-2 h-full">
        <!-- Info Header -->
        <div class="bg-win95-white p-2 border-2 border-inset text-win95-black mb-1">
          <p class="mb-1">Deconstruct reagents to gain Arcane Knowledge.</p>
          <div class="flex gap-4 text-xs font-bold">
            <span class="text-blue-800">Knowledge: {{ resources().crafting['knowledge'] || 0 }}</span>
            <span class="text-purple-800">Insight: {{ resources().crafting['insight'] || 0 }}</span>
            <span class="text-orange-800">Percipience: {{ resources().crafting['percipience'] || 0 }}</span>
          </div>
        </div>

        <!-- Main Workspace -->
        <div class="flex gap-2 h-[300px]">
          
          <!-- Inventory List -->
          <div class="flex-1 flex flex-col border-2 border-inset bg-white p-1">
            <div class="bg-win95-blue text-white px-1 mb-1 font-bold text-xs">Available Reagents</div>
            <div class="overflow-y-auto flex-1 bg-white">
              @for (item of inventoryItems(); track item.id) {
                <div 
                  class="flex justify-between items-center px-2 py-1 cursor-pointer hover:bg-win95-blue hover:text-white group text-xs"
                  [class.bg-win95-blue]="selectedItem()?.id === item.id"
                  [class.text-white]="selectedItem()?.id === item.id"
                  (click)="selectItem(item)">
                  <span>{{ item.name }} ({{ item.count }})</span>
                  <span class="text-[10px] opacity-70 group-hover:text-white" [class.text-gray-500]="selectedItem()?.id !== item.id">[{{ item.rarity }}]</span>
                </div>
              }
              @if (inventoryItems().length === 0) {
                <div class="text-gray-500 text-center italic p-4 text-xs">No deconstructible items found.</div>
              }
            </div>
          </div>

          <!-- Deconstruction Panel -->
          <div class="w-[180px] flex flex-col gap-2">
            
            <div class="border-2 border-inset bg-win95-gray p-2 h-full flex flex-col relative overflow-hidden">
              <!-- Defragmentation Overlay/Display -->
              <div class="absolute inset-0 z-10 bg-black p-[2px] flex flex-col font-mono" *ngIf="deconstructState() === 'processing' || deconstructState() === 'complete'">
                
                <!-- Status Bar -->
                <div class="bg-win95-blue text-white text-[10px] px-1 mb-[1px] flex justify-between">
                  <span>{{ deconstructState() === 'complete' ? 'Deconstruction Complete' : 'Unraveling Essence...' }}</span>
                  <span>{{ currentSector() > -1 ? Math.floor((currentSector() / 240) * 100) + '%' : '0%' }}</span> 
                </div>

                <!-- Grid -->
                <div class="flex-1 bg-black flex flex-wrap content-start gap-[1px] overflow-hidden p-[1px] relative">
                  @for (block of blockGrid(); track $index) {
                     <div class="w-[7px] h-[7px] border border-black" 
                          [style.background-color]="getBlockColor(block)"></div>
                  }
                  
                  <!-- Success Message Overlay -->
                  @if (resultMessage()) {
                    <div class="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[1px]">
                      <div class="bg-win95-gray border-2 border-outset p-2 text-center shadow-lg">
                        <div class="text-xs font-bold mb-1 text-black">Success</div>
                        <div class="text-[10px] text-blue-900">{{ resultMessage() }}</div>
                      </div>
                    </div>
                  }
                </div>

                <!-- Legend -->
                <div class="bg-win95-gray border-t border-win95-white flex gap-2 p-1 text-[9px] mt-[1px]">
                   <div class="flex items-center gap-1"><div class="w-2 h-2 bg-[#00aaaa]"></div>Pure</div>
                   <div class="flex items-center gap-1"><div class="w-2 h-2 bg-[#0066cc]"></div>Unraveling</div>
                   <div class="flex items-center gap-1"><div class="w-2 h-2 bg-[#0000aa]"></div>Raw</div>
                </div>
              </div>

              @if (deconstructState() === 'idle') {
                @if (selectedItem(); as item) {
                <div class="text-center font-bold mb-2 border-b border-gray-400 pb-1">{{ item.name }}</div>
                
                <div class="text-[10px] mb-4 text-justify">{{ item.description }}</div>

                <div class="mt-auto">
                  <div class="text-[10px] mb-1 font-bold">Yields per unit:</div>
                  <div class="flex items-center gap-1 mb-1 text-xs">
                    <span class="text-blue-800 font-bold">{{ getYieldAmount(item) }}x</span>
                    <span>{{ getYieldName(item) }}</span>
                  </div>

                  <div class="my-2 border-t border-gray-400 pt-2">
                     <label class="text-[10px] block mb-1">Amount to Deconstruct:</label>
                     <div class="flex gap-1 mb-2">
                       <input type="number" 
                              class="w-full text-xs p-1 border border-inset" 
                              [min]="1" 
                              [max]="item.count" 
                              [disabled]="deconstructState() !== 'idle'"
                              [ngModel]="deconstructAmount()"
                              (ngModelChange)="setAmount($event, item.count)">
                       <button class="px-2 text-[10px] bg-win95-gray border-outset active:border-inset" 
                               [disabled]="deconstructState() !== 'idle'"
                               (click)="setAmount(item.count, item.count)">All</button>
                     </div>
                  </div>

                  <button 
                    class="w-full py-1 font-bold text-xs text-red-900 bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white disabled:opacity-50"
                    [disabled]="deconstructAmount() <= 0 || deconstructState() !== 'idle'"
                    (click)="deconstruct()">
                    {{ deconstructState() === 'processing' ? 'PROCESSING...' : 'DECONSTRUCT' }}
                  </button>
                </div>
              } @else {
                <div class="h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">
                  Select an item from the inventory to deconstruct.
                </div>
              }
              }
            </div>
          
          </div>
        </div>
      </div>
    </app-window>
  `
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
      case 0: return '#000000'; // Empty
      case 1: return '#0000aa'; // Fragmented (Blue)
      case 2: return '#0066cc'; // Optimized (Mana) 
      case 3: return '#00aaaa'; // Reading (Cyan)
      case 4: return '#00aa00'; // Writing (Green)
      default: return '#000000';
    }
  }

  getYieldName(item: ResourceDef): string {
    switch (item.rarity) {
      case 'common': return 'Knowledge';
      case 'uncommon': return 'Knowledge';
      case 'rare': return 'Insight';
      case 'epic': return 'Insight';
      case 'legendary': return 'Percipience';
      default: return 'Knowledge';
    }
  }

  getYieldAmount(item: ResourceDef): number {
    switch (item.rarity) {
      case 'common': return 1;
      case 'uncommon': return 5;
      case 'rare': return 1;
      case 'epic': return 5;
      case 'legendary': return 1;
      default: return 1;
    }
  }

  deconstructState = signal<'idle' | 'processing' | 'complete'>('idle');
  resultMessage = signal<string>('');
  // 0: Empty, 1: Fragmented (Blue), 2: Optimized (Cyan), 3: Reading (Yellow), 4: Writing (Green)
  blockGrid = signal<number[]>(Array(240).fill(0));
  currentSector = signal<number>(-1);

  deconstruct() {
    const item = this.selectedItem();
    const amount = this.deconstructAmount();

    if (!item || amount <= 0 || amount > item.count || this.deconstructState() !== 'idle') return;

    this.deconstructState.set('processing');
    this.resultMessage.set('');

    // Initialize Grid with "Fragmented" data
    // Create a random distribution of "used sectors"
    const newGrid = Array(240).fill(0).map(() => Math.random() > 0.6 ? 0 : 1);
    this.blockGrid.set(newGrid);

    // Animation Logic
    let readPtr = 0;
    let writePtr = 0;
    const totalBlocks = 240;

    // Calculate speed to fit in 5-10 seconds
    const duration = 5000 + Math.random() * 5000;
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
