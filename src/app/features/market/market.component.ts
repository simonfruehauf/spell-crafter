import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowComponent } from '../../shared/components/window/window.component';
import { GameStateService } from '../../core/services/game-state.service';
import { RESOURCE_DEFS, RESOURCE_NAMES } from '../../core/models/resources.data';
import { SELL_PRICES, BUY_MULTIPLIERS, THEMES } from '../../core/models/market.data';


@Component({
    selector: 'app-market',
    standalone: true,
    imports: [CommonModule, WindowComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <app-window 
      title="Marketplace" 
      windowId="market"
      [initialX]="200" 
      [initialY]="150" 
      [width]="400"
      (closed)="onClose()">
      
      <div class="market-content">
        <!-- Header / Stats -->
        <div class="market-header">
            <div class="stat-row">
                <span class="label">Sell Bonus (CHA):</span>
                <span class="value success">+{{ (chaBonus() * 100).toFixed(1) }}%</span>
            </div>
            <div class="stat-row">
                <span class="label">Buy Discount (CHA):</span>
                <span class="value highlight">-{{ ((1 - buyDiscount()) * 100).toFixed(1) }}%</span>
            </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
            @for (tab of tabs; track tab.id) {
                <button 
                    class="tab-btn" 
                    [class.active]="activeTab() === tab.id"
                    (click)="activeTab.set(tab.id)">
                    {{ tab.label }}
                </button>
            }
        </div>

        <!-- SELL TAB -->
        @if (activeTab() === 'sell') {
            <div class="tab-pane">
                <div class="section-header">Sell Resources</div>
                <div class="resource-list">
                    @for (item of sellableItems(); track item.id) {
                        <div class="market-item">
                            <div class="item-info">
                                <span class="item-name" [class]="item.rarity">{{ item.name }}</span>
                                <span class="item-stock">Owned: {{ item.owned }}</span>
                            </div>
                            <div class="item-actions">
                                <span class="price">Value: {{ item.sellPrice }}g</span>
                                <div class="sell-controls">
                                    <!-- Helper buttons for quick amounts -->
                                    <button class="btn btn-small" (click)="sell(item.id, 1)" [disabled]="item.owned < 1">1</button>
                                    <button class="btn btn-small" (click)="sell(item.id, 10)" [disabled]="item.owned < 10">10</button>
                                    <button class="btn btn-small" (click)="sell(item.id, item.owned)" [disabled]="item.owned < 1">All</button>
                                </div>
                            </div>
                        </div>
                    }
                    @if (sellableItems().length === 0) {
                        <div class="empty-msg">
                            No sellable items found.
                        </div>
                    }
                </div>
            </div>
        }

        <!-- BUY TAB -->
        @if (activeTab() === 'buy') {
            <div class="tab-pane">
                 <div class="section-header">Buy Common Goods</div>
                 <div class="resource-list">
                    @for (item of buyableItems(); track item.id) {
                        <div class="market-item">
                            <div class="item-info">
                                <span class="item-name" [class]="item.rarity">{{ item.name }}</span>
                                <span class="item-stock">Owned: {{ item.owned }}</span>
                            </div>
                            <div class="item-actions">
                                <span class="price cost">Cost: {{ item.buyPrice }}g</span>
                                <button class="btn btn-buy" (click)="buy(item.id)" [disabled]="gold() < item.buyPrice">
                                    Buy 1
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        }

        <!-- THEMES TAB -->
        @if (activeTab() === 'themes') {
            <div class="tab-pane">
                <div class="section-header">Visual Themes</div>
                <div class="theme-list">
                    @for (theme of themesList; track theme.id) {
                        <div class="theme-item" [class.active-theme]="activeTheme() === theme.id">
                            <div class="theme-info">
                                <span class="theme-name">{{ theme.name }}</span>
                                <span class="theme-desc">{{ theme.description }}</span>
                            </div>
                            <div class="theme-actions">
                                @if (isThemeUnlocked(theme.id)) {
                                    <button 
                                        class="btn btn-equip" 
                                        [class.equipped]="activeTheme() === theme.id"
                                        (click)="equipTheme(theme.id)"
                                        [disabled]="activeTheme() === theme.id">
                                        {{ activeTheme() === theme.id ? 'Active' : 'Equip' }}
                                    </button>
                                } @else {
                                    <button class="btn btn-buy" (click)="buyTheme(theme.id)" [disabled]="gold() < theme.cost">
                                        Buy ({{ theme.cost }}g)
                                    </button>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        }

        <!-- SERVICES TAB -->
        @if (activeTab() === 'services') {
            <div class="tab-pane services-tab">
                <div class="service-box">
                    <div class="service-title">Stat Respec</div>
                    <p>Reset all your attribute points. Cost increases with level.</p>
                    <div class="cost-display">Cost: <span class="gold">{{ respecCost() }} gold</span></div>
                    <button class="btn btn-danger" (click)="respec()" [disabled]="gold() < respecCost()">
                        Respec Stats
                    </button>
                </div>
            </div>
        }

      </div>
    </app-window>
  `,
    styles: [`
    .market-content {
        padding: 8px;
        display: flex;
        flex-direction: column;
        max-height: 480px;
        overflow-y: auto;
    }
    .market-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding: 4px 8px;
        border: 1px solid var(--win95-dark-gray);
        background: var(--win95-light-gray);
    }
    .stat-row { font-size: 11px; display: flex; gap: 4px; }
    .label { font-weight: bold; color: var(--win95-black); }
    .success { color: #008000; font-weight: bold; }
    .highlight { color: #800000; font-weight: bold; }

    .tabs {
        display: flex;
        gap: 2px;
        margin-bottom: 8px;
        border-bottom: 1px solid var(--win95-dark-gray);
        padding-bottom: 2px;
    }
    .tab-btn {
        background: var(--win95-gray);
        border: 1px solid var(--win95-white);
        border-right-color: var(--win95-dark-gray);
        border-bottom-color: var(--win95-dark-gray);
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        font-family: 'Tahoma', sans-serif;
    }
    .tab-btn:active, .tab-btn.active {
        background: var(--win95-white);
        border-color: var(--win95-dark-gray);
        border-right-color: var(--win95-white);
        border-bottom-color: var(--win95-white);
        font-weight: bold;
    }

    .section-header {
        background-color: var(--win95-blue);
        color: var(--win95-white);
        padding: 2px 6px;
        font-weight: bold;
        font-size: 11px;
        margin-bottom: 4px;
    }

    .tab-pane {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    
    .resource-list, .theme-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: var(--win95-white);
        border: 2px solid;
        border-color: var(--win95-dark-gray) var(--win95-white) var(--win95-white) var(--win95-dark-gray);
        padding: 4px;
    }

    .market-item, .theme-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--win95-light-gray);
        padding: 4px 8px;
        border: 1px solid var(--win95-light-gray);
    }
    .market-item:hover, .theme-item:hover { background: var(--win95-gray); } 

    .active-theme {
        background: var(--win95-white);
        border-color: #008000;
        position: relative;
    }

    .item-info, .theme-info {
        display: flex;
        flex-direction: column;
    }
    .item-name, .theme-name { font-weight: bold; font-size: 11px; color: var(--win95-black); }
    .theme-desc { font-size: 10px; color: var(--win95-dark-gray); font-style: italic; }
    .item-stock { font-size: 10px; color: var(--win95-black); }

    .item-actions, .theme-actions {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
    }
    
    .price { font-size: 11px; color: var(--win95-black); font-weight: bold; }
    .price.cost { color: #800000; }
    
    .sell-controls {
        display: flex;
        gap: 2px;
    }

    .btn {
        background: var(--win95-gray);
        border: 1px solid var(--win95-white);
        border-right-color: var(--win95-dark-gray);
        border-bottom-color: var(--win95-dark-gray);
        color: var(--win95-black);
        cursor: pointer;
        font-family: 'Tahoma', sans-serif;
        font-size: 11px;
        padding: 2px 6px;
    }
    .btn:hover:not(:disabled) { background: var(--win95-light-gray); }
    .btn:active:not(:disabled) {
        border-color: var(--win95-dark-gray);
        border-right-color: var(--win95-white);
        border-bottom-color: var(--win95-white);
        transform: translate(1px, 1px);
    }
    .btn:disabled { color: var(--win95-dark-gray); cursor: default; }

    .btn-small { padding: 1px 4px; font-size: 10px; min-width: 24px; }
    .btn-buy, .btn-equip { padding: 3px 8px; width: 80px; }
    
    .common { color: var(--win95-black); }
    .uncommon { color: #006600; }
    .rare { color: #0000cc; }
    .epic { color: #800080; }
    .legendary { color: #ff6600; }

    .services-tab {
        padding: 10px;
        justify-content: center;
        align-items: center;
    }
    .service-box {
        background: var(--win95-light-gray);
        padding: 15px;
        border: 1px solid var(--win95-dark-gray);
        text-align: center;
        max-width: 280px;
        box-shadow: 2px 2px 0 rgba(0,0,0,0.1);
    }
    .service-title { font-weight: bold; margin-bottom: 8px; font-size: 12px; }
    .gold { color: #808000; font-weight: bold; }
    
    .btn-danger { color: #800000; font-weight: bold; margin-top: 10px; width: 100%; padding: 6px; }
    
    .empty-msg {
        text-align: center;
        color: var(--win95-dark-gray);
        padding: 10px;
        font-style: italic;
    }
  `]
})
export class MarketComponent {
    private gameState = inject(GameStateService);

    // Signals
    resources = this.gameState.resources;
    player = this.gameState.player;
    chaBonus = this.gameState.chaBonus;
    buyDiscount = this.gameState.buyDiscount;
    themes = this.gameState.themes;
    discoveredResources = this.gameState.discoveredResources;
    gold = computed(() => this.resources().gold);

    // State
    activeTab = signal<'sell' | 'buy' | 'themes' | 'services'>('sell');
    tabs: { id: 'sell' | 'buy' | 'themes' | 'services', label: string }[] = [
        { id: 'sell', label: 'Sell' },
        { id: 'buy', label: 'Buy' },
        { id: 'themes', label: 'Themes' },
        { id: 'services', label: 'Services' }
    ];

    // Static Data
    themesList = THEMES;

    // Computed Lists
    sellableItems = computed(() => {
        const crafting = this.resources().crafting;
        const sellable: { id: string, name: string, rarity: string, owned: number, sellPrice: number }[] = [];

        // We only sell things that have a defined price (common-legendary)
        // And currently only focusing on 'herb' and 'creature' categories as per plan?
        // Actually, let's allow anything that has a sell price if the user has it.
        // But for UI cleanliness, maybe sticky to categories or just 'all owned'.

        // Let's iterate all owned items that are in RESOURCE_DEFS
        Object.entries(crafting).forEach(([id, amount]) => {
            if (amount <= 0) return;
            const def = RESOURCE_DEFS[id];
            if (!def) return;

            // Filter categories if desired? Plan said 'herb' and 'creature'.
            if (def.category !== 'herb' && def.category !== 'creature') return;

            const base = SELL_PRICES[def.rarity] || 0;
            if (base <= 0) return;

            const finalPrice = Math.floor(base * (1 + this.chaBonus()));

            sellable.push({
                id,
                name: RESOURCE_NAMES[id] || def.name,
                rarity: def.rarity,
                owned: amount,
                sellPrice: finalPrice
            });
        });

        // Sort by rarity then name
        return sellable.sort((a, b) => {
            const rA = this.getRarityValue(a.rarity);
            const rB = this.getRarityValue(b.rarity);
            if (rA !== rB) return rA - rB;
            return a.name.localeCompare(b.name);
        });
    });

    buyableItems = computed(() => {
        // Only common items
        const buyable: { id: string, name: string, rarity: string, buyPrice: number, owned: number }[] = [];
        const discount = this.buyDiscount();
        const discovered = this.discoveredResources();

        Object.values(RESOURCE_DEFS).forEach(def => {
            if (def.rarity !== 'common') return;

            // Restrict to items already gained at least once
            if (!discovered.includes(def.id)) return;

            // Maybe restrict categories too? (e.g. don't sell specialized quest items if any)
            // 'herb', 'creature', 'essence', 'reagent' are safe.
            const safeCats = ['herb', 'creature', 'essence', 'reagent', 'metal', 'gem'];
            if (!safeCats.includes(def.category)) return;

            const base = SELL_PRICES['common'] || 2;
            const multiplier = BUY_MULTIPLIERS['common'] || 10;
            const baseBuy = base * multiplier;

            // Apply discount
            const finalCost = Math.max(1, Math.floor(baseBuy * discount));

            buyable.push({
                id: def.id,
                name: def.name,
                rarity: def.rarity,
                buyPrice: finalCost,
                owned: this.resources().crafting[def.id] || 0
            });
        });

        return buyable.sort((a, b) => a.name.localeCompare(b.name));
    });

    respecCost = computed(() => {
        return 100 + (this.player().level * 50);
    });

    activeTheme = computed(() => this.themes().active);

    // Actions
    onClose() {
        this.gameState.closeWindow('market');
    }

    sell(id: string, amount: number) {
        this.gameState.sellResource(id, amount);
    }

    buy(id: string) {
        this.gameState.buyResource(id, 1);
    }

    buyTheme(id: string) {
        this.gameState.buyTheme(id);
    }

    equipTheme(id: string) {
        this.gameState.equipTheme(id);
    }

    isThemeUnlocked(id: string): boolean {
        return this.themes().unlocked.includes(id);
    }

    respec() {
        if (confirm(`Respec stats for ${this.respecCost()} gold? This will reset all attributes.`)) {
            this.gameState.respecStats();
        }
    }

    private getRarityValue(rarity: string): number {
        switch (rarity) {
            case 'common': {
                return 1;
            }
            case 'uncommon': {
                return 2;
            }
            case 'rare': {
                return 3;
            }
            case 'epic': {
                return 4;
            }
            case 'legendary': {
                return 5;
            }
            default: {
                return 0;
            }
        }
    }

    trackByItemId(index: number, item: { id: string }): string {
        return item.id;
    }
}
