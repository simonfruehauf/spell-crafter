import { Component, inject, output, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { ResearchNode } from '../../core/models/game.interfaces';
import { RESOURCE_NAMES } from '../../core/models/resources.data';

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
      <div class="research-container">
        <div class="research-intro">
          <p>Ancient tomes and scrolls line the walls. 
             Spend mana to uncover new arcane knowledge.</p>
        </div>

        <div class="mana-display">
          <span class="mana-label">Available Mana:</span>
          <span class="mana-value">{{ resources().mana | number:'1.0-0' }}</span>
        </div>

        @if (completedCount() > 0) {
          <button class="discoveries-btn" (click)="openDiscoveries()">
            [*] View Discoveries ({{ completedCount() }})
          </button>
        }

        <div class="filter-bar">
          <button class="filter-btn all" 
                  [class.active]="activeFilter() === null" 
                  (click)="setFilter(null)">All</button>
          
          <button class="filter-btn feature" 
                  [class.active]="activeFilter() === 'window'"
                  (click)="setFilter('window')">Feature</button>
                  
          <button class="filter-btn rune" 
                  [class.active]="activeFilter() === 'rune'"
                  (click)="setFilter('rune')">Rune</button>
                  
          <button class="filter-btn stat" 
                  [class.active]="activeFilter() === 'stat'"
                  (click)="setFilter('stat')">Stat</button>
                  
          <button class="filter-btn mana" 
                  [class.active]="activeFilter() === 'maxMana'"
                  (click)="setFilter('maxMana')">Mana</button>
                  
          <button class="filter-btn idle" 
                  [class.active]="activeFilter() === 'idle'"
                  (click)="setFilter('idle')">Idle</button>
        </div>

        <div class="research-list">
          @for (node of availableResearch(); track node.id) {
            <div 
              class="research-node"
              [class.locked]="!node.unlocked"
              [class.researched]="node.researched"
              [class.clickable]="node.unlocked && !node.researched"
              (click)="attemptResearch(node)">
              
              <div class="node-header">
                <span class="node-name">
                  {{ node.name }}
                  <span class="unlock-tag" [class]="getUnlockTagClass(node)">{{ getUnlockTag(node) }}</span>
                </span>
                @if (!node.unlocked) {
                  <span class="node-cost-locked">[--]</span>
                } @else {
                  <span class="node-cost">{{ node.manaCost }}mp</span>
                }
              </div>
              
              <div class="node-description">{{ node.description }}</div>
              
              @if (node.unlocked) {
                <div class="node-cost-detail" 
                     [class.affordable]="canAfford(node)"
                     [class.unaffordable]="!canAfford(node)">
                  Cost: {{ node.manaCost }} mana
                  @if (node.resourceCost && node.resourceCost.length > 0) {
                    <span>
                      @for (cost of node.resourceCost; track cost.resourceId) {
                        + {{ cost.amount }} {{ getResourceName(cost.resourceId) }}
                      }
                    </span>
                  }
                </div>
              }
            </div>
          } @empty {
            <div class="empty-message">All research complete!</div>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .research-container {
      display: flex;
      flex-direction: column;
      max-height: 450px;
    }
    .research-intro {
      padding: 8px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white);
      margin-bottom: 8px;
      font-style: italic;
      color: var(--win95-black);
    }
    .mana-display {
      display: flex;
      justify-content: space-between;
      padding: 4px 8px;
      background-color: var(--win95-blue);
      color: white;
      margin-bottom: 8px;
      font-family: var(--win95-font-mono);
    }
    .mana-label, .mana-value { font-weight: bold; }
    .discoveries-btn {
      width: 100%;
      padding: 6px;
      font-family: var(--win95-font-mono);
      background-color: var(--win95-gray);
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      cursor: pointer;
      margin-bottom: 8px;
      &:hover { background-color: #d0d0d0; }
      &:active {
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      }
    }
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 8px;
    }
    .filter-btn {
      padding: 2px 6px;
      font-size: 10px;
      font-family: var(--win95-font-mono);
      border: 1px solid;
      cursor: pointer;
      &:hover { background-color: #d0d0d0; }
      &.active {
        font-weight: bold;
        border-width: 2px;
        border-style: inset;
      }
    }
    .filter-btn.all { background-color: #e0e0e0; border-color: var(--win95-dark-gray); }
    .filter-btn.feature { background-color: #ccccff; border-color: #8080cc; }
    .filter-btn.rune { background-color: #ffccff; border-color: #cc80cc; }
    .filter-btn.stat { background-color: #ccffcc; border-color: #80cc80; }
    .filter-btn.mana { background-color: #ccffff; border-color: #80cccc; }
    .filter-btn.idle { background-color: var(--win95-white); border-color: #cccc80; color: var(--win95-black); }
    .research-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      max-height: 350px;
      padding-right: 4px;
    }
    .research-node {
      padding: 8px;
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      background-color: var(--win95-gray);
      cursor: pointer;
      transition: background-color 0.1s;
    }
    .research-node.locked {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .research-node.researched {
      background-color: #90ee90;
      cursor: default;
    }
    .research-node.clickable:hover {
      background-color: #d0d0d0;
    }
    .research-node.clickable:active {
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
    }
    .node-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .node-name {
      font-weight: bold;
      color: var(--win95-black);
    }
    .unlock-tag {
      font-size: 9px;
      font-weight: normal;
      padding: 1px 4px;
      margin-left: 6px;
      border: 1px solid;
    }
    .unlock-tag.tag-window { background-color: #ccccff; border-color: #8080cc; color: #4040aa; }
    .unlock-tag.tag-rune { background-color: #ffccff; border-color: #cc80cc; color: #aa40aa; }
    .unlock-tag.tag-stat { background-color: #ccffcc; border-color: #80cc80; color: #40aa40; }
    .unlock-tag.tag-maxMana { background-color: #ccffff; border-color: #80cccc; color: #40aaaa; }
    .unlock-tag.tag-idle { background-color: #ffffcc; border-color: #cccc80; color: #aaaa40; }
    .node-cost-locked {
      font-size: 11px;
      font-family: var(--win95-font-mono);
      color: var(--win95-black);
    }
    .node-cost {
      font-size: 10px;
      font-family: var(--win95-font-mono);
      color: #606060;
    }
    .node-description {
      font-size: 11px;
      color: #404040;
      margin-bottom: 4px;
    }
    .node-cost-detail {
      font-size: 11px;
      font-weight: bold;
    }
    .node-cost-detail.affordable { color: #008000; }
    .node-cost-detail.unaffordable { color: #800000; }
    .empty-message {
      color: var(--win95-dark-gray);
      font-style: italic;
      text-align: center;
      padding: 20px;
    }
  `]
})
export class ResearchComponent {
  closed = output<void>();

  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly researchTree = this.gameState.researchTree;

  readonly activeFilter = signal<string | null>(null);

  // Only show incomplete research, sorted by: buyable -> unlocked but not buyable -> locked
  readonly availableResearch = computed(() => {
    const filter = this.activeFilter();
    return [...this.researchTree()]
      .filter(node => !node.researched)
      .filter(node => filter === null || node.unlockEffect.type === filter)
      .sort((a, b) => {
        const aCanAfford = this.canAfford(a);
        const bCanAfford = this.canAfford(b);

        // Priority 1: Buyable (unlocked + can afford)
        if (a.unlocked && aCanAfford && !(b.unlocked && bCanAfford)) return -1;
        if (b.unlocked && bCanAfford && !(a.unlocked && aCanAfford)) return 1;

        // Priority 2: Unlocked but not affordable
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;

        // Within same priority, sort by mana cost
        return a.manaCost - b.manaCost;
      });
  });

  readonly completedCount = computed(() =>
    this.researchTree().filter(node => node.researched).length
  );

  canAfford(node: ResearchNode): boolean {
    const hasMana = this.resources().mana >= node.manaCost;
    const hasResources = node.resourceCost ? this.gameState.canAffordResources(node.resourceCost) : true;
    return hasMana && hasResources;
  }

  getResourceName(id: string): string {
    return RESOURCE_NAMES[id] || id;
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
    // Special case for Focus Crystal to show as Idle
    if (node.unlockEffect.type === 'misc' && node.unlockEffect.value === 'headerMeditate') {
      return 'Idle';
    }

    switch (node.unlockEffect.type) {
      case 'window': { return 'Feature';
      }
      case 'rune': { return 'Rune';
      }
      case 'stat': { return 'Stat';
      }
      case 'maxMana': { return 'Mana';
      }
      case 'idle': { return 'Idle';
      }
      case 'upgrade': { return 'Upgrade';
      }
      default: { return '';
      }
    }
  }

  getUnlockTagClass(node: ResearchNode): string {
    // Special case for Focus Crystal
    if (node.unlockEffect.type === 'misc' && node.unlockEffect.value === 'headerMeditate') {
      return 'tag-idle';
    }

    // Semantic classes for tags
    switch (node.unlockEffect.type) {
      case 'window': { return 'tag-window';
      }
      case 'rune': { return 'tag-rune';
      }
      case 'stat': { return 'tag-stat';
      }
      case 'maxMana': { return 'tag-maxMana';
      }
      case 'idle': { return 'tag-idle';
      }
      default: { return '';
      }
    }
  }
}


