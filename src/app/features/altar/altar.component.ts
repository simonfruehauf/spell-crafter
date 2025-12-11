import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-altar',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  template: `
    <app-window 
      title="The Altar" 
      windowId="altar"
      [initialX]="30" 
      [initialY]="40" 
      [width]="300"
      (closed)="onClose()">
      <div class="altar-content">
        <div class="altar-description">
          <p>A sacred altar where arcane energies converge. 
             Focus your mind to draw mana from the aether.</p>
        </div>

        <div class="altar-visual">
          <pre class="altar-ascii">
  /\\
  /  \\
  / :: \\
  |______|
  </pre>
        </div>

        <div class="mana-display">
          <div class="bar-container">
            <div 
              class="bar-fill mana" 
              [style.width.%]="(resources().mana / resources().maxMana) * 100">
            </div>
            <div class="bar-text">
              Mana: {{ resources().mana | number:'1.0-0' }} / {{ resources().maxMana }}
            </div>
          </div>
        </div>

        <div class="meditation-section mt-2">
          <button class="btn" (click)="meditate()">
            [~] Meditate (+{{ manaPerClick }} mana)
          </button>
        </div>

        <!-- Idle Options -->
        @if (idle().autoMeditateUnlocked) {
          <fieldset class="mt-2">
            <legend>Idle Options</legend>
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                [checked]="idle().autoMeditate"
                (change)="toggleAutoMeditate()">
              Auto-Meditate
            </label>
          </fieldset>
        }
      </div>
    </app-window>
  `,
  styles: [`
    .altar-content {
      display: flex;
      flex-direction: column;
    }

    .altar-description {
      padding: 8px;
      border: 1px solid #808080;
      background-color: #ffffcc;
      margin-bottom: 8px;
      font-style: italic;
    }

    .altar-visual {
      text-align: center;
      padding: 8px;
    }

    .altar-ascii {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #000080;
      margin: 0;
    }

    .mana-display {
      margin-top: 8px;
    }

    .meditation-section {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mana-gain {
      font-size: 11px;
      color: #0066cc;
    }

    .bar-container {
      position: relative;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    input[type="checkbox"] {
      width: 13px;
      height: 13px;
    }
  `]
})
export class AltarComponent {
  @Output() closed = new EventEmitter<void>();

  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly player = this.gameState.player;
  readonly idle = this.gameState.idle;

  get manaPerClick(): number {
    return 1 + Math.floor(this.player().WIS * 0.5);
  }

  meditate(): void {
    this.gameState.meditate();
  }

  toggleAutoMeditate(): void {
    this.gameState.setAutoMeditate(!this.idle().autoMeditate);
  }

  onClose(): void {
    this.closed.emit();
  }
}
