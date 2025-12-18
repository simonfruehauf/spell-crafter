import { Injectable, signal } from '@angular/core';
import { Player } from '../models/game.interfaces';

export interface PlayerSignals {
    player: ReturnType<typeof signal<Player>>;
}

export interface PlayerCallbacks {
    addGold: (amount: number) => void;
    getResourceGold: () => number;
    addCombatLog: (msg: string, type: 'damage' | 'heal' | 'info' | 'victory' | 'defeat' | 'loot' | 'effect' | 'crit') => void;
}

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private signals: PlayerSignals | null = null;
    private callbacks: PlayerCallbacks | null = null;

    registerSignals(signals: PlayerSignals): void {
        this.signals = signals;
    }

    registerCallbacks(callbacks: PlayerCallbacks): void {
        this.callbacks = callbacks;
    }

    createInitialPlayer(): Player {
        return {
            id: 'player', name: 'Apprentice',
            WIS: 1, HP: 50, ARC: 1, VIT: 1, BAR: 0, LCK: 1, SPD: 1, CHA: 1,
            currentHP: 50, maxHP: 50, currentMana: 0, maxMana: 25,
            level: 1, experience: 0, experienceToLevel: 100, attributePoints: 0
        };
    }

    getExperienceToLevel(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    checkLevelUp(): void {
        if (!this.signals || !this.callbacks) return;
        const player = this.signals.player();
        const expNeeded = player.experienceToLevel;
        if (player.experience >= expNeeded) {
            this.signals.player.update(p => ({
                ...p,
                experience: p.experience - expNeeded,
                level: p.level + 1,
                experienceToLevel: this.getExperienceToLevel(p.level + 1),
                attributePoints: p.attributePoints + 2,
                maxHP: p.maxHP + 10,
                currentHP: Math.min(p.currentHP + 10, p.maxHP + 10)
            }));
            this.callbacks.addCombatLog(`Level Up! You are now level ${this.signals.player().level}!`, 'victory');
        }
    }

    spendAttributePoint(stat: 'WIS' | 'ARC' | 'VIT' | 'BAR' | 'LCK' | 'SPD' | 'CHA'): boolean {
        if (!this.signals) return false;
        const player = this.signals.player();
        if (player.attributePoints <= 0) return false;
        this.signals.player.update(p => ({ ...p, [stat]: p[stat] + 1, attributePoints: p.attributePoints - 1 }));
        return true;
    }

    respecStats(): boolean {
        if (!this.signals || !this.callbacks) return false;
        const p = this.signals.player();
        const cost = 100 + (p.level * 50);
        if (this.callbacks.getResourceGold() < cost) return false;

        this.callbacks.addGold(-cost);
        const totalInvested = (p.WIS - 1) + (p.ARC - 1) + (p.VIT - 1) + (p.BAR - 0) + (p.LCK - 1) + (p.SPD - 1) + (p.CHA - 1);
        this.signals.player.update(prev => ({
            ...prev, WIS: 1, ARC: 1, VIT: 1, BAR: 0, LCK: 1, SPD: 1, CHA: 1,
            attributePoints: prev.attributePoints + totalInvested
        }));
        this.callbacks.addCombatLog('Stats reset! Points refunded.', 'info');
        return true;
    }

    tickHPRegen(): void {
        if (!this.signals) return;
        const player = this.signals.player();
        if (player.currentHP < player.maxHP) {
            this.signals.player.update(p => ({ ...p, currentHP: Math.min(p.maxHP, p.currentHP + p.VIT * 0.02) }));
        }
    }
}
