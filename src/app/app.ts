import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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
import { LaboratoryComponent } from './features/laboratory/laboratory.component';
import { ApothecaryComponent } from './features/apothecary/apothecary.component';
import { GoblinApprenticeComponent } from './features/goblin-apprentice/goblin-apprentice.component';
import { GardenComponent } from './features/garden/garden.component';
import { SpellbookComponent } from './features/spellbook/spellbook.component';
import { MarketComponent } from './features/market/market.component';
import { DevConsoleComponent } from './features/dev-console/dev-console.component';
import { MobileOverlayComponent } from './core/components/mobile-overlay/mobile-overlay.component';
import { GameStateService } from './core/services/game-state.service';
import { WindowStates } from './core/models/game.interfaces';
import { THEMES } from './core/models/market.data';

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
    LaboratoryComponent, ApothecaryComponent, GoblinApprenticeComponent,
    GardenComponent, SpellbookComponent, MarketComponent, DevConsoleComponent, MobileOverlayComponent
  ],
  template: `
    <app-mobile-overlay></app-mobile-overlay>
    <div class="app-container">
      <!-- Header -->
      <div class="header-bar">
        <span class="title" (click)="onTitleClick()">-=[ Spell-Crafter: Chronicles of the Arcane ]=-</span>
        <div class="header-right">
          <span class="resource-text">&lt;&gt; {{ resources().mana | number:'1.0-0' }}/{{ resources().maxMana }}</span>
          <span class="resource-text">(o) {{ resources().gold }}</span>
          
          <!-- Taskbar Buttons -->
          <div class="taskbar-buttons">
            <button class="taskbar-btn" (click)="closeAllWindows()" title="Close All Windows">[X]</button>
            <button class="taskbar-btn" (click)="resetAllWindows()" title="Reset Window Positions">[#]</button>
            
            <!-- Theme Selector -->
            <div class="theme-dropdown">
                <button class="taskbar-btn" (click)="toggleThemeMenu()" title="Select Theme">[T]</button>
                
                <!-- Theme Dropdown -->
                @if (showThemeMenu()) {
                    <div class="theme-menu">
                        @for (theme of unlockedThemes(); track theme.id) {
                            <div class="theme-item"
                                 [class.active]="activeThemeId() === theme.id"
                                 (click)="selectTheme(theme.id)">
                                <span>{{ theme.name }}</span>
                                @if (activeThemeId() === theme.id) { <span>x</span> }
                            </div>
                        }
                    </div>
                }
            </div>

            <button class="taskbar-btn" (click)="openWindow('settings')" title="Settings">[=]</button>
          </div>
        </div>
      </div>

      <!-- Desktop Icons -->
      <div class="desktop-icons">
        @for (windowId of closedWindows(); track windowId) {
          <div class="desktop-icon" (dblclick)="openWindow(windowId)">
            <div class="icon-symbol">{{ getWindowIcon(windowId) }}</div>
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
        @if (windows().laboratory.unlocked && windows().laboratory.visible) {
          <app-laboratory (closed)="closeWindow('laboratory')"></app-laboratory>
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
        @if (windows().apothecary.unlocked && windows().apothecary.visible) {
          <app-apothecary (closed)="closeWindow('apothecary')"></app-apothecary>
        }
        @if (windows().goblinApprentice.unlocked && windows().goblinApprentice.visible) {
          <app-goblin-apprentice (closed)="closeWindow('goblinApprentice')"></app-goblin-apprentice>
        }
        @if (windows().garden.unlocked && windows().garden.visible) {
          <app-garden (closed)="closeWindow('garden')"></app-garden>
        }
        @if (windows().spellbook.unlocked && windows().spellbook.visible) {
          <app-spellbook (closed)="closeWindow('spellbook')"></app-spellbook>
        }
        @if (windows().market.unlocked && windows().market.visible) {
          <app-market (closed)="closeWindow('market')"></app-market>
        }
        @if (showDevConsole()) {
          <app-dev-console (closed)="showDevConsole.set(false)"></app-dev-console>
        }
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      background-color: var(--win95-teal);
    }
    .header-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 28px;
      background: linear-gradient(to bottom, #c0c0c0, #a0a0a0);
      border-bottom: 2px solid var(--win95-dark-gray);
      border-top: 1px solid var(--win95-white);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      z-index: 10000;
      font-family: var(--win95-font-mono);
    }
    .title {
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
    }
    .header-right { display: flex; gap: 16px; align-items: center; }
    .resource-text { font-size: 11px; font-family: var(--win95-font-mono); }
    .taskbar-buttons { display: flex; gap: 4px; position: relative; }
    .taskbar-btn {
      padding: 2px 6px;
      font-family: var(--win95-font-mono);
      font-size: 10px;
      background-color: var(--win95-gray);
      border: 1px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      cursor: pointer;
      &:active {
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      }
    }
    .theme-dropdown { position: relative; }
    .theme-menu {
      position: absolute;
      top: 24px;
      right: 0;
      width: 140px;
      background-color: var(--win95-gray);
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      z-index: 10001;
    }
    .theme-item {
      padding: 4px 8px;
      cursor: pointer;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover { background-color: var(--win95-blue); color: white; }
      &.active { background-color: var(--win95-blue); color: white; }
    }
    .desktop-icons {
      position: absolute;
      top: 40px;
      right: 16px;
      display: flex;
      flex-direction: column-reverse;
      flex-wrap: wrap-reverse;
      gap: 12px;
      z-index: 1;
      max-height: calc(100vh - 60px);
      align-content: flex-end;
      user-select: none;
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
    .icon-symbol {
      font-family: var(--win95-font-mono);
      font-size: 16px;
      font-weight: bold;
      color: white;
      text-shadow: 1px 1px 0 #000;
      background-color: var(--win95-blue);
      padding: 3px 6px;
      border: 2px solid;
      border-color: var(--win95-white) var(--win95-dark-gray) var(--win95-dark-gray) var(--win95-white);
    }
    .icon-label {
      font-size: 9px;
      color: white;
      text-shadow: 1px 1px 0 #000;
      text-align: center;
      margin-top: 2px;
    }
    .windows-container { padding-top: 36px; width: 100%; height: 100%; }
  `]
})

export class App {
  private gameState = inject(GameStateService);
  private document = inject(DOCUMENT);

  readonly resources = this.gameState.resources;
  readonly windows = this.gameState.windows;
  readonly closedWindows = this.gameState.closedWindows;
  readonly themes = this.gameState.themes;

  // Theme UI
  readonly showThemeMenu = signal(false);
  readonly activeThemeId = computed(() => this.themes().active);

  // Dev Console - secret activation
  readonly showDevConsole = signal(false);
  private titleClickCount = 0;
  private titleClickTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Theme Application Effect
    effect(() => {
      const activeThemeId = this.themes().active;
      const themeDef = THEMES.find(t => t.id === activeThemeId);

      // Remove all theme classes first
      THEMES.forEach(t => {
        if (t.cssClass) this.document.body.classList.remove(t.cssClass);
      });

      // Add new theme class
      if (themeDef && themeDef.cssClass) {
        this.document.body.classList.add(themeDef.cssClass);
      }
    });
  }

  get unlockedThemes() {
    return signal(THEMES.filter(t => this.themes().unlocked.includes(t.id)));
  }

  toggleThemeMenu() {
    this.showThemeMenu.update(v => !v);
  }

  selectTheme(id: string) {
    this.gameState.equipTheme(id);
    this.showThemeMenu.set(false);
  }

  onTitleClick(): void {
    this.titleClickCount++;

    // Reset timer on each click
    if (this.titleClickTimer) {
      clearTimeout(this.titleClickTimer);
    }

    // Reset click count after 2 seconds of inactivity
    this.titleClickTimer = setTimeout(() => {
      this.titleClickCount = 0;
    }, 2000);

    // Open dev console after 10 clicks
    if (this.titleClickCount >= 10) {
      this.showDevConsole.set(true);
      this.titleClickCount = 0;
      if (this.titleClickTimer) {
        clearTimeout(this.titleClickTimer);
        this.titleClickTimer = null;
      }
    }
  }

  openWindow(id: keyof WindowStates): void { this.gameState.openWindow(id); }
  closeWindow(id: keyof WindowStates): void { this.gameState.closeWindow(id); }
  closeAllWindows(): void { this.gameState.closeAllWindows(); }
  resetAllWindows(): void { this.gameState.resetAllWindowPositions(); }

  getWindowIcon(id: keyof WindowStates): string {
    const icons: Record<keyof WindowStates, string> = {
      altar: '[A]', research: '[S]', scriptorium: '[R]', combat: '[C]',
      inventory: '[I]', workshop: '[W]', runebook: '[B]', grimoire: '[G]',
      stats: '[#]', bestiary: '[M]', chronicle: '[L]', settings: '[=]',
      discoveries: '[*]', armory: '[E]', equipment: '[+]', alchemy: '[~]',
      laboratory: '[%]', apothecary: '[v]', goblinApprentice: '[g]',
      garden: '[P]', spellbook: '[Q]', market: '[$]'
    };
    return icons[id] || '[?]';
  }

  getWindowLabel(id: keyof WindowStates): string {
    const labels: Record<keyof WindowStates, string> = {
      altar: 'Altar', research: 'Study', scriptorium: 'Spells', combat: 'Arena',
      inventory: 'Vault', workshop: 'Workshop', runebook: 'Runebook', grimoire: 'Grimoire',
      stats: 'Stats', bestiary: 'Bestiary', chronicle: 'Chronicle', settings: 'Settings',
      discoveries: 'Discoveries', armory: 'Armory', equipment: 'Equipment', alchemy: 'Alembic',
      laboratory: 'Laboratory', apothecary: 'Potions', goblinApprentice: 'Goblin',
      garden: 'Garden', spellbook: 'Spellbook', market: 'Market'
    };
    return labels[id] || id;
  }
}
