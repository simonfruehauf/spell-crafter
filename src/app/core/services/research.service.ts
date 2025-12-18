import { Injectable, signal } from '@angular/core';
import {
    ResearchNode, WindowStates, Player, Rune, Upgrade, ResourceCost
} from '../models/game.interfaces';
import { RUNES, INITIAL_RESEARCH_TREE, INITIAL_UPGRADES } from '../models/game.data';

export interface ResearchSignals {
    researchTree: ReturnType<typeof signal<ResearchNode[]>>;
    windows: ReturnType<typeof signal<WindowStates>>;
    player: ReturnType<typeof signal<Player>>;
    knownRunes: ReturnType<typeof signal<Rune[]>>;
    upgrades: ReturnType<typeof signal<Upgrade[]>>;
}

export interface ResearchCallbacks {
    spendMana: (amount: number) => boolean;
    unlockAutoCombat: () => void;
    unlockPassiveManaRegen: () => void;
    unlockUsePotions: () => void;
    unlockGoblinApprentice: () => void;
    unlockSpellbook: () => void;
    increaseMaxMana: (amount: number) => void;
    canAffordResources: (costs: ResourceCost[]) => boolean;
    spendCraftingResources: (costs: ResourceCost[]) => boolean;
}

@Injectable({ providedIn: 'root' })
export class ResearchService {
    private signals: ResearchSignals | null = null;
    private callbacks: ResearchCallbacks | null = null;

    registerSignals(signals: ResearchSignals): void {
        this.signals = signals;
    }

    registerCallbacks(callbacks: ResearchCallbacks): void {
        this.callbacks = callbacks;
    }

    createInitialResearchTree(): ResearchNode[] {
        return [...INITIAL_RESEARCH_TREE];
    }

    createInitialUpgrades(): Upgrade[] {
        return structuredClone(INITIAL_UPGRADES);
    }

    // Research methods
    canResearch(id: string, currentMana: number): boolean {
        if (!this.signals || !this.callbacks) return false;
        const node = this.signals.researchTree().find(x => x.id === id);
        if (!node || node.researched || !node.unlocked) return false;

        const hasMana = currentMana >= node.manaCost;
        const hasResources = node.resourceCost ? this.callbacks.canAffordResources(node.resourceCost) : true;

        return hasMana && hasResources;
    }

    research(id: string, currentMana: number): boolean {
        if (!this.signals || !this.callbacks) return false;

        const tree = this.signals.researchTree();
        const idx = tree.findIndex(x => x.id === id);
        if (idx === -1) return false;

        const node = tree[idx];
        if (!this.canResearch(id, currentMana)) return false;

        this.callbacks.spendMana(node.manaCost);
        if (node.resourceCost) {
            this.callbacks.spendCraftingResources(node.resourceCost);
        }

        this.signals.researchTree.update(t => {
            const updated = [...t];
            updated[idx] = { ...updated[idx], researched: true };
            return updated;
        });

        this.applyResearchEffect(node);
        this.unlockDependentNodes(id);
        return true;
    }

    private applyResearchEffect(node: ResearchNode): void {
        if (!this.signals || !this.callbacks) return;

        const effect = node.unlockEffect;

        switch (effect.type) {
            case 'window': {
                this.signals.windows.update(w => ({
                    ...w,
                    [effect.windowId]: { unlocked: true, visible: true }
                }));
                // When armory is unlocked, also unlock equipment window
                if (effect.windowId === 'armory') {
                    this.signals.windows.update(w => ({
                        ...w,
                        equipment: { unlocked: true, visible: true }
                    }));
                }
                break;
            }

            case 'rune': {
                if (RUNES[effect.runeId]) {
                    this.signals.knownRunes.update(r => [...r, RUNES[effect.runeId]]);
                }
                break;
            }

            case 'stat': {
                this.signals.player.update(p => ({
                    ...p,
                    [effect.stat]: p[effect.stat] + effect.value
                }));
                break;
            }

            case 'idle': {
                if (effect.idleId === 'autoMeditate') { /* Removed */ }
                if (effect.idleId === 'autoCombat') this.callbacks.unlockAutoCombat();
                if (effect.idleId === 'passiveManaRegen') this.callbacks.unlockPassiveManaRegen();
                if (effect.idleId === 'usePotionUnlocked') this.callbacks.unlockUsePotions();
                break;
            }

            case 'maxMana': {
                this.callbacks.increaseMaxMana(effect.value);
                break;
            }
        }
    }

    private unlockDependentNodes(completedId: string): void {
        if (!this.signals) return;

        this.signals.researchTree.update(tree =>
            tree.map(node => {
                if (node.unlocked) return node;
                const allPrereqsMet = node.prerequisites.every(
                    prereq => tree.find(x => x.id === prereq)?.researched
                );
                if (allPrereqsMet && node.prerequisites.includes(completedId)) {
                    return { ...node, unlocked: true };
                }
                return node;
            })
        );
    }

    // Upgrade methods
    getUpgradeBonus(type: string): number {
        if (!this.signals) return 0;

        let total = 0;
        for (const upgrade of this.signals.upgrades()) {
            if (upgrade.level > 0) {
                const effect = upgrade.effect;
                if (effect.type === 'manaRegen' && type === 'manaRegen')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'combatSpeed' && type === 'combatSpeed')
                    total += effect.msReductionPerLevel * upgrade.level;
                if (effect.type === 'damage' && type === 'damage')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'critChance' && type === 'critChance')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'critDamage' && type === 'critDamage')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'lootChance' && type === 'lootChance')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'lootQuantity' && type === 'lootQuantity')
                    total += effect.percentPerLevel * upgrade.level;
                if (effect.type === 'maxRunes' && type === 'maxRunes')
                    total += effect.valuePerLevel * upgrade.level;
                if (effect.type === 'gardenPlot' && type === 'gardenPlot')
                    total += effect.valuePerLevel * upgrade.level;
            }
        }
        return total;
    }

    getMaxRunesPerSpell(): number {
        return 3 + this.getUpgradeBonus('maxRunes');
    }

    getUpgradeCost(upgrade: Upgrade): ResourceCost[] {
        return upgrade.cost.map(c => ({
            ...c,
            amount: Math.ceil(c.amount * Math.pow(upgrade.costMultiplier, upgrade.level))
        }));
    }

    canAffordUpgrade(id: string): boolean {
        if (!this.signals || !this.callbacks) return false;

        const upgrade = this.signals.upgrades().find(x => x.id === id);
        if (!upgrade || upgrade.level >= upgrade.maxLevel || !upgrade.unlocked) return false;
        return this.callbacks.canAffordResources(this.getUpgradeCost(upgrade));
    }

    purchaseUpgrade(id: string): boolean {
        if (!this.signals || !this.callbacks) return false;

        const upgrades = this.signals.upgrades();
        const idx = upgrades.findIndex(x => x.id === id);
        if (idx === -1) return false;

        const upgrade = upgrades[idx];
        if (upgrade.level >= upgrade.maxLevel || !upgrade.unlocked) return false;

        const cost = this.getUpgradeCost(upgrade);
        if (!this.callbacks.spendCraftingResources(cost)) return false;

        // Apply effect
        const effect = upgrade.effect;
        switch (effect.type) {
            case 'stat': {
                this.signals.player.update(p => ({
                    ...p,
                    [effect.stat]: p[effect.stat] + effect.valuePerLevel
                }));

                break;
            }
            case 'maxMana': {
                this.callbacks.increaseMaxMana(effect.valuePerLevel);

                break;
            }
            case 'unlockFeature': {
                // Handle feature unlocks (like goblin apprentice, spellbook)
                if (effect.feature === 'goblinApprentice') {
                    this.callbacks.unlockGoblinApprentice();
                    this.signals.windows.update(w => ({
                        ...w,
                        goblinApprentice: { ...w.goblinApprentice, unlocked: true, visible: true }
                    }));
                } else if (effect.feature === 'spellbook') {
                    this.callbacks.unlockSpellbook();
                    this.signals.windows.update(w => ({
                        ...w,
                        spellbook: { ...w.spellbook, unlocked: true, visible: true }
                    }));
                }

                break;
            }
            // No default
        }

        // Increment level
        this.signals.upgrades.update(arr => {
            const copy = [...arr];
            copy[idx] = { ...copy[idx], level: copy[idx].level + 1 };
            return copy;
        });

        // Unlock dependents
        this.signals.upgrades.update(arr =>
            arr.map(x => {
                if (x.prerequisite === id && !x.unlocked) {
                    return { ...x, unlocked: true };
                }
                return x;
            })
        );

        return true;
    }
}
