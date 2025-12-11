import { Injectable, signal } from '@angular/core';
import {
    CombatState, CombatLogEntry, Enemy, Player, Spell, Rune,
    ActiveEffect, LootDrop, IdleSettings
} from '../models/game.interfaces';
import { RESOURCE_NAMES } from '../models/resources.data';

export interface CombatSignals {
    combat: ReturnType<typeof signal<CombatState>>;
    player: ReturnType<typeof signal<Player>>;
    craftedSpells: ReturnType<typeof signal<Spell[]>>;
    idle: ReturnType<typeof signal<IdleSettings>>;
}

export interface CombatCallbacks {
    spendMana: (amount: number) => boolean;
    addMana: (amount: number) => void;
    addGold: (amount: number) => void;
    addCraftingResource: (id: string, amount: number) => void;
    getUpgradeBonus: (type: string) => number;
    addSpellExperience: (spellId: string, xp: number) => void;
}

@Injectable({ providedIn: 'root' })
export class CombatService {
    private signals: CombatSignals | null = null;
    private callbacks: CombatCallbacks | null = null;

    registerSignals(signals: CombatSignals): void {
        this.signals = signals;
    }

    registerCallbacks(callbacks: CombatCallbacks): void {
        this.callbacks = callbacks;
    }

    createInitialCombatState(): CombatState {
        return {
            inCombat: false,
            currentEnemy: null,
            combatLog: [],
            playerTurn: true,
            autoCombat: false,
            combatSpeed: 1000,
            selectedSpellId: null,
            playerEffects: [],
            enemyEffects: [],
            enemiesDefeated: 0,
            enemyDefeats: {},
            deathLockoutUntil: 0
        };
    }

    getSelectedSpell(): Spell | null {
        if (!this.signals) return null;
        const combat = this.signals.combat();
        const spells = this.signals.craftedSpells();
        if (combat.selectedSpellId) {
            return spells.find(s => s.id === combat.selectedSpellId) || spells[0] || null;
        }
        return spells[0] || null;
    }

    setSelectedSpell(id: string): void {
        if (!this.signals) return;
        this.signals.combat.update(c => ({ ...c, selectedSpellId: id }));
    }

    startCombat(enemy: Enemy): void {
        if (!this.signals) return;
        const spells = this.signals.craftedSpells();
        this.signals.combat.update(c => ({
            ...c,
            inCombat: true,
            currentEnemy: { ...enemy, currentHP: enemy.maxHP },
            combatLog: [],
            playerTurn: true,
            playerEffects: [],
            enemyEffects: [],
            selectedSpellId: c.selectedSpellId || (spells[0]?.id ?? null),
        }));
        this.addCombatLog(`A ${enemy.name} appears!`, 'info');
    }

    castSpell(spell: Spell): void {
        if (!this.signals || !this.callbacks) return;

        const combat = this.signals.combat();
        if (!combat.inCombat || !combat.currentEnemy || !combat.playerTurn) return;

        if (!this.callbacks.spendMana(spell.totalManaCost)) {
            this.addCombatLog('Not enough mana!', 'info');
            return;
        }

        const player = this.signals.player();
        const enemy = combat.currentEnemy;
        this.addCombatLog(`You cast ${spell.name}!`, 'info');

        // Apply weakness/resistance
        let dmgMultiplier = 1;
        for (const dt of spell.damageTypes) {
            if (enemy.weakness === dt) dmgMultiplier *= 1.5;
            if (enemy.resistance === dt) dmgMultiplier *= 0.5;
        }

        for (const rune of spell.runes) {
            this.applyRuneEffect(rune, player, enemy, dmgMultiplier);
        }

        if (spell.isDefault) {
            const d = Math.floor(spell.calculatedDamage * dmgMultiplier);
            const actual = Math.max(1, d - Math.floor(enemy.BAR * 0.5));
            this.signals.combat.update(c => ({
                ...c,
                currentEnemy: c.currentEnemy
                    ? { ...c.currentEnemy, currentHP: c.currentEnemy.currentHP - actual }
                    : null
            }));
            this.addCombatLog(`  ${spell.symbol} deals ${actual} damage!`, 'damage');
        }

        // Award spell XP
        this.callbacks.addSpellExperience(spell.id, 5 + spell.runes.length * 2);

        this.processEnemyEffects();

        if ((this.signals.combat().currentEnemy?.currentHP ?? 0) <= 0) {
            this.endCombat(true);
            return;
        }

        this.signals.combat.update(c => ({ ...c, playerTurn: false }));

        if (!this.signals.idle().autoCombat) {
            setTimeout(() => this.enemyTurn(), 500);
        } else {
            this.enemyTurn();
        }
    }

    private applyRuneEffect(rune: Rune, player: Player, enemy: Enemy, dmgMult: number): void {
        if (!this.signals || !this.callbacks) return;

        const effect = rune.effect;
        const arc = 1 + player.ARC * 0.1 + this.callbacks.getUpgradeBonus('damage') / 100;
        const critChance = this.callbacks.getUpgradeBonus('critChance') / 100;
        const critDmg = 1.5 + this.callbacks.getUpgradeBonus('critDamage') / 100;
        const isCrit = Math.random() < critChance;

        switch (effect.type) {
            case 'damage': {
                let d = Math.floor(effect.value * arc * dmgMult);
                if (isCrit) {
                    d = Math.floor(d * critDmg);
                    this.addCombatLog(`  CRITICAL!`, 'crit');
                }
                const actual = Math.max(1, d - Math.floor(enemy.BAR * 0.5));
                this.signals.combat.update(c => ({
                    ...c,
                    currentEnemy: c.currentEnemy
                        ? { ...c.currentEnemy, currentHP: c.currentEnemy.currentHP - actual }
                        : null
                }));
                this.addCombatLog(`  ${rune.symbol} ${rune.name} deals ${actual} damage!`, 'damage');
                break;
            }
            case 'heal': {
                this.signals.player.update(p => ({
                    ...p,
                    currentHP: Math.min(p.maxHP, p.currentHP + effect.value)
                }));
                this.addCombatLog(`  ${rune.symbol} heals ${effect.value}!`, 'heal');
                break;
            }
            case 'dot': {
                this.signals.combat.update(c => ({
                    ...c,
                    enemyEffects: [...c.enemyEffects, {
                        name: rune.name,
                        type: 'dot',
                        value: effect.value,
                        remainingTurns: effect.duration || 3
                    }]
                }));
                this.addCombatLog(`  ${rune.symbol} applies DoT!`, 'effect');
                break;
            }
            case 'hot': {
                this.signals.combat.update(c => ({
                    ...c,
                    playerEffects: [...c.playerEffects, {
                        name: rune.name,
                        type: 'hot',
                        value: effect.value,
                        remainingTurns: effect.duration || 3
                    }]
                }));
                this.addCombatLog(`  ${rune.symbol} applies HoT!`, 'effect');
                break;
            }
            case 'buff': {
                this.signals.combat.update(c => ({
                    ...c,
                    playerEffects: [...c.playerEffects, {
                        name: rune.name,
                        type: 'buff',
                        value: effect.value,
                        remainingTurns: effect.duration || 3,
                        targetStat: effect.targetStat
                    }]
                }));
                this.addCombatLog(`  ${rune.symbol} buffs ${effect.targetStat}!`, 'effect');
                break;
            }
            case 'debuff': {
                this.signals.combat.update(c => ({
                    ...c,
                    enemyEffects: [...c.enemyEffects, {
                        name: rune.name,
                        type: 'debuff',
                        value: effect.value,
                        remainingTurns: effect.duration || 3,
                        targetStat: effect.targetStat
                    }]
                }));
                this.addCombatLog(`  ${rune.symbol} debuffs ${effect.targetStat}!`, 'effect');
                break;
            }
            case 'lifesteal': {
                let d = Math.floor(effect.value * arc * dmgMult);
                const actual = Math.max(1, d - Math.floor(enemy.BAR * 0.5));
                const heal = Math.floor(actual * (effect.secondaryValue || 0.5));
                this.signals.combat.update(c => ({
                    ...c,
                    currentEnemy: c.currentEnemy
                        ? { ...c.currentEnemy, currentHP: c.currentEnemy.currentHP - actual }
                        : null
                }));
                this.signals.player.update(p => ({
                    ...p,
                    currentHP: Math.min(p.maxHP, p.currentHP + heal)
                }));
                this.addCombatLog(`  ${rune.symbol} deals ${actual}, heals ${heal}!`, 'damage');
                break;
            }
            case 'shield': {
                this.signals.combat.update(c => ({
                    ...c,
                    playerEffects: [...c.playerEffects, {
                        name: rune.name,
                        type: 'shield',
                        value: effect.value,
                        remainingTurns: effect.duration || 2
                    }]
                }));
                this.addCombatLog(`  ${rune.symbol} creates ${effect.value} shield!`, 'effect');
                break;
            }
            case 'manaDrain': {
                const actual = Math.max(1, Math.floor(effect.value * arc) - Math.floor(enemy.BAR * 0.5));
                this.signals.combat.update(c => ({
                    ...c,
                    currentEnemy: c.currentEnemy
                        ? { ...c.currentEnemy, currentHP: c.currentEnemy.currentHP - actual }
                        : null
                }));
                this.callbacks.addMana(effect.secondaryValue || 5);
                this.addCombatLog(`  ${rune.symbol} deals ${actual}, restores mana!`, 'damage');
                break;
            }
            default: {
                const d = Math.floor(effect.value * arc * dmgMult);
                const actual = Math.max(1, d - Math.floor(enemy.BAR * 0.5));
                this.signals.combat.update(c => ({
                    ...c,
                    currentEnemy: c.currentEnemy
                        ? { ...c.currentEnemy, currentHP: c.currentEnemy.currentHP - actual }
                        : null
                }));
                this.addCombatLog(`  ${rune.symbol} deals ${actual}!`, 'damage');
            }
        }
    }

    private processEnemyEffects(): void {
        if (!this.signals) return;

        const combat = this.signals.combat();
        const remaining: ActiveEffect[] = [];

        for (const e of combat.enemyEffects) {
            if (e.type === 'dot') {
                this.signals.combat.update(x => ({
                    ...x,
                    currentEnemy: x.currentEnemy
                        ? { ...x.currentEnemy, currentHP: x.currentEnemy.currentHP - e.value }
                        : null
                }));
                this.addCombatLog(`  ${e.name} deals ${e.value}!`, 'damage');
            }
            if (e.remainingTurns > 1) {
                remaining.push({ ...e, remainingTurns: e.remainingTurns - 1 });
            }
        }

        this.signals.combat.update(x => ({ ...x, enemyEffects: remaining }));
    }

    private enemyTurn(): void {
        if (!this.signals) return;

        const combat = this.signals.combat();
        if (!combat.inCombat || !combat.currentEnemy) return;

        // Process player effects
        const remaining: ActiveEffect[] = [];
        for (const e of combat.playerEffects) {
            if (e.type === 'hot') {
                this.signals.player.update(p => ({
                    ...p,
                    currentHP: Math.min(p.maxHP, p.currentHP + e.value)
                }));
                this.addCombatLog(`  ${e.name} heals ${e.value}!`, 'heal');
            }
            if (e.remainingTurns > 1) {
                remaining.push({ ...e, remainingTurns: e.remainingTurns - 1 });
            }
        }
        this.signals.combat.update(x => ({ ...x, playerEffects: remaining }));

        const enemy = combat.currentEnemy;
        const player = this.signals.player();
        let shield = combat.playerEffects
            .filter(e => e.type === 'shield')
            .reduce((s, e) => s + e.value, 0);
        const baseDmg = enemy.ARC * 2;
        let dmg = Math.max(1, baseDmg - Math.floor(player.BAR * 0.5));

        if (shield > 0) {
            const absorbed = Math.min(shield, dmg);
            dmg -= absorbed;
            this.signals.combat.update(x => ({
                ...x,
                playerEffects: x.playerEffects
                    .map(e => e.type === 'shield' ? { ...e, value: e.value - absorbed } : e)
                    .filter(e => e.type !== 'shield' || e.value > 0)
            }));
            if (absorbed > 0) this.addCombatLog(`  Shield absorbs ${absorbed}!`, 'effect');
        }

        if (dmg > 0) {
            this.signals.player.update(p => ({ ...p, currentHP: p.currentHP - dmg }));
            this.addCombatLog(`${enemy.name} attacks for ${dmg}!`, 'damage');
        }

        if (this.signals.player().currentHP <= 0) {
            this.endCombat(false);
            return;
        }

        this.signals.combat.update(x => ({ ...x, playerTurn: true }));
    }

    private endCombat(victory: boolean): void {
        if (!this.signals || !this.callbacks) return;

        const combat = this.signals.combat();
        const enemy = combat.currentEnemy;

        if (victory && enemy) {
            this.callbacks.addGold(enemy.goldReward);
            this.signals.player.update(p => ({
                ...p,
                experience: p.experience + enemy.expReward
            }));
            this.addCombatLog(`Victory! +${enemy.goldReward} gold, +${enemy.expReward} exp`, 'victory');
            this.processLoot(enemy.lootTable);

            this.signals.combat.update(x => ({
                ...x,
                enemiesDefeated: x.enemiesDefeated + 1,
                enemyDefeats: {
                    ...x.enemyDefeats,
                    [enemy.id]: (x.enemyDefeats[enemy.id] || 0) + 1
                }
            }));

            if (this.signals.idle().autoCombat) {
                setTimeout(() => {
                    if (this.signals?.idle().autoCombat && this.signals.player().currentHP > 0) {
                        this.startCombat(enemy);
                    }
                }, 1000);
                return;
            }
        } else {
            this.addCombatLog('You have been defeated... (30s lockout)', 'defeat');
            this.signals.player.update(p => ({
                ...p,
                currentHP: Math.floor(p.maxHP * 0.25)
            }));
            this.signals.combat.update(x => ({
                ...x,
                deathLockoutUntil: Date.now() + 30000
            }));
        }

        this.signals.combat.update(x => ({
            ...x,
            inCombat: false,
            currentEnemy: null,
            playerTurn: true,
            playerEffects: [],
            enemyEffects: []
        }));
    }

    private processLoot(table: LootDrop[]): void {
        if (!this.callbacks) return;

        const lootMult = 1 + this.callbacks.getUpgradeBonus('lootChance') / 100;
        const qtyMult = 1 + this.callbacks.getUpgradeBonus('lootQuantity') / 100;

        for (const drop of table) {
            if (Math.random() < drop.chance * lootMult) {
                const amt = Math.ceil(
                    (Math.floor(Math.random() * (drop.maxAmount - drop.minAmount + 1)) + drop.minAmount) * qtyMult
                );
                this.callbacks.addCraftingResource(drop.resourceId, amt);
                this.addCombatLog(
                    `  Loot: ${amt}x ${RESOURCE_NAMES[drop.resourceId] || drop.resourceId}`,
                    'loot'
                );
            }
        }
    }

    fleeCombat(): void {
        if (!this.signals) return;
        this.addCombatLog('You flee!', 'info');
        this.signals.combat.update(x => ({
            ...x,
            inCombat: false,
            currentEnemy: null,
            playerTurn: true,
            playerEffects: [],
            enemyEffects: []
        }));
    }

    addCombatLog(msg: string, type: CombatLogEntry['type']): void {
        if (!this.signals) return;
        this.signals.combat.update(c => ({
            ...c,
            combatLog: [
                ...c.combatLog.slice(-50),
                { timestamp: new Date(), message: msg, type }
            ]
        }));
    }

    autoCombatTick(): void {
        if (!this.signals) return;
        const combat = this.signals.combat();
        if (!combat.inCombat || !combat.currentEnemy || !combat.playerTurn) return;

        const spell = this.getSelectedSpell();
        if (spell) {
            this.castSpell(spell);
        }
    }
}
