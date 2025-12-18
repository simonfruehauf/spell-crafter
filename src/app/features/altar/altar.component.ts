import { Component, inject, output, ChangeDetectionStrategy, computed, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-altar',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="The Altar" 
      windowId="altar"
      [initialX]="30" 
      [initialY]="40" 
      [width]="300"
      (closed)="onClose()">
      
      @if (showHeaderMeditate()) {
        <button header-actions 
                class="window-btn meditate-btn"
                (click)="meditate(); $event.stopPropagation()">
          <span>~</span>
        </button>
      }

      <div class="altar-content">
        <div class="altar-description">
          <p>A sacred altar where arcane energies converge. 
             Focus your mind to draw mana from the aether.
            </p>
        </div>

        <div class="altar-visual">
          <pre class="altar-ascii">
/\\
/  \\
/ <span class="runes">{{ eyes() }}</span> \\
|______|
@if (idle().passiveManaRegenUnlocked || idle().goblinApprenticeUnlocked) {
{{ manaRegenPerSecond() | number:'1.2-2' }}/s}</pre>
        </div>
        <div class="mana-display">
          <div class="bar-container">
            <div 
              class="bar-fill mana" 
              [style.width.%]="(resources().mana / resources().maxMana) * 100"> 
            
            </div>
            <div class="bar-text">
              Mana: {{ resources().mana | number:'1.0-0' }} / {{ resources().maxMana | number:'1.0-0' }}
            </div>
            
          </div>
        </div>

        <div class="meditation-section mt-2">
          <button class="btn" (click)="meditate()">
            [~] Meditate (+{{ manaPerClick() }} mana)
          </button>
        </div>


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
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white); // was #ffffcc
      color: var(--win95-black);
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
      color: var(--win95-blue); // was #000080
      margin: 0;
    }

    /* Fixed width for eyes to prevent jitter */
    .altar-ascii .runes {
      display: inline-block;
      width: 17px; 
      text-align: center;
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
export class AltarComponent implements OnInit, OnDestroy {
  closed = output<void>();

  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly player = this.gameState.player;
  readonly idle = this.gameState.idle;
  // Track upgrades to ensure reactivity for regeneration bonuses
  readonly upgrades = this.gameState.upgrades;

  readonly eyes = signal<string>('::');
  private blinkTimer: ReturnType<typeof setTimeout> | undefined;
  private isBlinking = false;

  readonly manaPerClick = computed(() => {
    return 1 + Math.floor(this.player().WIS * 0.25);
  });

  readonly manaRegenPerSecond = computed(() => {
    // Create dependency on upgrades so this re-computes when they change
    this.upgrades();

    let total = 0;

    // WIS-based passive mana regen (requires unlock)
    if (this.idle().passiveManaRegenUnlocked) {
      const bonus = this.gameState.getUpgradeBonus('manaRegen');
      const multiplier = 1 + bonus / 100;
      // 0.025 per tick * 10 ticks/second
      total += this.player().WIS * 0.025 * multiplier * 10;
    }

    // Goblin Apprentice bonus (+1 mana/s)
    if (this.idle().goblinApprenticeUnlocked) {
      total += 1;
    }

    return total;
  });

  readonly showHeaderMeditate = computed(() => {
    // Need to track researchTree changes if we want this to be reactive to research completion
    // But researchTree is a signal in GameStateService? Let's check.
    // Yes, researchTree is a signal in GameStateService (based on usage elsewhere).
    return this.gameState.researchTree().some(r => r.id === 'meditate-header' && r.researched);
  });

  ngOnInit() {
    this.scheduleBlink();
  }

  ngOnDestroy() {
    if (this.blinkTimer) clearTimeout(this.blinkTimer);
  }

  private scheduleBlink() {
    // Random interval between 3s and 8s
    const delay = 3000 + Math.random() * 5000;

    this.blinkTimer = setTimeout(() => {
      this.performBlink();
    }, delay);
  }

  private performBlink() {
    this.isBlinking = true;

    // Blink sequence: :: -> .. -> spaces -> .. -> ::
    this.eyes.set('..');

    setTimeout(() => {
      this.eyes.set('  ');

      setTimeout(() => {
        this.eyes.set('..');

        setTimeout(() => {
          this.isBlinking = false;
          this.eyes.set('::');
          this.scheduleBlink();
        }, 100);
      }, 150);
    }, 100);
  }

  meditate(): void {
    this.gameState.meditate();
  }

  onClose(): void {
    this.closed.emit();
  }
}
