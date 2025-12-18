import { Injectable, signal } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class EquipmentService {
    private signals: EquipmentSignals | null = null;
    private callbacks: EquipmentCallbacks | null = null;

    registerSignals(signals: EquipmentSignals): void { this.signals = signals; }
    registerCallbacks(callbacks: EquipmentCallbacks): void { this.callbacks = callbacks; }

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

    getEquipmentBonus(bonusType: string, stat?: keyof PlayerStats): number {
        if (!this.signals) return 0;
        const equipped = this.signals.equippedItems();
        let total = 0;
        for (const slot of Object.keys(equipped) as EquipmentSlot[]) {
            const item = equipped[slot];
            if (!item) continue;
            for (const bonus of item.bonuses) {
                if (bonus.type === bonusType) {
                    if (bonusType === 'stat' && stat && bonus.stat === stat) total += bonus.value;
                    else if (bonusType !== 'stat') total += bonus.value;
                }
            }
        }
        return total;
    }
}
