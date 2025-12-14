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
    <div class="w-full h-screen relative overflow-hidden bg-win95-teal">
      <!-- Header -->
      <div class="fixed top-0 left-0 right-0 h-[28px] bg-gradient-to-b from-[#c0c0c0] to-[#a0a0a0] border-b-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray flex items-center justify-between px-2 z-[10000] font-mono">
        <span class="font-bold text-xs cursor-pointer select-none" (click)="onTitleClick()">-=[ Spell-Crafter: Chronicles of the Arcane ]=-</span>
        <div class="flex gap-4 items-center">
          <span class="text-[11px] font-mono">&lt;&gt; {{ resources().mana | number:'1.0-0' }}/{{ resources().maxMana }}</span>
          <span class="text-[11px] font-mono">(o) {{ resources().gold }}</span>
          
          <!-- Taskbar Buttons -->
          <div class="flex gap-1 relative">
            <button class="px-[6px] py-[2px] font-mono text-[10px] bg-win95-gray border border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white" (click)="closeAllWindows()" title="Close All Windows">[X]</button>
            <button class="px-[6px] py-[2px] font-mono text-[10px] bg-win95-gray border border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white" (click)="resetAllWindows()" title="Reset Window Positions">[#]</button>
            
            <!-- Theme Selector -->
            <div class="relative">
                <button class="px-[6px] py-[2px] font-mono text-[10px] bg-win95-gray border border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white" 
                    (click)="toggleThemeMenu()" 
                    title="Select Theme">[T]</button>
                
                <!-- Theme Dropdown -->
                @if (showThemeMenu()) {
                    <div class="absolute top-[24px] right-0 w-[140px] bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray shadow-md flex flex-col z-[10001]">
                        @for (theme of unlockedThemes(); track theme.id) {
                            <div class="px-2 py-1 hover:bg-win95-blue hover:text-white cursor-pointer text-[11px] flex justify-between items-center"
                                 [class.bg-win95-blue]="activeThemeId() === theme.id"
                                 [class.text-white]="activeThemeId() === theme.id"
                                 (click)="selectTheme(theme.id)">
                                <span>{{ theme.name }}</span>
                                @if (activeThemeId() === theme.id) { <span>x</span> }
                            </div>
                        }
                    </div>
                }
            </div>

            <button class="px-[6px] py-[2px] font-mono text-[10px] bg-win95-gray border border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray cursor-pointer active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white" (click)="openWindow('settings')" title="Settings">[=]</button>
          </div>
        </div>
      </div>

      <!-- Desktop Icons -->
      <div class="absolute top-[40px] right-[16px] flex flex-col-reverse flex-wrap-reverse gap-[12px] z-[1] max-h-[calc(100vh-60px)] content-end select-none">
        @for (windowId of closedWindows(); track windowId) {
          <div class="flex flex-col items-center cursor-pointer p-1 w-[64px] hover:bg-win95-blue/30 active:bg-win95-blue/50" (dblclick)="openWindow(windowId)">
            <div class="font-mono text-[16px] font-bold text-white drop-shadow-[1px_1px_0_#000] bg-win95-blue p-[3px_6px] border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray">{{ getWindowIcon(windowId) }}</div>
            <div class="text-[9px] text-white drop-shadow-[1px_1px_0_#000] text-center mt-[2px]">{{ getWindowLabel(windowId) }}</div>
          </div>
        }
      </div>

      <!-- Windows -->
      <div class="pt-[36px] w-full h-full">
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
  `
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
