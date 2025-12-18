import { Injectable, signal } from '@angular/core';
import { GardenState, ResourceCost } from '../models/game.interfaces';
import { RESOURCE_DEFS } from '../models/resources.data';

export interface GardenSignals {
    garden: ReturnType<typeof signal<GardenState>>;
}

export interface GardenCallbacks {
    getResourceAmount: (id: string) => number;
    spendCraftingResources: (costs: ResourceCost[]) => boolean;
    addCraftingResource: (id: string, amount: number) => void;
    getUpgradeBonus: (type: string) => number;
}

@Injectable({ providedIn: 'root' })
export class GardenService {
    private signals: GardenSignals | null = null;
    private callbacks: GardenCallbacks | null = null;

    registerSignals(signals: GardenSignals): void { this.signals = signals; }
    registerCallbacks(callbacks: GardenCallbacks): void { this.callbacks = callbacks; }

    createInitialGardenState(): GardenState {
        return {
            plots: [
                { id: 0, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: true },
                { id: 1, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: false },
                { id: 2, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: false },
                { id: 3, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: false },
                { id: 4, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: false },
                { id: 5, plantedHerbId: null, plantedAt: 0, growthDurationMs: 30_000, unlocked: false },
            ],
            maxPlots: 6,
        };
    }

    getUnlockedPlotCount(): number {
        return this.callbacks ? 1 + this.callbacks.getUpgradeBonus('gardenPlot') : 1;
    }

    plantHerb(plotId: number, herbId = 'mint_plant'): boolean {
        if (!this.signals || !this.callbacks) return false;
        const garden = this.signals.garden();
        const plot = garden.plots.find(p => p.id === plotId);
        if (!plot || plotId >= this.getUnlockedPlotCount() || plot.plantedHerbId !== null) return false;

        if (herbId !== 'mint_plant') {
            if (this.callbacks.getResourceAmount(herbId) < 1) return false;
            this.callbacks.spendCraftingResources([{ resourceId: herbId, amount: 1 }]);
        }

        const herbDef = RESOURCE_DEFS[herbId];
        let growthDurationMs = 10_000;
        if (herbDef) {
            switch (herbDef.rarity) {
                case 'common': { growthDurationMs = 10_000; break;
                }
                case 'uncommon': { growthDurationMs = 15_000; break;
                }
                case 'rare': { growthDurationMs = 25_000; break;
                }
                case 'epic': case 'legendary': { growthDurationMs = 30_000; break;
 }
            }
        }

        this.signals.garden.update(g => ({
            ...g,
            plots: g.plots.map(p => p.id === plotId ? { ...p, plantedHerbId: herbId, plantedAt: Date.now(), growthDurationMs } : p)
        }));
        return true;
    }

    harvestPlot(plotId: number): boolean {
        if (!this.signals || !this.callbacks) return false;
        const garden = this.signals.garden();
        const plot = garden.plots.find(p => p.id === plotId);
        if (!plot || plot.plantedHerbId === null) return false;
        if (Date.now() < plot.plantedAt + plot.growthDurationMs) return false;

        this.callbacks.addCraftingResource(plot.plantedHerbId, 2);
        this.signals.garden.update(g => ({
            ...g,
            plots: g.plots.map(p => p.id === plotId ? { ...p, plantedHerbId: null, plantedAt: 0 } : p)
        }));
        return true;
    }

    isPlotReady(plotId: number): boolean {
        if (!this.signals) return false;
        const plot = this.signals.garden().plots.find(p => p.id === plotId);
        if (!plot || plot.plantedHerbId === null) return false;
        return Date.now() >= plot.plantedAt + plot.growthDurationMs;
    }

    getPlotProgress(plotId: number): number {
        if (!this.signals) return 0;
        const plot = this.signals.garden().plots.find(p => p.id === plotId);
        if (!plot || plot.plantedHerbId === null) return 0;
        return Math.min(100, ((Date.now() - plot.plantedAt) / plot.growthDurationMs) * 100);
    }
}
