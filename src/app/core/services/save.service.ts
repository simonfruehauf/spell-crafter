import { Injectable, signal } from '@angular/core';
import {
    GameState, Player, Resources, WindowStates, Rune, Spell,
    ResearchNode, CombatState, IdleSettings, Upgrade,
    EquipmentItem, EquipmentRecipe, EquippedItems, AlchemyState, AlchemyRecipe,
    PotionInventory
} from '../models/game.interfaces';
import { RUNES, MAGIC_MISSILE, INITIAL_RESEARCH_TREE, INITIAL_UPGRADES, INITIAL_ALCHEMY_RECIPES } from '../models/game.data';
import { INITIAL_CRAFTING_RESOURCES } from '../models/resources.data';
import { INITIAL_EQUIPMENT_RECIPES } from '../models/equipment.data';
import { INITIAL_POTION_INVENTORY } from '../models/potions.data';

const SAVE_KEY = 'spellcrafter-save';
const SAVE_VERSION = 3;

export interface GameSignals {
    player: ReturnType<typeof signal<Player>>;
    resources: ReturnType<typeof signal<Resources>>;
    windows: ReturnType<typeof signal<WindowStates>>;
    knownRunes: ReturnType<typeof signal<Rune[]>>;
    craftedSpells: ReturnType<typeof signal<Spell[]>>;
    researchTree: ReturnType<typeof signal<ResearchNode[]>>;
    upgrades: ReturnType<typeof signal<Upgrade[]>>;
    combat: ReturnType<typeof signal<CombatState>>;
    idle: ReturnType<typeof signal<IdleSettings>>;
    equippedItems: ReturnType<typeof signal<EquippedItems>>;
    craftedEquipment: ReturnType<typeof signal<EquipmentItem[]>>;
    equipmentRecipes: ReturnType<typeof signal<EquipmentRecipe[]>>;
    alchemyRecipes: ReturnType<typeof signal<AlchemyRecipe[]>>;
    alchemy: ReturnType<typeof signal<AlchemyState>>;
    potions: ReturnType<typeof signal<PotionInventory>>;
}

@Injectable({ providedIn: 'root' })
export class SaveService {
    private signals: GameSignals | null = null;

    registerSignals(signals: GameSignals): void {
        this.signals = signals;
    }

    saveGame(): void {
        if (!this.signals) return;

        const state = {
            version: SAVE_VERSION,
            timestamp: Date.now(),
            player: this.signals.player(),
            resources: this.signals.resources(),
            windows: this.signals.windows(),
            knownRunes: this.signals.knownRunes().map(r => r.id),
            craftedSpells: this.signals.craftedSpells(),
            researchTree: this.signals.researchTree(),
            upgrades: this.signals.upgrades(),
            combat: {
                ...this.signals.combat(),
                combatLog: [],
                currentEnemy: null,
                inCombat: false
            },
            idle: this.signals.idle(),
            equippedItems: this.signals.equippedItems(),
            craftedEquipment: this.signals.craftedEquipment(),
            equipmentRecipes: this.signals.equipmentRecipes(),
            alchemyRecipes: this.signals.alchemyRecipes(),
            alchemy: this.signals.alchemy(),
            potions: this.signals.potions(),
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }

    loadGame(): boolean {
        if (!this.signals) return false;

        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;

        try {
            const state = JSON.parse(saved);
            if (state.version !== SAVE_VERSION) {
                console.warn('Save version mismatch');
                return false;
            }

            this.signals.player.set(state.player);
            this.signals.resources.set(state.resources);
            // Merge saved windows with current defaults to handle newly added windows
            const currentWindows = this.signals.windows();
            this.signals.windows.set({ ...currentWindows, ...state.windows });
            this.signals.knownRunes.set(
                state.knownRunes.map((id: string) => RUNES[id]).filter(Boolean)
            );
            this.signals.craftedSpells.set(state.craftedSpells);
            this.signals.researchTree.set(state.researchTree);
            this.signals.upgrades.set(
                state.upgrades || JSON.parse(JSON.stringify(INITIAL_UPGRADES))
            );
            // Merge saved idle settings with current defaults to handle newly added flags
            const currentIdle = this.signals.idle();
            this.signals.idle.set({ ...currentIdle, ...state.idle });
            if (state.combat) {
                // Restore combat state but ensure ephemeral flags are reset (just in case)
                this.signals.combat.set({
                    ...state.combat,
                    inCombat: false,
                    currentEnemy: null,
                    combatLog: [],
                    playerTurn: true
                });
            }
            // Load equipment state
            if (state.equippedItems) {
                this.signals.equippedItems.set(state.equippedItems);
            }
            if (state.craftedEquipment) {
                this.signals.craftedEquipment.set(state.craftedEquipment);
            }
            if (state.equipmentRecipes) {
                this.signals.equipmentRecipes.set(state.equipmentRecipes);
            }
            // Load alchemy state
            if (state.alchemyRecipes) {
                this.signals.alchemyRecipes.set(state.alchemyRecipes);
            }
            if (state.alchemy) {
                // Reset active crafting on load (don't persist mid-craft state)
                this.signals.alchemy.set({
                    activeRecipeId: null,
                    craftStartTime: 0,
                    craftEndTime: 0,
                });
            }
            // Load potion inventory
            if (state.potions) {
                this.signals.potions.set(state.potions);
            } else {
                this.signals.potions.set({ ...INITIAL_POTION_INVENTORY });
            }
            return true;
        } catch {
            return false;
        }
    }

    exportSave(): string {
        this.saveGame();
        const saved = localStorage.getItem(SAVE_KEY);
        return saved ? btoa(saved) : '';
    }

    importSave(data: string): boolean {
        try {
            const decoded = atob(data);
            const state = JSON.parse(decoded);
            if (state.version !== SAVE_VERSION) return false;
            localStorage.setItem(SAVE_KEY, decoded);
            return this.loadGame();
        } catch {
            return false;
        }
    }

    resetGame(): void {
        localStorage.removeItem(SAVE_KEY);
    }
}
