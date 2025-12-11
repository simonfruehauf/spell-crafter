import { Injectable, signal } from '@angular/core';
import { Resources, ResourceCost } from '../models/game.interfaces';
import { INITIAL_CRAFTING_RESOURCES } from '../models/resources.data';

@Injectable({ providedIn: 'root' })
export class ResourceService {
    private resourcesSignal: ReturnType<typeof signal<Resources>> | null = null;

    registerSignal(resources: ReturnType<typeof signal<Resources>>): void {
        this.resourcesSignal = resources;
    }

    createInitialResources(): Resources {
        return {
            mana: 0,
            maxMana: 25,
            gold: 0,
            crafting: { ...INITIAL_CRAFTING_RESOURCES }
        };
    }

    // Mana operations
    addMana(amount: number): void {
        if (!this.resourcesSignal) return;
        this.resourcesSignal.update(r => ({
            ...r,
            mana: Math.min(r.maxMana, r.mana + amount)
        }));
    }

    spendMana(amount: number): boolean {
        if (!this.resourcesSignal) return false;
        if (this.resourcesSignal().mana >= amount) {
            this.resourcesSignal.update(r => ({ ...r, mana: r.mana - amount }));
            return true;
        }
        return false;
    }

    getMana(): number {
        return this.resourcesSignal?.().mana ?? 0;
    }

    getMaxMana(): number {
        return this.resourcesSignal?.().maxMana ?? 0;
    }

    increaseMaxMana(amount: number): void {
        if (!this.resourcesSignal) return;
        this.resourcesSignal.update(r => ({
            ...r,
            maxMana: r.maxMana + amount
        }));
    }

    // Gold operations
    addGold(amount: number): void {
        if (!this.resourcesSignal) return;
        this.resourcesSignal.update(r => ({ ...r, gold: r.gold + amount }));
    }

    // Crafting resources
    addCraftingResource(id: string, amount: number): void {
        if (!this.resourcesSignal) return;
        this.resourcesSignal.update(r => ({
            ...r,
            crafting: {
                ...r.crafting,
                [id]: (r.crafting[id] || 0) + amount
            }
        }));
    }

    spendCraftingResources(costs: ResourceCost[]): boolean {
        if (!this.resourcesSignal) return false;
        const c = this.resourcesSignal().crafting;

        // Check affordability
        for (const cost of costs) {
            if ((c[cost.resourceId] || 0) < cost.amount) return false;
        }

        // Spend resources
        this.resourcesSignal.update(r => {
            const newCrafting = { ...r.crafting };
            for (const cost of costs) {
                newCrafting[cost.resourceId] -= cost.amount;
            }
            return { ...r, crafting: newCrafting };
        });
        return true;
    }

    canAffordResources(costs: ResourceCost[]): boolean {
        if (!this.resourcesSignal) return false;
        const c = this.resourcesSignal().crafting;
        return costs.every(cost => (c[cost.resourceId] || 0) >= cost.amount);
    }

    getCraftingResources(): Record<string, number> {
        return this.resourcesSignal?.().crafting ?? {};
    }
}
