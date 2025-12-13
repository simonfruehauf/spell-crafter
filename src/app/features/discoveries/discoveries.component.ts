import { Component, inject, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-discoveries',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Discoveries" 
      windowId="discoveries"
      [initialX]="700" 
      [initialY]="40" 
      [width]="300"
      (closed)="onClose()">
      <div class="discoveries-content">
        <div class="section-header">Completed Research</div>
        <div class="discoveries-list">
          @for (node of completedResearch(); track node.id) {
            <div class="discovery-item">
              <span class="discovery-name">{{ node.name }}</span>
              <span class="discovery-check">[✓]</span>
            </div>
          } @empty {
            <div class="empty-message">No discoveries yet...</div>
          }
        </div>

        <div class="section-header mt-2">Unlocked Runes ({{ knownRunes().length }})</div>
        <div class="discoveries-list">
          @for (rune of knownRunes(); track rune.id) {
            <div class="discovery-item rune">
              <span class="rune-symbol">{{ rune.symbol }}</span>
              <span class="rune-name">{{ rune.name }}</span>
            </div>
          } @empty {
            <div class="empty-message">No runes discovered...</div>
          }
        </div>

        <div class="section-header mt-2">Unlocked Windows</div>
        <div class="discoveries-list">
          @for (win of unlockedWindows(); track win) {
            <div class="discovery-item window">
              <span class="window-icon">{{ getWindowIcon(win) }}</span>
              <span class="window-name">{{ getWindowLabel(win) }}</span>
            </div>
          }
        </div>

        <div class="section-header mt-2">Idle Abilities</div>
        <div class="discoveries-list">
          @if (idle().passiveManaRegenUnlocked) {
            <div class="discovery-item">
              <span class="ability-name">Mana Attunement</span>
              <span class="discovery-check">[✓]</span>
            </div>
          }
          @if (idle().autoCombatUnlocked) {
            <div class="discovery-item">
              <span class="ability-name">Auto-Combat</span>
              <span class="discovery-check">[✓]</span>
            </div>
          }
          @if (!idle().passiveManaRegenUnlocked && !idle().autoCombatUnlocked) {
            <div class="empty-message">No abilities unlocked...</div>
          }
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .discoveries-content {
      max-height: 450px;
      overflow-y: auto;
    }

    .section-header {
      background-color: #000080;
      color: white;
      padding: 2px 6px;
      font-weight: bold;
      font-size: 11px;
      font-family: 'Courier New', monospace;
    }

    .discoveries-list {
      max-height: 100px;
      overflow-y: auto;
      background-color: #ffffff;
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
    }

    .discovery-item {
      display: flex;
      justify-content: space-between;
      padding: 2px 6px;
      font-size: 11px;
      font-family: 'Courier New', monospace;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }

      &.rune {
        .rune-symbol {
          color: #000080;
          font-weight: bold;
        }
      }

      &.window {
        .window-icon {
          color: #008000;
        }
      }
    }

    .discovery-check {
      color: #008000;
    }

    .empty-message {
      color: #808080;
      font-style: italic;
      text-align: center;
      padding: 8px;
      font-size: 11px;
    }

    .mt-2 {
      margin-top: 8px;
    }
  `]
})
export class DiscoveriesComponent {
  closed = output<void>();

  private gameState = inject(GameStateService);

  readonly researchTree = this.gameState.researchTree;
  readonly knownRunes = this.gameState.knownRunes;
  readonly windows = this.gameState.windows;
  readonly idle = this.gameState.idle;

  readonly completedResearch = computed(() =>
    this.researchTree().filter(node => node.researched)
  );

  readonly unlockedWindows = computed(() => {
    const w = this.windows();
    return Object.entries(w)
      .filter(([id, state]) => state.unlocked && id !== 'altar' && id !== 'research' && id !== 'stats' && id !== 'settings' && id !== 'discoveries')
      .map(([id]) => id);
  });

  getWindowIcon(id: string): string {
    const icons: Record<string, string> = {
      scriptorium: '[R]', combat: '[C]', inventory: '[I]', workshop: '[W]',
      runebook: '[B]', grimoire: '[G]', bestiary: '[M]', chronicle: '[L]',
    };
    return icons[id] || '[?]';
  }

  getWindowLabel(id: string): string {
    const labels: Record<string, string> = {
      scriptorium: 'Scriptorium', combat: 'Arena', inventory: 'Vault',
      workshop: 'Workshop', runebook: 'Runebook', grimoire: 'Grimoire',
      bestiary: 'Bestiary', chronicle: 'Chronicle',
    };
    return labels[id] || id;
  }

  onClose(): void {
    this.closed.emit();
  }
}
