import { Component, inject, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { ResearchNode } from '../../core/models/game.interfaces';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Study" 
      windowId="research"
      [initialX]="350" 
      [initialY]="40" 
      [width]="340"
      (closed)="onClose()">
      <div class="flex flex-col max-h-[450px]">
        <div class="p-2 border border-win95-dark-gray bg-[#ffffcc] mb-2 italic text-win95-black">
          <p>Ancient tomes and scrolls line the walls. 
             Spend mana to uncover new arcane knowledge.</p>
        </div>

        <div class="flex justify-between px-2 py-1 bg-win95-blue text-white mb-2 font-mono">
          <span class="font-bold">Available Mana:</span>
          <span class="font-bold">{{ resources().mana | number:'1.0-0' }}</span>
        </div>

        @if (completedCount() > 0) {
          <button class="w-full p-[6px] font-mono bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer hover:bg-[#d0d0d0] active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white mb-2" 
                  (click)="openDiscoveries()">
            [*] View Discoveries ({{ completedCount() }})
          </button>
        }

        <div class="flex flex-wrap gap-1 mb-2">
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-win95-dark-gray bg-[#e0e0e0] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === null" 
                  [class.border-2]="activeFilter() === null"
                  [class.border-inset]="activeFilter() === null"
                  (click)="setFilter(null)">All</button>
          
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-[#8080cc] bg-[#ccccff] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === 'window'"
                  [class.border-2]="activeFilter() === 'window'"
                  [class.border-inset]="activeFilter() === 'window'"
                  (click)="setFilter('window')">Feature</button>
                  
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-[#cc80cc] bg-[#ffccff] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === 'rune'"
                  [class.border-2]="activeFilter() === 'rune'"
                  [class.border-inset]="activeFilter() === 'rune'"
                  (click)="setFilter('rune')">Rune</button>
                  
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-[#80cc80] bg-[#ccffcc] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === 'stat'"
                  [class.border-2]="activeFilter() === 'stat'"
                  [class.border-inset]="activeFilter() === 'stat'"
                  (click)="setFilter('stat')">Stat</button>
                  
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-[#80cccc] bg-[#ccffff] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === 'maxMana'"
                  [class.border-2]="activeFilter() === 'maxMana'"
                  [class.border-inset]="activeFilter() === 'maxMana'"
                  (click)="setFilter('maxMana')">Mana</button>
                  
          <button class="px-[6px] py-[2px] text-[10px] font-mono border border-[#cccc80] bg-[#ffffcc] cursor-pointer hover:bg-[#d0d0d0]" 
                  [class.font-bold]="activeFilter() === 'idle'"
                  [class.border-2]="activeFilter() === 'idle'"
                  [class.border-inset]="activeFilter() === 'idle'"
                  (click)="setFilter('idle')">Idle</button>
        </div>

        <div class="flex flex-col gap-1 overflow-y-auto max-h-[350px] pr-1">
          @for (node of availableResearch(); track node.id) {
            <div 
              class="p-2 border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray bg-win95-gray cursor-pointer transition-colors duration-100"
              [class.opacity-50]="!node.unlocked"
              [class.cursor-not-allowed]="!node.unlocked"
              [class.bg-[#90ee90]]="node.researched"
              [class.cursor-default]="node.researched"
              [class.hover:bg-[#d0d0d0]]="node.unlocked && !node.researched"
              [class.active:border-t-win95-dark-gray]="node.unlocked && !node.researched"
              [class.active:border-l-win95-dark-gray]="node.unlocked && !node.researched"
              [class.active:border-r-win95-white]="node.unlocked && !node.researched"
              [class.active:border-b-win95-white]="node.unlocked && !node.researched"
              (click)="attemptResearch(node)">
              
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-win95-black">
                  {{ node.name }}
                  <span class="text-[9px] font-normal px-[4px] py-[1px] ml-[6px] border" 
                        [class]="getUnlockTagClass(node)">{{ getUnlockTag(node) }}</span>
                </span>
                @if (!node.unlocked) {
                  <span class="text-[11px] font-mono text-win95-black">[--]</span>
                } @else {
                  <span class="text-[10px] font-mono text-[#606060]">{{ node.manaCost }}mp</span>
                }
              </div>
              
              <div class="text-[11px] text-[#404040] mb-1">{{ node.description }}</div>
              
              @if (node.unlocked) {
                <div class="text-[11px] font-bold" 
                     [class.text-[#008000]]="canAfford(node)"
                     [class.text-[#800000]]="!canAfford(node)">
                  Cost: {{ node.manaCost }} mana
                </div>
              }
            </div>
          } @empty {
            <div class="text-win95-dark-gray italic text-center p-5">All research complete!</div>
          }
        </div>
      </div>
    </app-window>
  `
})
export class ResearchComponent {
  closed = output<void>();

  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly researchTree = this.gameState.researchTree;

  readonly activeFilter = signal<string | null>(null);

  // Only show incomplete research, sorted by unlocked first then cost, filtered by type
  readonly availableResearch = computed(() => {
    const filter = this.activeFilter();
    return [...this.researchTree()]
      .filter(node => !node.researched)
      .filter(node => filter === null || node.unlockEffect.type === filter)
      .sort((a, b) => {
        // Unlocked items before locked
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;
        // Sort by cost
        return a.manaCost - b.manaCost;
      });
  });

  readonly completedCount = computed(() =>
    this.researchTree().filter(node => node.researched).length
  );

  canAfford(node: ResearchNode): boolean {
    return this.resources().mana >= node.manaCost;
  }

  attemptResearch(node: ResearchNode): void {
    if (!node.unlocked || node.researched) return;
    this.gameState.research(node.id);
  }

  openDiscoveries(): void {
    this.gameState.openWindow('discoveries');
  }

  onClose(): void {
    this.closed.emit();
  }

  setFilter(type: string | null): void {
    this.activeFilter.set(type);
  }

  getUnlockTag(node: ResearchNode): string {
    switch (node.unlockEffect.type) {
      case 'window': return 'Feature';
      case 'rune': return 'Rune';
      case 'stat': return 'Stat';
      case 'maxMana': return 'Mana';
      case 'idle': return 'Idle';
      case 'upgrade': return 'Upgrade';
      default: return '';
    }
  }

  getUnlockTagClass(node: ResearchNode): string {
    // Tailwind classes for tags
    switch (node.unlockEffect.type) {
      case 'window': return 'bg-[#ccccff] border-[#8080cc] text-[#4040aa]';
      case 'rune': return 'bg-[#ffccff] border-[#cc80cc] text-[#aa40aa]';
      case 'stat': return 'bg-[#ccffcc] border-[#80cc80] text-[#40aa40]';
      case 'maxMana': return 'bg-[#ccffff] border-[#80cccc] text-[#40aaaa]';
      case 'idle': return 'bg-[#ffffcc] border-[#cccc80] text-[#aaaa40]';
      default: return '';
    }
  }
}


