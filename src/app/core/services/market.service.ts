import { Injectable, signal } from '@angular/core';
import { ThemeState, Player, Resources } from '../models/game.interfaces';
import { SELL_PRICES, BUY_MULTIPLIERS, THEMES } from '../models/market.data';
import { RESOURCE_DEFS } from '../models/resources.data';

export interface MarketSignals {
    player: ReturnType<typeof signal<Player>>;
    resources: ReturnType<typeof signal<Resources>>;
    themes: ReturnType<typeof signal<ThemeState>>;
}

export interface MarketCallbacks {
    addGold: (amount: number) => void;
    addCraftingResource: (id: string, amount: number) => void;
}

@Injectable({ providedIn: 'root' })
export class MarketService {
    private signals: MarketSignals | null = null;
    private callbacks: MarketCallbacks | null = null;

    registerSignals(signals: MarketSignals): void { this.signals = signals; }
    registerCallbacks(callbacks: MarketCallbacks): void { this.callbacks = callbacks; }

    getChaBonus(): number {
        if (!this.signals) return 0;
        return Math.pow(this.signals.player().CHA, 1.2) * 0.05;
    }

    getBuyDiscount(): number {
        if (!this.signals) return 1;
        return (1 + Math.exp(-this.signals.player().CHA * 0.05)) / 2;
    }

    sellResource(resourceId: string, amount: number): boolean {
        if (!this.signals || !this.callbacks) return false;
        amount = Math.floor(amount);
        if (amount <= 0) return false;
        const current = this.signals.resources().crafting[resourceId] || 0;
        if (current < amount) return false;
        const def = RESOURCE_DEFS[resourceId];
        if (!def) return false;

        const basePrice = SELL_PRICES[def.rarity] || 1;
        const totalGold = Math.floor(basePrice * (1 + this.getChaBonus()) * amount);
        if (totalGold <= 0) return false;

        this.callbacks.addCraftingResource(resourceId, -amount);
        this.callbacks.addGold(totalGold);
        return true;
    }

    buyResource(resourceId: string, amount: number): boolean {
        if (!this.signals || !this.callbacks) return false;
        const def = RESOURCE_DEFS[resourceId];
        if (!def) return false;

        const multiplier = BUY_MULTIPLIERS[def.rarity] || 50;
        const basePrice = SELL_PRICES[def.rarity] || 1;
        const finalPrice = Math.max(1, Math.floor(basePrice * multiplier * this.getBuyDiscount()));
        const totalCost = finalPrice * amount;

        if (this.signals.resources().gold < totalCost) return false;
        this.callbacks.addGold(-totalCost);
        this.callbacks.addCraftingResource(resourceId, amount);
        return true;
    }

    buyTheme(themeId: string): boolean {
        if (!this.signals || !this.callbacks) return false;
        const theme = THEMES.find(t => t.id === themeId);
        if (!theme || this.signals.themes().unlocked.includes(themeId)) return false;
        if (this.signals.resources().gold < theme.cost) return false;

        this.callbacks.addGold(-theme.cost);
        this.signals.themes.update(t => ({ ...t, unlocked: [...t.unlocked, themeId] }));
        return true;
    }

    equipTheme(themeId: string): void {
        if (!this.signals) return;
        const theme = THEMES.find(t => t.id === themeId);
        if (theme && this.signals.themes().unlocked.includes(themeId)) {
            this.signals.themes.update(t => ({ ...t, active: themeId }));
        }
    }
}
