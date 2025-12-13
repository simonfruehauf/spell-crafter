import { Component, inject, signal, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { Spell, Enemy } from '../../core/models/game.interfaces';
import { ENEMIES } from '../../core/models/game.data';
import { fadeSlide, pulse } from '../../shared/animations/animations';

@Component({
  selector: 'app-combat',
  standalone: true,
  imports: [CommonModule, FormsModule, WindowComponent],
  templateUrl: './combat.component.html',
  styleUrl: './combat.component.scss',
  animations: [fadeSlide, pulse],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombatComponent {
  @Output() closed = new EventEmitter<void>();

  private gameState = inject(GameStateService);

  readonly player = this.gameState.player;
  readonly resources = this.gameState.resources;
  readonly combat = this.gameState.combat;
  readonly craftedSpells = this.gameState.craftedSpells;
  readonly idle = this.gameState.idle;

  readonly enemies = ENEMIES;
  readonly selectedEnemy = signal<Enemy | null>(null);
  readonly selectedSpell = signal<Spell | null>(null);

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

  onClose(): void {
    this.closed.emit();
  }
}
