import { Injectable, signal, computed, Signal } from '@angular/core';
import { EquipmentItem, EquipmentRecipe, EquippedItems, EquipmentSlot, PlayerStats, ResourceCost } from '../models/game.interfaces';
import { INITIAL_EQUIPMENT_RECIPES } from '../models/equipment.data';
import { deepClone } from '../../shared/utils/clone.utils';

export interface EquipmentSignals {
    equippedItems: ReturnType<typeof signal<EquippedItems>>;
    craftedEquipment: ReturnType<typeof signal<EquipmentItem[]>>;
    equipmentRecipes: ReturnType<typeof signal<EquipmentRecipe[]>>;
}

export interface EquipmentCallbacks {
    canAffordResources: (costs: ResourceCost[]) => boolean;
    spendCraftingResources: (costs: ResourceCost[]) => boolean;
}

// Precomputed bonus cache for O(1) lookups
interface EquipmentBonusCache {
    stats: Record<string, number>;
    other: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class EquipmentService {
    private signals: EquipmentSignals | null = null;
    private callbacks: EquipmentCallbacks | null = null;
    private bonusCache: Signal<EquipmentBonusCache> | null = null;

    registerSignals(signals: EquipmentSignals): void {
        this.signals = signals;
        this.bonusCache = computed(() => this.computeAllBonuses(signals.equippedItems()));
    }

    registerCallbacks(callbacks: EquipmentCallbacks): void { this.callbacks = callbacks; }

    private computeAllBonuses(equipped: EquippedItems): EquipmentBonusCache {
        const cache: EquipmentBonusCache = {
            stats: { WIS: 0, ARC: 0, VIT: 0, BAR: 0, LCK: 0, SPD: 0, CHA: 0 },
            other: { maxHP: 0, maxMana: 0, damagePercent: 0, critChance: 0, critDamage: 0, lootChance: 0, lootQuantity: 0 }
        };

        for (const slot of Object.keys(equipped) as EquipmentSlot[]) {
            const item = equipped[slot];
            if (!item) continue;

            for (const bonus of item.bonuses) {
                if (bonus.type === 'stat' && bonus.stat) {
                    cache.stats[bonus.stat] = (cache.stats[bonus.stat] || 0) + bonus.value;
                } else if (bonus.type !== 'stat') {
                    cache.other[bonus.type] = (cache.other[bonus.type] || 0) + bonus.value;
                }
            }
        }

        return cache;
    }

    createInitialEquippedItems(): EquippedItems {
        return { head: null, face: null, accessory: null, body: null, handL: null, handR: null, relic: null };
    }

    createInitialEquipmentRecipes(): EquipmentRecipe[] {
        return deepClone(INITIAL_EQUIPMENT_RECIPES);
    }

    craftEquipment(recipeId: string): boolean {
        if (!this.signals || !this.callbacks) return false;
        const recipe = this.signals.equipmentRecipes().find(r => r.id === recipeId);
        if (!recipe || !recipe.unlocked) return false;
        if (!this.callbacks.canAffordResources(recipe.cost)) return false;
        if (!this.callbacks.spendCraftingResources(recipe.cost)) return false;
        this.signals.craftedEquipment.update(items => [...items, { ...recipe.resultItem }]);
        return true;
    }

    equipItem(itemId: string): boolean {
        if (!this.signals) return false;
        const items = this.signals.craftedEquipment();
        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return false;

        const item = items[itemIndex];
        const currentEquipped = this.signals.equippedItems()[item.slot];
        this.signals.craftedEquipment.update(inv => inv.filter((_, idx) => idx !== itemIndex));
        if (currentEquipped) this.signals.craftedEquipment.update(inv => [...inv, currentEquipped]);
        this.signals.equippedItems.update(eq => ({ ...eq, [item.slot]: item }));
        return true;
    }

    unequipItem(slot: EquipmentSlot): boolean {
        if (!this.signals) return false;
        const equipped = this.signals.equippedItems()[slot];
        if (!equipped) return false;
        this.signals.craftedEquipment.update(inv => [...inv, equipped]);
        this.signals.equippedItems.update(eq => ({ ...eq, [slot]: null }));
        return true;
    }

    // O(1) lookup using precomputed cache
    getEquipmentBonus(bonusType: string, stat?: keyof PlayerStats): number {
        if (!this.bonusCache) return 0;

        const cache = this.bonusCache();

        if (bonusType === 'stat' && stat) {
            return cache.stats[stat] || 0;
        } else if (bonusType !== 'stat') {
            return cache.other[bonusType] || 0;
        }

        return 0;
    }
}
