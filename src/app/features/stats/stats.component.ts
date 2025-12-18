import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';

interface StatInfo {
  name: string;
  fullName: string;
  description: string;
}

const STAT_INFO: Record<string, StatInfo> = {
  WIS: { name: 'WIS', fullName: 'Wisdom', description: 'Increases mana gained per meditation. Each point gives +0.25 mana per click.' },
  ARC: { name: 'ARC', fullName: 'Arcane Power', description: 'Increases spell damage. Each point gives +10% spell damage.' },
  VIT: { name: 'VIT', fullName: 'Vitality', description: 'Increases HP regeneration. Each point gives +1 HP per second.' },
  BAR: { name: 'BAR', fullName: 'Barrier', description: 'Reduces damage taken. Each point blocks 0.5 damage from attacks.' },
  LCK: { name: 'LCK', fullName: 'Luck', description: 'Increases crit chance (+2% per point, max 25%) and loot drops (+3% chance, +1.5% quantity per point, max 50%).' },
  SPD: { name: 'SPD', fullName: 'Speed', description: 'Reduces combat turn delay by 15ms per point. Minimum delay is 200ms.' },
  CHA: { name: 'CHA', fullName: 'Charisma', description: 'Increases sell prices and reduces buy prices at the Market.' },
};

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, WindowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <legend>
            Attributes
            @if (player().attributePoints > 0) {
              <span class="points-badge">[{{ player().attributePoints }} pts]</span>
            }
          </legend>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'WIS'" (click)="toggleStatInfo('WIS')">WIS</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().WIS }}@if (equipBonusWIS() > 0) {<span class="equip-bonus">(+{{ equipBonusWIS() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('WIS'); $event.stopPropagation()">[+]</button>
              }
            </div>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'ARC'" (click)="toggleStatInfo('ARC')">ARC</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().ARC }}@if (equipBonusARC() > 0) {<span class="equip-bonus">(+{{ equipBonusARC() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('ARC'); $event.stopPropagation()">[+]</button>
              }
            </div>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'VIT'" (click)="toggleStatInfo('VIT')">VIT</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().VIT }}@if (equipBonusVIT() > 0) {<span class="equip-bonus">(+{{ equipBonusVIT() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('VIT'); $event.stopPropagation()">[+]</button>
              }
            </div>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'BAR'" (click)="toggleStatInfo('BAR')">BAR</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().BAR }}@if (equipBonusBAR() > 0) {<span class="equip-bonus">(+{{ equipBonusBAR() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('BAR'); $event.stopPropagation()">[+]</button>
              }
            </div>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'LCK'" (click)="toggleStatInfo('LCK')">LCK</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().LCK }}@if (equipBonusLCK() > 0) {<span class="equip-bonus">(+{{ equipBonusLCK() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('LCK'); $event.stopPropagation()">[+]</button>
              }
            </div>
          </div>
          <div class="stat-row">
            <button class="stat-btn" [class.active]="selectedStat()?.name === 'SPD'" (click)="toggleStatInfo('SPD')">SPD</button>
            <div class="stat-value-group">
              <span class="stat-value">{{ player().SPD }}@if (equipBonusSPD() > 0) {<span class="equip-bonus">(+{{ equipBonusSPD() }})</span>}</span>
              @if (player().attributePoints > 0) {
                <button class="add-btn" (click)="spendPoint('SPD'); $event.stopPropagation()">[+]</button>
              }
            </div>
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
            <span class="stat-value">{{ player().currentHP | number:'1.0-0' }}/{{ effectiveMaxHP() }}@if (equipMaxHPBonus() > 0) {<span class="equip-bonus">(+{{ equipMaxHPBonus() }})</span>}</span>
          </div>
          <div class="stat-row">
            <span class="stat-name">Mana</span>
            <span class="stat-value">{{ resources().mana | number:'1.0-0' }}/{{ effectiveMaxMana() }}@if (equipMaxManaBonus() > 0) {<span class="equip-bonus">(+{{ equipMaxManaBonus() }})</span>}</span>
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
      background-color: var(--win95-blue);
      color: var(--win95-white);
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
      color: var(--win95-white);
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
      background-color: var(--win95-gray);
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      cursor: pointer;
      font-family: 'Courier New', monospace;
      &:hover { background-color: var(--win95-light-gray); }
      &:active, &.active { 
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
        background-color: #a0a0a0;
      }
    }
    .stat-info-box {
      margin-top: 6px;
      padding: 6px;
      padding: 6px;
      background-color: var(--win95-white); // was #ffffcc
      color: var(--win95-black);
      border: 1px solid var(--win95-dark-gray);
      font-size: 10px;
      line-height: 1.4;
    }
    .stat-value-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .add-btn {
      font-size: 10px;
      padding: 1px 4px;
      background-color: var(--win95-gray); // was #90ee90
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #006600;
      &:hover { background-color: var(--win95-light-gray); }
      &:active { border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray); }
    }
    .points-badge {
      font-size: 10px;
      color: #006600;
      font-weight: bold;
    }
    .equip-bonus {
      color: #666666;
      font-size: 10px;
      margin-left: 2px;
    }
    .mt-1 { margin-top: 8px; }
  `]
})
export class StatsComponent {
  closed = output<void>();
  private gameState = inject(GameStateService);
  readonly player = this.gameState.player;
  readonly resources = this.gameState.resources;
  readonly combat = this.gameState.combat;

  // Equipment bonus signals
  readonly equipBonusWIS = this.gameState.equipStatBonusWIS;
  readonly equipBonusARC = this.gameState.equipStatBonusARC;
  readonly equipBonusVIT = this.gameState.equipStatBonusVIT;
  readonly equipBonusBAR = this.gameState.equipStatBonusBAR;
  readonly equipBonusLCK = this.gameState.equipStatBonusLCK;
  readonly equipBonusSPD = this.gameState.equipStatBonusSPD;
  readonly effectiveMaxHP = this.gameState.effectiveMaxHP;
  readonly effectiveMaxMana = this.gameState.effectiveMaxMana;
  readonly equipMaxHPBonus = this.gameState.equipMaxHPBonus;
  readonly equipMaxManaBonus = this.gameState.equipMaxManaBonus;

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
    return this.player().experienceToLevel;
  }

  spendPoint(stat: 'WIS' | 'ARC' | 'VIT' | 'BAR' | 'LCK' | 'SPD'): void {
    this.gameState.spendAttributePoint(stat);
  }

  onClose(): void { this.closed.emit(); }
}

