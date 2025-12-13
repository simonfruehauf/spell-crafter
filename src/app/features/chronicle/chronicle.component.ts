import { Component, inject, Output, EventEmitter, ElementRef, ViewChild, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

@Component({
  selector: 'app-chronicle',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window 
      title="Battle Chronicle" 
      windowId="chronicle"
      [initialX]="750" 
      [initialY]="300" 
      [width]="280"
      (closed)="onClose()">
      <div class="chronicle-content">
        <div class="log-container" #logContainer>
          @for (entry of combat().combatLog; track $index) {
            <div class="log-entry" [class]="entry.type">
              {{ entry.message }}
            </div>
          } @empty {
            <div class="empty-msg">No combat logged yet...</div>
          }
        </div>
        <div class="chronicle-stats mt-1">
          <span>Total Defeats: {{ combat().enemiesDefeated }}</span>
        </div>
      </div>
    </app-window>
  `,
  styles: [`
    .chronicle-content {
      display: flex;
      flex-direction: column;
    }
    .log-container {
      height: 300px;
      overflow-y: auto;
      padding: 4px;
      background-color: #000;
      border: 2px inset #808080;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      scroll-behavior: smooth;
    }
    .log-entry {
      padding: 1px 0;
      &.damage { color: #ff6666; }
      &.heal { color: #66ff66; }
      &.info { color: #cccccc; }
      &.victory { color: #ffff00; font-weight: bold; }
      &.defeat { color: #ff0000; font-weight: bold; }
      &.loot { color: #ffcc00; }
      &.effect { color: #66ccff; }
      &.crit { color: #ff00ff; font-weight: bold; }
    }
    .empty-msg { color: #666666; font-style: italic; padding: 8px; }
    .chronicle-stats {
      font-size: 11px;
      padding: 4px;
      background-color: #000080;
      color: #ffffff;
      text-align: center;
    }
  `]
})
export class ChronicleComponent {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('logContainer') logContainer!: ElementRef;
  private gameState = inject(GameStateService);
  readonly combat = this.gameState.combat;

  constructor() {
    // Auto-scroll when combat log changes
    effect(() => {
      const log = this.combat().combatLog;
      if (log.length > 0) {
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  private scrollToBottom(): void {
    if (this.logContainer) {
      const el = this.logContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  onClose(): void { this.closed.emit(); }
}
