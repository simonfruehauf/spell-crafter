import { Component, input, ElementRef, AfterViewChecked, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CombatLogEntry } from '../../../core/models/game.interfaces';
import { listItem } from '../../../shared/animations/animations';

@Component({
  selector: 'app-combat-log',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [listItem],
  template: `
    <div class="combat-log-container">
      <div class="log-header">Combat Log</div>
      <div class="log-area" #logContainer>
        @for (entry of log(); track entry.timestamp.getTime()) {
          <div class="log-entry" [class]="entry.type" @listItem>
            {{ entry.message }}
          </div>
        }
        @if (log().length === 0) {
          <div class="log-empty">No combat activity yet...</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .combat-log-container {
      border: 2px solid;
      border-color: #808080 #ffffff #ffffff #808080;
    }

    .log-header {
      background-color: #000080;
      color: white;
      padding: 2px 6px;
      font-weight: bold;
      font-size: 10px;
      font-family: 'Courier New', monospace;
    }

    .log-area {
      overflow-y: auto;
      padding: 4px;
      background-color: #fffdd0;
      height: 100px;
      font-size: 10px;
    }

    .log-entry {
      padding: 1px 0;
      font-family: 'Courier New', monospace;

      &.damage { color: #cc0000; }
      &.heal { color: #00aa00; }
      &.info { color: #000080; }
      &.victory { color: #008800; font-weight: bold; }
      &.defeat { color: #880000; font-weight: bold; }
      &.loot { color: #cc6600; }
      &.effect { color: #6600cc; }
      &.crit { color: #ff6600; font-weight: bold; }
    }

    .log-empty {
      color: #808080;
      font-style: italic;
      text-align: center;
      padding: 8px;
    }
  `]
})
export class CombatLogComponent implements AfterViewChecked {
  log = input<CombatLogEntry[]>([]);
  @ViewChild('logContainer') private logContainer!: ElementRef<HTMLDivElement>;

  private previousLogLength = 0;

  ngAfterViewChecked(): void {
    // Auto-scroll to bottom when new entries are added
    if (this.log().length !== this.previousLogLength) {
      this.previousLogLength = this.log().length;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    if (this.logContainer) {
      const container = this.logContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
