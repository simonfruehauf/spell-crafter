import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AltarComponent } from './features/altar/altar.component';
import { ResearchComponent } from './features/research/research.component';
import { SpellCraftingComponent } from './features/spell-crafting/spell-crafting.component';
import { CombatComponent } from './features/combat/combat.component';
import { InventoryComponent } from './features/inventory/inventory.component';
import { WorkshopComponent } from './features/workshop/workshop.component';
import { RunebookComponent } from './features/runebook/runebook.component';
import { GrimoireComponent } from './features/grimoire/grimoire.component';
import { StatsComponent } from './features/stats/stats.component';
import { BestiaryComponent } from './features/bestiary/bestiary.component';
import { ChronicleComponent } from './features/chronicle/chronicle.component';
import { SettingsComponent } from './features/settings/settings.component';
import { DiscoveriesComponent } from './features/discoveries/discoveries.component';
import { ArmoryComponent } from './features/armory/armory.component';
import { EquipmentComponent } from './features/equipment/equipment.component';
import { AlchemyComponent } from './features/alchemy/alchemy.component';
import { GameStateService } from './core/services/game-state.service';
import { WindowStates } from './core/models/game.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AltarComponent, ResearchComponent, SpellCraftingComponent,
    CombatComponent, InventoryComponent, WorkshopComponent,
    RunebookComponent, GrimoireComponent, StatsComponent,
    BestiaryComponent, ChronicleComponent, SettingsComponent,
    DiscoveriesComponent, ArmoryComponent, EquipmentComponent, AlchemyComponent,
  ],
  template: `
    <div class="desktop">
      <!-- Header -->
      <div class="game-header">
        <span class="game-title">-=[ Spell-Crafter: Chronicles of the Arcane ]=-</span>
        <div class="header-resources">
          <span class="resource">&lt;&gt; {{ resources().mana | number:'1.0-0' }}/{{ resources().maxMana }}</span>
          <span class="resource">(o) {{ resources().gold }}</span>
          <button class="header-btn" (click)="openWindow('settings')">[=]</button>
        </div>
      </div>

      <!-- Desktop Icons -->
      <div class="desktop-icons">
        @for (windowId of closedWindows(); track windowId) {
          <div class="desktop-icon" (dblclick)="openWindow(windowId)">
            <div class="icon-graphic">{{ getWindowIcon(windowId) }}</div>
            <div class="icon-label">{{ getWindowLabel(windowId) }}</div>
          </div>
        }
      </div>

      <!-- Windows -->
      <div class="windows-container">
        @if (windows().altar.unlocked && windows().altar.visible) {
          <app-altar (closed)="closeWindow('altar')"></app-altar>
        }
        @if (windows().research.unlocked && windows().research.visible) {
          <app-research (closed)="closeWindow('research')"></app-research>
        }
        @if (windows().scriptorium.unlocked && windows().scriptorium.visible) {
          <app-spell-crafting (closed)="closeWindow('scriptorium')"></app-spell-crafting>
        }
        @if (windows().inventory.unlocked && windows().inventory.visible) {
          <app-inventory (closed)="closeWindow('inventory')"></app-inventory>
        }
        @if (windows().combat.unlocked && windows().combat.visible) {
          <app-combat (closed)="closeWindow('combat')"></app-combat>
        }
        @if (windows().workshop.unlocked && windows().workshop.visible) {
          <app-workshop (closed)="closeWindow('workshop')"></app-workshop>
        }
        @if (windows().runebook.unlocked && windows().runebook.visible) {
          <app-runebook (closed)="closeWindow('runebook')"></app-runebook>
        }
        @if (windows().grimoire.unlocked && windows().grimoire.visible) {
          <app-grimoire (closed)="closeWindow('grimoire')"></app-grimoire>
        }
        @if (windows().stats.unlocked && windows().stats.visible) {
          <app-stats (closed)="closeWindow('stats')"></app-stats>
        }
        @if (windows().bestiary.unlocked && windows().bestiary.visible) {
          <app-bestiary (closed)="closeWindow('bestiary')"></app-bestiary>
        }
        @if (windows().chronicle.unlocked && windows().chronicle.visible) {
          <app-chronicle (closed)="closeWindow('chronicle')"></app-chronicle>
        }
        @if (windows().settings.unlocked && windows().settings.visible) {
          <app-settings (closed)="closeWindow('settings')"></app-settings>
        }
        @if (windows().discoveries.unlocked && windows().discoveries.visible) {
          <app-discoveries (closed)="closeWindow('discoveries')"></app-discoveries>
        }
        @if (windows().armory.unlocked && windows().armory.visible) {
          <app-armory (closed)="closeWindow('armory')"></app-armory>
        }
        @if (windows().equipment.unlocked && windows().equipment.visible) {
          <app-equipment (closed)="closeWindow('equipment')"></app-equipment>
        }
        @if (windows().alchemy.unlocked && windows().alchemy.visible) {
          <app-alchemy (closed)="closeWindow('alchemy')"></app-alchemy>
        }
      </div>
    </div>
  `,
  styles: [`
    .desktop {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }
    .game-header {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 28px;
      background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%);
      border-bottom: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      z-index: 10000;
      font-family: 'Courier New', monospace;
    }
    .game-title { font-weight: bold; font-size: 12px; }
    .header-resources { display: flex; gap: 16px; align-items: center; }
    .resource { font-size: 11px; font-family: 'Courier New', monospace; }
    .header-btn {
      padding: 2px 6px;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      background-color: #c0c0c0;
      border: 1px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
      cursor: pointer;
      &:active { border-color: #808080 #ffffff #ffffff #808080; }
    }
    .desktop-icons {
      position: absolute;
      top: 40px; right: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 1;
      max-height: calc(100vh - 60px);
      overflow-y: auto;
    }
    .desktop-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      padding: 4px;
      width: 64px;
      &:hover { background-color: rgba(0, 0, 128, 0.3); }
      &:active { background-color: rgba(0, 0, 128, 0.5); }
    }
    .icon-graphic {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      text-shadow: 1px 1px 0 #000;
      background-color: #000080;
      padding: 3px 6px;
      border: 2px solid;
      border-color: #ffffff #808080 #808080 #ffffff;
    }
    .icon-label {
      font-size: 9px;
      color: #ffffff;
      text-shadow: 1px 1px 0 #000;
      text-align: center;
      margin-top: 2px;
    }
    .windows-container {
      padding-top: 36px;
      width: 100%;
      height: 100%;
    }
  `]
})
export class App {
  private gameState = inject(GameStateService);

  readonly resources = this.gameState.resources;
  readonly windows = this.gameState.windows;
  readonly closedWindows = this.gameState.closedWindows;

  openWindow(id: keyof WindowStates): void { this.gameState.openWindow(id); }
  closeWindow(id: keyof WindowStates): void { this.gameState.closeWindow(id); }

  getWindowIcon(id: keyof WindowStates): string {
    const icons: Record<keyof WindowStates, string> = {
      altar: '[A]', research: '[S]', scriptorium: '[R]', combat: '[C]',
      inventory: '[I]', workshop: '[W]', runebook: '[B]', grimoire: '[G]',
      stats: '[#]', bestiary: '[M]', chronicle: '[L]', settings: '[=]',
      discoveries: '[*]', armory: '[E]', equipment: '[+]', alchemy: '[~]',
    };
    return icons[id] || '[?]';
  }

  getWindowLabel(id: keyof WindowStates): string {
    const labels: Record<keyof WindowStates, string> = {
      altar: 'Altar', research: 'Study', scriptorium: 'Spells', combat: 'Arena',
      inventory: 'Vault', workshop: 'Workshop', runebook: 'Runebook', grimoire: 'Grimoire',
      stats: 'Stats', bestiary: 'Bestiary', chronicle: 'Chronicle', settings: 'Settings',
      discoveries: 'Discoveries', armory: 'Armory', equipment: 'Equipment', alchemy: 'Alembic',
    };
    return labels[id] || id;
  }
}
