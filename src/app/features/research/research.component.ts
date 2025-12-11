import { Component, inject, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { ResearchNode } from '../../core/models/game.interfaces';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  template: `
    <app-window 
      title="The Study" 
      windowId="research"
      [initialX]="350" 
      [initialY]="40" 
      [width]="340"
      (closed)="onClose()">
      <div class="research-content">
        <div class="research-description">
          <p>Ancient tomes and scrolls line the walls. 
             Spend mana to uncover new arcane knowledge.</p>
        </div>

        <div class="mana-available">
          <span class="label">Available Mana:</span>
          <span class="value">{{ resources().mana | number:'1.0-0' }}</span>
        </div>

        <div class="research-tree">
          @for (node of sortedResearchTree(); track node.id) {
            <div 
              class="research-node"
              [class.unlocked]="node.unlocked && !node.researched"
              [class.researched]="node.researched"
              [class.locked]="!node.unlocked"
              (click)="attemptResearch(node)">
              
              <div class="node-header">
                <span class="node-name">{{ node.name }}</span>
                @if (node.researched) {
                  <span class="node-status">[OK]</span>
                } @else if (!node.unlocked) {
                  <span class="node-status">[--]</span>
                } @else {
                  <span class="node-cost-header">{{ node.manaCost }}mp</span>
                }
              </div>
              
              <div class="node-description">{{ node.description }}</div>
              
              @if (!node.researched && node.unlocked) {
                <div class="node-cost" [class.affordable]="canAfford(node)">
                  Cost: {{ node.manaCost }} mana
                </div>
              }
            </div>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .research-content {
      display: flex;
      flex-direction: column;
      max-height: 450px;
    }

    .research-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }

    .mana-available {
      display: flex;
      justify-content: space-between;
      padding: 4px 8px;
      background-color: #000080;
      color: white;
      margin-bottom: 8px;
      font-family: 'Courier New', monospace;

      .value {
        font-weight: bold;
      }
    }

    .research-tree {
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
      border-color: #ffffff #808080 #808080 #ffffff;
      background-color: #c0c0c0;
      cursor: pointer;
      transition: background-color 0.1s;

      &.locked {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.researched {
        background-color: #90ee90;
        cursor: default;
      }

      &.unlocked:hover:not(.researched) {
        background-color: #d0d0d0;
      }

      &.unlocked:active:not(.researched) {
        border-color: #808080 #ffffff #ffffff #808080;
      }
    }

    .node-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .node-name {
      font-weight: bold;
    }

    .node-status {
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }

    .node-cost-header {
      font-size: 10px;
      font-family: 'Courier New', monospace;
      color: #606060;
    }

    .node-description {
      font-size: 11px;
      color: #404040;
      margin-bottom: 4px;
    }

    .node-cost {
      font-size: 11px;
      color: #800000;

      &.affordable {
        color: #008000;
        font-weight: bold;
      }
    }
  `]
})
export class ResearchComponent {
  @Output() closed = new EventEmitter<void>();

  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly researchTree = this.gameState.researchTree;

  // Sort by: researched last, then by mana cost ascending
  readonly sortedResearchTree = computed(() => {
    return [...this.researchTree()].sort((a, b) => {
      // Researched items go to bottom
      if (a.researched && !b.researched) return 1;
      if (!a.researched && b.researched) return -1;
      // Unlocked items before locked
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      // Sort by cost
      return a.manaCost - b.manaCost;
    });
  });

  canAfford(node: ResearchNode): boolean {
    return this.resources().mana >= node.manaCost;
  }

  attemptResearch(node: ResearchNode): void {
    if (!node.unlocked || node.researched) return;
    this.gameState.research(node.id);
  }

  onClose(): void {
    this.closed.emit();
  }
}

