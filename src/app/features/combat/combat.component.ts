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
        <div class="combat-container" @fadeSlide>


            @if (!combat().inCombat) {
            <!-- Enemy Selection -->
            <div class="combat-intro">
                <p>The arena awaits. Choose your foe and test your arcane might.</p>
            </div>
            @if (combat().victoryFlash) {
            <div class="victory-flash" @pulse>
                <div class="victory-text">[!] VICTORY! [!]</div>
            </div>
            }
            <div class="text-center p-1">
                <div class="hp-bar-container">
                    <div class="hp-bar-fill hp" [style.width.%]="(player().currentHP / player().maxHP) * 100">
                    </div>
                    <div class="bar-text">
                        HP: {{ player().currentHP | number:'1.0-0' }} / {{ player().maxHP }}
                    </div>
                </div>
            </div>

            <div class="section-container">
                <div class="section-header blue">Choose Your Opponent</div>
                <div class="list-container tall">
                    @for (enemy of enemies; track enemy.id) {
                    <div class="list-item" 
                         [class.selected]="selectedEnemy()?.id === enemy.id"
                         (click)="selectEnemy(enemy)">
                        <span class="level-tag" [class.selected]="selectedEnemy()?.id === enemy.id">[Lv{{ enemy.level }}]</span>
                        <span>{{ enemy.name }}</span>
                        <span class="hp-tag" [class.selected]="selectedEnemy()?.id === enemy.id">HP:{{ enemy.maxHP }}</span>
                    </div>
                    }
                </div>
            </div>



            @if (isLockedOut()) {
            <div class="lockout-box" @pulse>
                <div class="lockout-icon">[X]</div>
                <div class="lockout-text">Recovery in {{ getLockoutSeconds() }}s...</div>
            </div>
            }

            <div class="action-row">
                <button class="btn" 
                        [disabled]="!selectedEnemy() || player().currentHP <= 0 || isLockedOut()"
                        (click)="beginCombat()">
                    [>] Enter Battle
                </button>
            </div>

            <div class="stats-text">
                <span>Enemies Defeated: {{ combat().enemiesDefeated }}</span>
            </div>
            } @else {
            <!-- Active Combat -->
            <div class="combat-active" @fadeSlide>
                <!-- Enemy Display -->
                <div class="entity-display" [@shake]="enemyShakeState()">
                    <div class="entity-name">{{ combat().currentEnemy?.name }}</div>
                    <pre class="ascii-art">{{ combat().currentEnemy?.ascii }}</pre>
                    <div class="hp-bar-container">
                        <div class="hp-bar-fill hp" [style.width.%]="enemyHPPercent()">
                        </div>
                        <div class="bar-text">
                            HP: {{ combat().currentEnemy?.currentHP | number:'1.0-0' }} / {{ combat().currentEnemy?.maxHP }}
                        </div>
                    </div>
                    @if (combat().enemyEffects.length > 0) {
                    <div class="effects-row">
                        @for (effect of combat().enemyEffects; track effect.name) {
                        <span class="effect-badge enemy">[{{ effect.name }}: {{ effect.remainingTurns }}]</span>
                        }
                    </div>
                    }
                </div>

                <div class="vs-divider">---VS---</div>

                <!-- Player Display -->
                <div class="entity-display" [@shake]="playerShakeState()">
                    <pre class="ascii-art">
    /\\
   /  \\
__/____\\__
  |O  O|
   \\__/
          </pre>
                    @if (totalShield() > 0) {
                    <div class="hp-bar-container">
                        <div class="hp-bar-fill shield" [style.width.%]="shieldPercent()">
                        </div>
                        <div class="bar-text">
                            Shield: {{ totalShield() | number:'1.0-0' }}
                        </div>
                    </div>
                    }
                    <div class="hp-bar-container">
                        <div class="hp-bar-fill hp" [style.width.%]="(player().currentHP / player().maxHP) * 100">
                        </div>
                        <div class="bar-text">
                            HP: {{ player().currentHP | number:'1.0-0' }} / {{ player().maxHP }}
                        </div>
                    </div>
                    <div class="hp-bar-container">
                        <div class="hp-bar-fill mp" [style.width.%]="(resources().mana / resources().maxMana) * 100">
                        </div>
                        <div class="bar-text">
                            MP: {{ resources().mana | number:'1.0-0' }} / {{ resources().maxMana }}
                        </div>
                    </div>
                    @if (nonShieldEffects().length > 0) {
                    <div class="effects-row">
                        @for (effect of nonShieldEffects(); track effect.name) {
                        <span class="effect-badge player">[{{ effect.name }}: {{ effect.remainingTurns }}]</span>
                        }
                    </div>
                    }
                </div>

                <!-- Spell Selection -->
                <div class="section-container">
                    <div class="section-header blue">Select Spell</div>
                    <div class="list-container">
                        @for (spell of craftedSpells(); track spell.id) {
                        <div class="list-item" 
                             [class.selected]="selectedSpell()?.id === spell.id"
                             [class.disabled]="resources().mana < spell.totalManaCost && selectedSpell()?.id !== spell.id"
                             (click)="selectSpell(spell)">
                            <span class="spell-symbol" [class.selected]="selectedSpell()?.id === spell.id">{{ spell.symbol }}</span>
                            <span>{{ spell.name }}</span>
                            <span class="mana-cost" [class.selected]="selectedSpell()?.id === spell.id">({{ spell.totalManaCost }}mp)</span>
                        </div>
                        } @empty {
                        <div class="empty-text">No spells available!</div>
                        }
                    </div>
                </div>

                <!-- Potion Selection (if unlocked) -->
                @if (idle().usePotionUnlocked && availablePotions().length > 0) {
                <div class="section-container">
                    <div class="section-header purple">Use Potion</div>
                    <div class="list-container short">
                        @for (potion of availablePotions(); track potion.id) {
                        <div class="list-item potion" 
                             [class.selected]="selectedPotion()?.id === potion.id"
                             (click)="selectPotion(potion)">
                            <span class="potion-symbol" [class.selected]="selectedPotion()?.id === potion.id">{{ potion.symbol }}</span>
                            <span>{{ potion.name }}</span>
                            <span class="potion-count" [class.selected]="selectedPotion()?.id === potion.id">x{{ getPotionCount(potion.id) }}</span>
                        </div>
                        }
                    </div>
                </div>
                }

                <!-- Combat Actions -->
                <div class="combat-actions">
                    <button class="btn danger" (click)="flee()">
                        [<] Flee </button>
                    @if (selectedPotion() && idle().usePotionUnlocked) {
                        <button class="btn purple" [disabled]="!canUsePotion()" (click)="useSelectedPotion()">
                            [♥] Drink!
                        </button>
                    }
                        <button class="btn" [disabled]="!canCastSpell()" (click)="castSelectedSpell()">
                            [*] Cast!
                        </button>
                </div>
            </div>
            }
        </div>
        <!-- Idle Options (always visible when unlocked) -->
            @if (idle().autoCombatUnlocked) {
            <fieldset class="idle-fieldset">
                <legend>Idle Combat</legend>
                <div class="checkbox-row">
                <label class="checkbox-label">
                    <input type="checkbox" [checked]="idle().autoCombat" (change)="toggleAutoCombat()">
                    Auto-Combat
                </label>
                <label class="checkbox-label" title="Advance to next enemy when victory is trivial (>50% HP remaining)">
                    <input type="checkbox" [checked]="idle().autoProgress" (change)="toggleAutoProgress()">
                    Auto-Progress
                </label>
                </div>
                <div class="speed-row">
                    <label>Speed:</label>
                    <select [ngModel]="idle().combatTickMs" (ngModelChange)="setCombatSpeed($event)">
                        <option [value]="2000">Slow</option>
                        <option [value]="1000">Normal</option>
                        <option [value]="500">Fast</option>
                        <option [value]="250">Very Fast</option>
                    </select>
                </div>
            </fieldset>
            }
    </app-window>
  `,
  styles: [`
    .combat-container { display: flex; flex-direction: column; }
    .combat-intro {
      padding: 8px;
      border: 1px solid var(--win95-dark-gray);
      background-color: var(--win95-white);
      margin-bottom: 8px;
      font-style: italic;
      color: var(--win95-black);
    }
    .victory-flash {
      text-align: center;
      padding: 12px;
      background-color: var(--win95-white);
      border: 2px solid #008800;
      color: #006600;
      font-weight: bold;
      margin-top: 8px;
    }
    .victory-text { font-size: 16px; }
    .lockout-box {
      text-align: center;
      padding: 8px;
      background-color: var(--win95-gray);
      border: 2px solid #cc0000;
      color: #800000;
      font-weight: bold;
      margin-top: 8px;
    }
    .lockout-icon { font-size: 16px; }
    .lockout-text { font-size: 11px; }
    .hp-bar-container {
      position: relative;
      height: 18px;
      padding: 2px;
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      box-shadow: inset 1px 1px 0 black;
      background-color: var(--win95-dark-gray);
      margin-bottom: 4px;
    }
    .hp-bar-fill {
      height: 100%;
      transition: width 0.2s ease-linear;
    }
    .hp-bar-fill.hp { background-color: #00aa00; }
    .hp-bar-fill.mp { background-color: #0066cc; }
    .hp-bar-fill.shield { background-color: #00b8b8; }
    .bar-text {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      text-shadow: 1px 1px 0 black;
    }
    .section-container { margin-top: 8px; color: var(--win95-black); }
    .section-header {
      padding: 2px 6px;
      font-weight: bold;
      margin-bottom: 4px;
      font-family: var(--win95-font-mono);
    }
    .section-header.blue { background-color: var(--win95-blue); color: white; }
    .section-header.purple { background-color: #800080; color: white; }
    .list-container {
      background-color: var(--win95-white);
      color: var(--win95-black);
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      box-shadow: inset 1px 1px 0 black;
      overflow-y: auto;
      padding: 2px;
      height: 80px;
    }
    .list-container.tall { height: 140px; }
    .list-container.short { max-height: 60px; }
    .list-item {
      display: flex;
      gap: 6px;
      font-family: var(--win95-font-mono);
      cursor: pointer;
      padding: 2px 4px;
      &:hover { background-color: var(--win95-blue); color: white; }
      &.selected { background-color: var(--win95-blue); color: white; }
      &.disabled { color: var(--win95-dark-gray); }
      &.potion:hover { background-color: #800080; }
      &.potion.selected { background-color: #800080; }
    }
    .level-tag { font-size: 10px; color: var(--win95-dark-gray); }
    .level-tag.selected { color: white; }
    .hp-tag { margin-left: auto; font-size: 10px; color: #008800; }
    .hp-tag.selected { color: white; }
    .spell-symbol { color: var(--win95-blue); }
    .spell-symbol.selected { color: white; }
    .mana-cost { margin-left: auto; font-size: 10px; color: #0066cc; }
    .mana-cost.selected { color: white; }
    .potion-symbol { color: #800080; }
    .potion-symbol.selected { color: white; }
    .potion-count { margin-left: auto; font-size: 10px; color: #008000; }
    .potion-count.selected { color: white; }
    .empty-text { color: var(--win95-dark-gray); font-style: italic; padding: 8px; text-align: center; }
    .action-row { margin-top: 8px; display: flex; justify-content: center; }
    .combat-actions { margin-top: 8px; display: flex; gap: 8px; justify-content: space-between; }
    .stats-text { text-align: center; font-size: 11px; color: #606060; margin-top: 8px; }
    .combat-active { overflow: hidden; }
    .entity-display { text-align: center; padding: 4px; }
    .entity-name { font-weight: bold; font-size: 12px; font-family: var(--win95-font-mono); color: var(--win95-black); }
    .ascii-art {
      font-family: var(--win95-font-mono);
      font-size: 10px;
      margin: 0;
      line-height: 1.1;
      color: var(--win95-black);
      text-align: left;
      display: inline-block;
      white-space: pre;
    }
    .vs-divider { text-align: center; font-weight: bold; font-size: 12px; padding: 2px; color: #800000; font-family: var(--win95-font-mono); }
    .effects-row { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; margin-top: 4px; }
    .effect-badge {
      font-size: 9px;
      padding: 1px 4px;
      font-family: var(--win95-font-mono);
      background-color: var(--win95-white);
      border: 1px solid;
    }
    .effect-badge.enemy { border-color: #800000; color: #660000; }
    .effect-badge.player { border-color: #006600; color: #006600; }
    .idle-fieldset {
      border: 1px solid var(--win95-dark-gray);
      border-top-color: white;
      border-left-color: white;
      margin-bottom: 8px;
      padding: 12px 8px 8px;
      position: relative;
      legend {
        background-color: var(--win95-gray);
        padding: 0 4px;
        font-family: var(--win95-font-system);
        font-size: 12px;
        color: var(--win95-black);
      }
    }
    .checkbox-row { display: flex; align-items: center; gap: 16px; }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: var(--win95-black);
    }
    .speed-row { display: flex; align-items: center; gap: 8px; font-size: 11px; margin-top: 4px; color: var(--win95-black); }
    .speed-row select {
      background-color: var(--win95-white);
      color: var(--win95-black);
      border: 2px solid;
      border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
      box-shadow: inset 1px 1px 0 black;
      padding: 4px;
      font-family: var(--win95-font-system);
      font-size: 12px;
    }
    .text-center { text-align: center; }
    .p-1 { padding: 4px; }
  `]
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

  // Shield bar computed signals
  readonly totalShield = computed(() => {
    return this.combat().playerEffects
      .filter(e => e.type === 'shield')
      .reduce((sum, e) => sum + e.value, 0);
  });

  readonly maxShield = computed(() => {
    // Max shield is the player's maxHP for visual consistency
    return this.player().maxHP;
  });

  readonly shieldPercent = computed(() => {
    const shield = this.totalShield();
    const max = this.maxShield();
    if (max <= 0) return 0;
    return Math.min(100, (shield / max) * 100);
  });

  // Filter out shield effects from the text badge display
  readonly nonShieldEffects = computed(() => {
    return this.combat().playerEffects.filter(e => e.type !== 'shield');
  });

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

  toggleAutoProgress(): void {
    this.gameState.setAutoProgress(!this.idle().autoProgress);
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
