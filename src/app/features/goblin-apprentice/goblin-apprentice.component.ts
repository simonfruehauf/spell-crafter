import { Component, inject, output, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-goblin-apprentice',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Goblin Apprentice" 
      windowId="goblinApprentice"
      [initialX]="100" 
      [initialY]="150" 
      [width]="170"
      (closed)="onClose()">
      <div class="goblin-content">
        <pre class="goblin-ascii">
,
/&\\
(<span class="eyes">{{ eyes()}}</span> )</pre>
        <div class="goblin-info">
          <span class="mana-rate">+1 m/s</span>
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .goblin-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;

    }
    .goblin-ascii {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      margin: 0;
      color: var(--win95-blue); // was #000080
      text-align: center;
      line-height: 1.2;
    }
    .goblin-ascii .eyes {
      display: inline-block;
      width: 21px;
      text-align: center;
    }
    .goblin-info {
      margin-top: 8px;
      text-align: center;
    }
    .mana-rate {
      font-size: 12px;
      color: var(--win95-blue); // was #000080
      font-weight: bold;
    }
  `]
})
export class GoblinApprenticeComponent implements OnInit, OnDestroy {
  closed = output<void>();
  private gameState = inject(GameStateService);

  readonly eyes = signal<string>('o o');
  private blinkTimer: any;

  ngOnInit() {
    this.scheduleBlink();
  }

  ngOnDestroy() {
    if (this.blinkTimer) clearTimeout(this.blinkTimer);
  }

  private scheduleBlink() {
    // Random interval between 2s and 6s
    const delay = 2000 + Math.random() * 4000;

    this.blinkTimer = setTimeout(() => {
      this.performBlink();
    }, delay);
  }

  private performBlink() {
    // Blink sequence: o o -> - - -> _ _ -> - - -> o o
    this.eyes.set('- -');

    setTimeout(() => {
      this.eyes.set('_ _');

      setTimeout(() => {
        this.eyes.set('- -');

        setTimeout(() => {
          this.eyes.set('o o');
          this.scheduleBlink();
        }, 80);
      }, 100);
    }, 80);
  }

  onClose(): void { this.closed.emit(); }
}
