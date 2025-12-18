import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { ENEMIES } from '../../core/models/game.data';


@Component({
  selector: 'app-bestiary',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Bestiary" 
      windowId="bestiary"
      [initialX]="500" 
      [initialY]="100" 
      [width]="340"
      (closed)="onClose()">
      <div class="bestiary-content">
        <div class="bestiary-description">
          <p>Knowledge gained from defeating foes.</p>
        </div>

        <div class="enemy-list">
          @for (enemy of enemies; track enemy.id) {
            <div class="enemy-entry" [class.known]="isKnown(enemy.id)">
              @if (isKnown(enemy.id)) {
                <div class="enemy-header">
                  <span class="enemy-name">{{ enemy.name }}</span>
                  <span class="enemy-kills">x{{ getDefeats(enemy.id) }}</span>
                </div>
                <div class="enemy-ascii">
<pre>{{ enemy.ascii }}</pre>
                </div>
                @if (getDefeats(enemy.id) >= 3) {
                  <div class="enemy-stats">
                    Lv.{{ enemy.level }} | HP: {{ enemy.maxHP }}
                  </div>
                }
                @if (getDefeats(enemy.id) >= 5) {
                  <div class="enemy-weakness">
                    @if (enemy.weakness) { <span class="weak">Weak: {{ enemy.weakness }}</span> }
                    @if (enemy.resistance) { <span class="resist">Resist: {{ enemy.resistance }}</span> }
                  </div>
                }
                @if (getDefeats(enemy.id) >= 10) {
                  <div class="enemy-rewards">
                    Gold: {{ enemy.goldReward }} | Exp: {{ enemy.expReward }}
                  </div>
                }
              } @else {
                <div class="enemy-header unknown">
                  <span class="enemy-name">???</span>
                </div>
                <div class="enemy-unknown">Defeat this enemy to learn about it.</div>
              }
            </div>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .bestiary-content {
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow-y: auto;
    }
    .bestiary-description {
      padding: 8px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white); // was #ffffcc
      color: var(--win95-black);
      margin-bottom: 8px;
      font-style: italic;
    }
    .enemy-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .enemy-entry {
      padding: 6px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-light-gray);
      &.known { 
        background-color: var(--win95-white); // was #e8ffe8
        border-color: #008800;
        color: var(--win95-black);
      }
    }
    .enemy-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      &.unknown { color: var(--win95-dark-gray); }
    }
    .enemy-kills { font-size: 10px; color: var(--win95-dark-gray); }
    .enemy-ascii {
      pre {
        font-family: 'Courier New', monospace;
        font-size: 9px;
        line-height: 1.1;
        color: var(--win95-black);
        margin: 4px 0;
      }
    }
    .enemy-stats, .enemy-weakness, .enemy-rewards {
      font-size: 10px;
      color: var(--win95-black);
    }
    .weak { color: #cc0000; margin-right: 8px; }
    .resist { color: #0000cc; }
    .enemy-unknown { font-size: 10px; color: var(--win95-dark-gray); font-style: italic; }
  `]
})
export class BestiaryComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly combat = this.gameState.combat;
  readonly enemies = ENEMIES;

  isKnown(id: string): boolean {
    return (this.combat().enemyDefeats[id] || 0) > 0;
  }

  getDefeats(id: string): number {
    return this.combat().enemyDefeats[id] || 0;
  }

  onClose(): void { this.closed.emit(); }
}
