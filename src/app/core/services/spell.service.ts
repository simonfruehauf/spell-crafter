import { Injectable, signal } from '@angular/core';
import { Spell, Rune, ResourceCost } from '../models/game.interfaces';
import { MAGIC_MISSILE } from '../models/game.data';
import { RESOURCE_NAMES } from '../models/resources.data';

export interface SpellSignals {
    craftedSpells: ReturnType<typeof signal<Spell[]>>;
}

export interface SpellCallbacks {
    spendCraftingResources: (costs: ResourceCost[]) => boolean;
    addCraftingResource: (id: string, amount: number) => void;
    getUpgradeBonus: (type: string) => number;
    getPlayerARC: () => number;
    addCombatLog: (msg: string, type: 'damage' | 'heal' | 'info' | 'victory' | 'defeat' | 'loot' | 'effect' | 'crit') => void;
}

@Injectable({ providedIn: 'root' })
export class SpellService {
    private signals: SpellSignals | null = null;
    private callbacks: SpellCallbacks | null = null;

    registerSignals(signals: SpellSignals): void {
        this.signals = signals;
    }

    registerCallbacks(callbacks: SpellCallbacks): void {
        this.callbacks = callbacks;
    }

    createInitialSpells(): Spell[] {
        return [MAGIC_MISSILE];
    }

    craftSpell(name: string, runes: Rune[], materialCost: ResourceCost[], customSymbol?: string): Spell | null {
        if (!this.signals || !this.callbacks) return null;
        if (runes.length === 0) return null;
        if (!this.callbacks.spendCraftingResources(materialCost)) return null;

        const playerARC = this.callbacks.getPlayerARC();
        const damageBonus = this.callbacks.getUpgradeBonus('damage');
        const totalMana = runes.reduce((s, r) => s + r.manaCost, 0);
        const baseDmg = runes.reduce((s, r) => s + r.baseDamage, 0);
        const dmgMult = 1 + playerARC * 0.1 + damageBonus / 100;
        const dmgTypes = [...new Set(runes.map(r => r.damageType))];

        const spell: Spell = {
            id: `spell-${Date.now()}`,
            name,
            runes: [...runes],
            totalManaCost: totalMana,
            calculatedDamage: Math.floor(baseDmg * dmgMult),
            description: `Woven from ${runes.map(r => r.name).join(', ')}.`,
            symbol: customSymbol || runes[0]?.symbol || '[*]',
            damageTypes: dmgTypes,
            craftCost: materialCost,
            experience: 0,
            level: 1,
        };

        this.signals.craftedSpells.update(s => [...s, spell]);
        return spell;
    }

    addSpellExperience(spellId: string, xp: number): void {
        if (!this.signals) return;
        this.signals.craftedSpells.update(spells => spells.map(s => {
            if (s.id !== spellId) return s;
            let newXp = s.experience + xp;
            let newLevel = s.level;
            const xpToLevel = s.level * 50;
            while (newXp >= xpToLevel && newLevel < 10) {
                newXp -= xpToLevel;
                newLevel++;
            }
            return { ...s, experience: newXp, level: newLevel };
        }));
    }

    deleteSpell(id: string): void {
        if (!this.signals) return;
        this.signals.craftedSpells.update(s => s.filter(x => x.id !== id && !x.isDefault));
    }

    uncraftSpell(id: string): boolean {
        if (!this.signals || !this.callbacks) return false;
        const spells = this.signals.craftedSpells();
        const spell = spells.find(s => s.id === id);
        if (!spell || spell.isDefault) return false;

        const refund: { resourceId: string; amount: number }[] = [];
        for (const cost of spell.craftCost) {
            const amount = Math.floor(cost.amount * 0.5);
            if (amount > 0) refund.push({ resourceId: cost.resourceId, amount });
        }

        for (const item of refund) {
            this.callbacks.addCraftingResource(item.resourceId, item.amount);
        }

        if (refund.length > 0) {
            const refundText = refund.map(r => `${r.amount} ${RESOURCE_NAMES[r.resourceId] || r.resourceId}`).join(', ');
            this.callbacks.addCombatLog(`Uncrafted ${spell.name}. Refunded: ${refundText}`, 'info');
        } else {
            this.callbacks.addCombatLog(`Uncrafted ${spell.name}. No resources salvaged.`, 'info');
        }

        this.deleteSpell(id);
        return true;
    }
}
