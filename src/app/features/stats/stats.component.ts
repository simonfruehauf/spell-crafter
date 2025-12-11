import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

interface StatInfo {
  name: string;
  fullName: string;
  description: string;
}

const STAT_INFO: Record<string, StatInfo> = {
  WIS: { name: 'WIS', fullName: 'Wisdom', description: 'Increases mana gained per meditation. Each point gives +0.5 mana per click.' },
  ARC: { name: 'ARC', fullName: 'Arcane Power', description: 'Increases spell damage. Each point gives +10% spell damage.' },
  VIT: { name: 'VIT', fullName: 'Vitality', description: 'Increases HP regeneration. Each point gives +1 HP per second.' },
  BAR: { name: 'BAR', fullName: 'Barrier', description: 'Reduces damage taken. Each point blocks 0.5 damage from attacks.' },
  LCK: { name: 'LCK', fullName: 'Luck', description: 'Increases crit chance and loot drops. Each point gives +2% crit and +5% loot bonus.' },
  SPD: { name: 'SPD', fullName: 'Speed', description: 'Reduces combat turn delay. Each point speeds up combat by 5%.' },
};

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  template: `
    <app-window 
      title="Mage Statistics" 
      windowId="stats"
      [initialX]="30" 
      [initialY]="250" 
      [width]="220"
      (closed)="onClose()">
      <div class="stats-content">
        <!-- Player Level & XP -->
        <div class="level-section">
          <div class="level-header">
            <span class="level-title">{{ player().name }}</span>
            <span class="level-num">Level {{ player().level }}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" [style.width.%]="getXpPercent()"></div>
            <span class="xp-text">{{ player().experience }}/{{ getXpToLevel() }} XP</span>
          </div>
        </div>

        <!-- Stats -->
        <fieldset class="mt-1">
          <legend>Attributes</legend>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'WIS'" (click)="toggleStatInfo('WIS')">WIS</button>
            <span class="stat-value">{{ player().WIS }}</span>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'ARC'" (click)="toggleStatInfo('ARC')">ARC</button>
            <span class="stat-value">{{ player().ARC }}</span>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'VIT'" (click)="toggleStatInfo('VIT')">VIT</button>
            <span class="stat-value">{{ player().VIT }}</span>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'BAR'" (click)="toggleStatInfo('BAR')">BAR</button>
            <span class="stat-value">{{ player().BAR }}</span>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'LCK'" (click)="toggleStatInfo('LCK')">LCK</button>
            <span class="stat-value">{{ player().LCK }}</span>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'SPD'" (click)="toggleStatInfo('SPD')">SPD</button>
            <span class="stat-value">{{ player().SPD }}</span>
          </div>
          @if (selectedStat()) {
            <div class="stat-info-box">
              <strong>{{ selectedStat()?.fullName }}:</strong>
              {{ selectedStat()?.description }}
            </div>
          }
        </fieldset>

        <!-- Resources -->
        <fieldset class="mt-1">
          <legend>Resources</legend>
          <div class="stat-row">
            <span class="stat-name">HP</span>
            <span class="stat-value">{{ player().currentHP | number:'1.0-0' }}/{{ player().maxHP }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-name">Mana</span>
            <span class="stat-value">{{ resources().mana | number:'1.0-0' }}/{{ resources().maxMana }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-name">Gold</span>
            <span class="stat-value">{{ resources().gold }}</span>
          </div>
        </fieldset>

        <!-- Combat Stats -->
        <fieldset class="mt-1">
          <legend>Combat</legend>
          <div class="stat-row">
            <span class="stat-name">Foes Slain</span>
            <span class="stat-value">{{ combat().enemiesDefeated }}</span>
          </div>
        </fieldset>
      </div>
    </app-window>
  `,
  styles: [`
    .stats-content {
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .level-section {
      background-color: #000080;
      color: #ffffff;
      padding: 6px;
      margin-bottom: 8px;
    }
    .level-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .xp-bar {
      position: relative;
      height: 14px;
      background-color: #404040;
      border: 1px inset #202020;
    }
    .xp-fill {
      height: 100%;
      background: linear-gradient(180deg, #ffcc00 0%, #cc9900 100%);
    }
    .xp-text {
      position: absolute;
      top: 0; left: 0; right: 0;
      text-align: center;
      font-size: 10px;
      line-height: 14px;
      color: #ffffff;
      text-shadow: 1px 1px 0 #000;
    }
    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      padding: 2px 0;
      align-items: center;
    }
    .stat-name { font-weight: bold; }
    .stat-value { font-family: 'Courier New', monospace; }
    .stat-btn {
      font-weight: bold;
      font-size: 10px;
      padding: 2px 6px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      &:hover { background-color: #d0d0d0; }
      &:active, &.active { 
        border-color: #808080 #ffffff #ffffff #808080;
        background-color: #a0a0a0;
      }
    }
    .stat-info-box {
      margin-top: 6px;
      padding: 6px;
      background-color: #ffffcc;
      border: 1px solid #808080;
      font-size: 10px;
      line-height: 1.4;
    }
  `]
})
export class StatsComponent {
  @Output() closed = new EventEmitter<void>();
  private gameState = inject(GameStateService);
  readonly player = this.gameState.player;
  readonly resources = this.gameState.resources;
  readonly combat = this.gameState.combat;

  readonly selectedStat = signal<StatInfo | null>(null);

  toggleStatInfo(stat: string): void {
    const current = this.selectedStat();
    if (current?.name === stat) {
      this.selectedStat.set(null);
    } else {
      this.selectedStat.set(STAT_INFO[stat] || null);
    }
  }

  getXpPercent(): number {
    const xpToLevel = this.getXpToLevel();
    return Math.min(100, (this.player().experience / xpToLevel) * 100);
  }

  getXpToLevel(): number {
    return this.player().level * 100;
  }

  onClose(): void { this.closed.emit(); }
}

