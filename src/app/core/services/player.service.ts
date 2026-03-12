import { Injectable, signal, inject } from '@angular/core';
import { Player } from '../models/game.interfaces';

export interface PlayerSignals {
    player: ReturnType<typeof signal<Player>>;
}

import { EventBusService } from './event-bus.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private signals: PlayerSignals | null = null;
    private eventBus = inject(EventBusService);

    registerSignals(signals: PlayerSignals): void { this.signals = signals; }

    getPlayer(): Player | null {
        return this.signals ? this.signals.player() : null;
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
        if (!this.signals) return;
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
            this.eventBus.emit({
                type: 'COMBAT_LOG',
                payload: { message: `Level Up! You are now level ${this.signals.player().level}!`, logType: 'victory' }
            });
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
        if (!this.signals) return false;
        const p = this.signals.player();
        const cost = 100 + (p.level * 50);

        let success = false;
        this.eventBus.emit({
            type: 'RESOURCE_SPEND_REQUESTED',
            payload: { costs: [{ resourceId: 'gold', amount: cost }], reason: 'respec', resolve: (s: boolean) => success = s }
        });
        
        if (!success) return false;

        const totalInvested = (p.WIS - 1) + (p.ARC - 1) + (p.VIT - 1) + (p.BAR - 0) + (p.LCK - 1) + (p.SPD - 1) + (p.CHA - 1);
        this.signals.player.update(prev => ({
            ...prev, WIS: 1, ARC: 1, VIT: 1, BAR: 0, LCK: 1, SPD: 1, CHA: 1,
            attributePoints: prev.attributePoints + totalInvested
        }));
        this.eventBus.emit({
            type: 'COMBAT_LOG',
            payload: { message: 'Stats reset! Points refunded.', logType: 'info' }
        });
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
