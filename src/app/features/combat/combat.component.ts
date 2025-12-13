import { Component, inject, signal, output, ChangeDetectionStrategy, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Spell, Enemy, Potion } from '../../core/models/game.interfaces';
import { ENEMIES } from '../../core/models/game.data';
import { POTIONS, POTIONS_MAP } from '../../core/models/potions.data';
import { fadeSlide, pulse, shake } from '../../shared/animations/animations';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule, FormsModule, WindowComponent],
  animations: [fadeSlide, pulse, shake],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-window title="The Arena" windowId="combat" [initialX]="480" [initialY]="40" [width]="380" (closed)="onClose()">
        <div class="flex flex-col" @fadeSlide>
            @if (!combat().inCombat) {
            <!-- Enemy Selection -->
            <div class="p-2 border border-win95-dark-gray bg-[#ffffcc] mb-2 italic text-win95-black">
                <p>The arena awaits. Choose your foe and test your arcane might.</p>
            </div>

            <div class="text-center p-1">
                <div class="relative h-[18px] p-[2px] border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] bg-win95-dark-gray">
                    <div class="h-full bg-[#00aa00] transition-[width] duration-200 ease-linear" [style.width.%]="(player().currentHP / player().maxHP) * 100">
                    </div>
                    <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white drop-shadow-[1px_1px_0_black]">
                        HP: {{ player().currentHP | number:'1.0-0' }} / {{ player().maxHP }}
                    </div>
                </div>
            </div>

            <div class="mt-2 text-win95-black">
                <div class="bg-win95-blue text-white py-[2px] px-[6px] font-bold mb-1 font-mono">Choose Your Opponent</div>
                <div class="bg-white border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] overflow-y-auto p-[2px] h-[140px]">
                    @for (enemy of enemies; track enemy.id) {
                    <div class="flex gap-[6px] font-mono cursor-pointer p-[2px_4px] hover:bg-win95-blue hover:text-white" 
                         [class.bg-win95-blue]="selectedEnemy()?.id === enemy.id"
                         [class.text-white]="selectedEnemy()?.id === enemy.id"
                         (click)="selectEnemy(enemy)">
                        <span class="text-[10px]" [class.text-win95-dark-gray]="selectedEnemy()?.id !== enemy.id" [class.text-white]="selectedEnemy()?.id === enemy.id">[Lv{{ enemy.level }}]</span>
                        <span>{{ enemy.name }}</span>
                        <span class="ml-auto text-[10px]" [class.text-[#008800]]="selectedEnemy()?.id !== enemy.id" [class.text-white]="selectedEnemy()?.id === enemy.id">HP:{{ enemy.maxHP }}</span>
                    </div>
                    }
                </div>
            </div>

            <!-- Idle Options -->
            @if (idle().autoCombatUnlocked) {
            <fieldset class="border border-win95-dark-gray border-t-white border-l-white my-2 p-[12px_8px_8px] relative">
                <legend class="bg-win95-gray px-1 font-system text-xs text-win95-black">Idle Combat</legend>
                <label class="flex items-center gap-[6px] cursor-pointer text-win95-black">
                    <input type="checkbox" [checked]="idle().autoCombat" (change)="toggleAutoCombat()" 
                           class="appearance-none w-[13px] h-[13px] bg-white border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white relative checked:after:content-['✓'] checked:after:absolute checked:after:-top-[2px] checked:after:left-[1px] checked:after:text-xs checked:after:font-bold checked:after:text-black active:bg-win95-gray">
                    Auto-Combat
                </label>
                <div class="flex items-center gap-2 text-[11px] mt-1 text-win95-black">
                    <label>Speed:</label>
                    <select [ngModel]="idle().combatTickMs" (ngModelChange)="setCombatSpeed($event)"
                            class="bg-white border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] pad-[4px] font-system text-xs outline-none focus:outline-dotted focus:outline-1 focus:-outline-offset-2">
                        <option [value]="2000">Slow</option>
                        <option [value]="1000">Normal</option>
                        <option [value]="500">Fast</option>
                        <option [value]="250">Very Fast</option>
                    </select>
                </div>
            </fieldset>
            }

            @if (isLockedOut()) {
            <div class="text-center p-2 bg-[#ffcccc] border-2 border-[#cc0000] text-[#800000] font-bold mt-2" @pulse>
                <div class="text-[16px]">[X]</div>
                <div class="text-[11px]">Recovery in {{ getLockoutSeconds() }}s...</div>
            </div>
            }

            <div class="mt-2 flex justify-center">
                <button class="bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray px-3 py-1 text-xs cursor-pointer font-system active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[13px] active:py-[5px] active:pb-[3px] disabled:text-win95-dark-gray disabled:cursor-not-allowed disabled:shadow-[1px_1px_0_white]"
                        [disabled]="!selectedEnemy() || player().currentHP <= 0 || isLockedOut()"
                        (click)="beginCombat()">
                    [>] Enter Battle
                </button>
            </div>

            <div class="text-center text-[11px] text-[#606060] mt-2">
                <span>Enemies Defeated: {{ combat().enemiesDefeated }}</span>
            </div>
            } @else {
            <!-- Active Combat -->
            <div class="overflow-hidden" @fadeSlide>
                <!-- Enemy Display -->
                <div class="text-center p-1" [@shake]="enemyShakeState()">
                    <div class="font-bold text-xs font-mono text-win95-black">{{ combat().currentEnemy?.name }}</div>
                    <pre class="font-mono text-[10px] m-0 leading-[1.1] text-black text-left inline-block whitespace-pre">{{ combat().currentEnemy?.ascii }}</pre>
                    <div class="relative h-[18px] p-[2px] border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] bg-win95-dark-gray">
                        <div class="h-full bg-[#00aa00] transition-[width] duration-200 ease-linear" [style.width.%]="enemyHPPercent()">
                        </div>
                        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white drop-shadow-[1px_1px_0_black]">
                            HP: {{ combat().currentEnemy?.currentHP | number:'1.0-0' }} / {{ combat().currentEnemy?.maxHP }}
                        </div>
                    </div>
                    @if (combat().enemyEffects.length > 0) {
                    <div class="flex flex-wrap gap-1 justify-center mt-1">
                        @for (effect of combat().enemyEffects; track effect.name) {
                        <span class="text-[9px] px-[4px] py-[1px] font-mono bg-[#ffcccc] text-[#660000]">[{{ effect.name }}: {{ effect.remainingTurns }}]</span>
                        }
                    </div>
                    }
                </div>

                <div class="text-center font-bold text-xs p-[2px] text-[#800000] font-mono">---VS---</div>

                <!-- Player Display -->
                <div class="text-center p-1" [@shake]="playerShakeState()">
                    <pre class="font-mono text-[10px] m-0 leading-[1.1] text-black text-left inline-block whitespace-pre">
    /\\
   /  \\
__/____\\__
  |O  O|
   \\__/
          </pre>
                    <div class="relative h-[18px] p-[2px] border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] bg-win95-dark-gray mb-1">
                        <div class="h-full bg-[#00aa00] transition-[width] duration-200 ease-linear" [style.width.%]="(player().currentHP / player().maxHP) * 100">
                        </div>
                        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white drop-shadow-[1px_1px_0_black]">
                            HP: {{ player().currentHP | number:'1.0-0' }} / {{ player().maxHP }}
                        </div>
                    </div>
                    <div class="relative h-[18px] p-[2px] border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] bg-win95-dark-gray">
                        <div class="h-full bg-[#0066cc] transition-[width] duration-200 ease-linear" [style.width.%]="(resources().mana / resources().maxMana) * 100">
                        </div>
                        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] text-white drop-shadow-[1px_1px_0_black]">
                            MP: {{ resources().mana | number:'1.0-0' }} / {{ resources().maxMana }}
                        </div>
                    </div>
                    @if (combat().playerEffects.length > 0) {
                    <div class="flex flex-wrap gap-1 justify-center mt-1">
                        @for (effect of combat().playerEffects; track effect.name) {
                        <span class="text-[9px] px-[4px] py-[1px] font-mono bg-[#ccffcc] text-[#006600]">[{{ effect.name }}: {{ effect.remainingTurns }}]</span>
                        }
                    </div>
                    }
                </div>

                <!-- Spell Selection -->
                <div class="mt-2 text-win95-black">
                    <div class="bg-win95-blue text-white py-[2px] px-[6px] font-bold mb-1 font-mono">Select Spell</div>
                    <div class="bg-white border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] overflow-y-auto p-[2px] h-[80px]">
                        @for (spell of craftedSpells(); track spell.id) {
                        <div class="flex gap-[6px] font-mono cursor-pointer p-[2px_4px] hover:bg-win95-blue hover:text-white" 
                             [class.bg-win95-blue]="selectedSpell()?.id === spell.id"
                             [class.text-white]="selectedSpell()?.id === spell.id"
                             [class.text-win95-dark-gray]="resources().mana < spell.totalManaCost && selectedSpell()?.id !== spell.id"
                             [class.hover:text-white]="resources().mana < spell.totalManaCost"
                             (click)="selectSpell(spell)">
                            <span class="text-win95-blue" [class.text-white]="selectedSpell()?.id === spell.id">{{ spell.symbol }}</span>
                            <span>{{ spell.name }}</span>
                            <span class="ml-auto text-[10px] text-[#0066cc]" [class.text-white]="selectedSpell()?.id === spell.id">({{ spell.totalManaCost }}mp)</span>
                        </div>
                        } @empty {
                        <div class="text-win95-dark-gray italic p-2 text-center">No spells available!</div>
                        }
                    </div>
                </div>

                <!-- Potion Selection (if unlocked) -->
                @if (idle().usePotionUnlocked && availablePotions().length > 0) {
                <div class="mt-2 text-win95-black">
                    <div class="bg-[#800080] text-white py-[2px] px-[6px] font-bold mb-1 font-mono">Use Potion</div>
                    <div class="bg-white border-2 border-t-win95-dark-gray border-l-win95-dark-gray border-r-win95-white border-b-win95-white shadow-[inset_1px_1px_0_black] overflow-y-auto p-[2px] max-h-[60px]">
                        @for (potion of availablePotions(); track potion.id) {
                        <div class="flex gap-[6px] font-mono cursor-pointer p-[2px_4px] hover:bg-[#800080] hover:text-white" 
                             [class.bg-[#800080]]="selectedPotion()?.id === potion.id"
                             [class.text-white]="selectedPotion()?.id === potion.id"
                             (click)="selectPotion(potion)">
                            <span class="text-[#800080]" [class.text-white]="selectedPotion()?.id === potion.id">{{ potion.symbol }}</span>
                            <span>{{ potion.name }}</span>
                            <span class="ml-auto text-[10px] text-[#008000]" [class.text-white]="selectedPotion()?.id === potion.id">x{{ getPotionCount(potion.id) }}</span>
                        </div>
                        }
                    </div>
                </div>
                }

                <!-- Combat Actions -->
                <div class="mt-2 flex gap-2 justify-between">
                    <button class="bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray px-3 py-1 text-xs cursor-pointer font-system active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[13px] active:py-[5px] active:pb-[3px] text-[#800000]" 
                            (click)="flee()">
                        [<] Flee </button>
                    @if (selectedPotion() && idle().usePotionUnlocked) {
                        <button class="bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray px-3 py-1 text-xs cursor-pointer font-system active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[13px] active:py-[5px] active:pb-[3px] disabled:text-win95-dark-gray disabled:cursor-not-allowed disabled:shadow-[1px_1px_0_white] text-[#800080]"
                                [disabled]="!canUsePotion()" (click)="useSelectedPotion()">
                            [♥] Drink!
                        </button>
                    }
                        <button class="bg-win95-gray border-2 border-t-win95-white border-l-win95-white border-r-win95-dark-gray border-b-win95-dark-gray px-3 py-1 text-xs cursor-pointer font-system active:border-t-win95-dark-gray active:border-l-win95-dark-gray active:border-r-win95-white active:border-b-win95-white active:px-[13px] active:py-[5px] active:pb-[3px] disabled:text-win95-dark-gray disabled:cursor-not-allowed disabled:shadow-[1px_1px_0_white]"
                                [disabled]="!canCastSpell()" (click)="castSelectedSpell()">
                            [*] Cast!
                        </button>
                </div>
            </div>
            }
        </div>
    </app-window>
  `
})
export class CombatComponent {
  closed = output<void>();

  private gameState = inject(GameStateService);

  readonly player = this.gameState.player;
  readonly resources = this.gameState.resources;
  readonly combat = this.gameState.combat;
  readonly craftedSpells = this.gameState.craftedSpells;
  readonly idle = this.gameState.idle;

  readonly enemies = ENEMIES;
  readonly selectedEnemy = signal<Enemy | null>(null);
  readonly selectedSpell = signal<Spell | null>(null);
  readonly selectedPotion = signal<Potion | null>(null);
  readonly potionInventory = this.gameState.potions;

  readonly availablePotions = computed(() => {
    const inv = this.potionInventory();
    return POTIONS.filter(p => inv[p.id] > 0);
  });

  // Shake animation state - changes to trigger animation
  readonly enemyShakeState = signal<'idle' | 'shake'>('idle');
  readonly playerShakeState = signal<'idle' | 'shake'>('idle');

  // Track previous HP to detect damage
  private previousEnemyHP = 0;
  private previousPlayerHP = 0;

  constructor() {
    // Effect to detect HP changes and trigger shake animations
    effect(() => {
      const combat = this.combat();
      const player = this.player();

      // Check for enemy damage (enemy HP decreased)
      const currentEnemyHP = combat.currentEnemy?.currentHP ?? 0;
      if (currentEnemyHP < this.previousEnemyHP && this.previousEnemyHP > 0) {
        this.triggerEnemyShake();
      }
      this.previousEnemyHP = currentEnemyHP;

      // Check for player damage (player HP decreased)
      if (player.currentHP < this.previousPlayerHP && this.previousPlayerHP > 0) {
        this.triggerPlayerShake();
      }
      this.previousPlayerHP = player.currentHP;
    });
  }

  private triggerEnemyShake(): void {
    this.enemyShakeState.set('shake');
    setTimeout(() => this.enemyShakeState.set('idle'), 350);
  }

  private triggerPlayerShake(): void {
    this.playerShakeState.set('shake');
    setTimeout(() => this.playerShakeState.set('idle'), 350);
  }

  isLockedOut(): boolean {
    return Date.now() < this.combat().deathLockoutUntil;
  }

  getLockoutSeconds(): number {
    return Math.ceil((this.combat().deathLockoutUntil - Date.now()) / 1000);
  }

  selectEnemy(enemy: Enemy): void {
    this.selectedEnemy.set(enemy);
  }

  selectSpell(spell: Spell): void {
    if (this.resources().mana >= spell.totalManaCost) {
      this.selectedSpell.set(spell);
      this.gameState.setSelectedSpell(spell.id);
    }
  }

  beginCombat(): void {
    const enemy = this.selectedEnemy();
    if (enemy) {
      this.gameState.startCombat({ ...enemy, currentHP: enemy.maxHP });
      // Auto-select first spell if none selected
      if (!this.selectedSpell()) {
        const spells = this.craftedSpells();
        if (spells.length > 0) {
          this.selectedSpell.set(spells[0]);
          this.gameState.setSelectedSpell(spells[0].id);
        }
      }
    }
  }

  enemyHPPercent(): number {
    const enemy = this.combat().currentEnemy;
    if (!enemy) return 0;
    return Math.max(0, (enemy.currentHP / enemy.maxHP) * 100);
  }

  canCastSpell(): boolean {
    const spell = this.selectedSpell();
    const combat = this.combat();
    if (!spell || !combat.playerTurn || !combat.inCombat) return false;
    return this.resources().mana >= spell.totalManaCost;
  }

  castSelectedSpell(): void {
    const spell = this.selectedSpell();
    if (spell) {
      this.gameState.castSpell(spell);
    }
  }

  flee(): void {
    this.gameState.fleeCombat();
    this.selectedEnemy.set(null);
    this.selectedSpell.set(null);
  }

  toggleAutoCombat(): void {
    this.gameState.setAutoCombat(!this.idle().autoCombat);
  }

  setCombatSpeed(speedMs: number): void {
    this.gameState.setCombatSpeed(Number(speedMs));
  }

  selectPotion(potion: Potion): void {
    this.selectedPotion.set(potion);
  }

  getPotionCount(potionId: string): number {
    return this.gameState.getPotionCount(potionId);
  }

  canUsePotion(): boolean {
    const potion = this.selectedPotion();
    const combat = this.combat();
    if (!potion || !combat.playerTurn || !combat.inCombat) return false;
    return this.gameState.getPotionCount(potion.id) > 0;
  }

  useSelectedPotion(): void {
    const potion = this.selectedPotion();
    if (potion) {
      this.gameState.usePotion(potion.id);
      // Clear potion selection if none left
      if (this.gameState.getPotionCount(potion.id) <= 0) {
        this.selectedPotion.set(null);
      }
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
