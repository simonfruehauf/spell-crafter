import { Injectable, signal } from '@angular/core';
import {
    Player, Resources, WindowStates, Rune, Spell,
    ResearchNode, CombatState, IdleSettings, Upgrade,
    EquipmentItem, EquipmentRecipe, EquippedItems, AlchemyState, AlchemyRecipe,
    PotionInventory, GardenState, BrewingState
} from '../models/game.interfaces';
import { RUNES, INITIAL_UPGRADES } from '../models/game.data';
import { INITIAL_POTION_INVENTORY } from '../models/potions.data';

const SAVE_KEY = 'spellcrafter-save';
const SAVE_VERSION = 4;

// =============================================================================
// MIGRATION SYSTEM - Upgrade old saves to current version
// =============================================================================

type SaveMigration = (state: Record<string, unknown>) => Record<string, unknown>;

/**
 * Migration functions to upgrade saves from one version to the next.
 * Each migration transforms state from version N to version N+1.
 * The loadGame() merge-with-defaults pattern handles new optional fields,
 * so migrations are only needed for breaking changes (restructured/renamed fields).
 */
const MIGRATIONS: Record<number, SaveMigration> = {
    // v3 -> v4: Add garden/brewing support (no breaking changes, just version bump)
    3: (state) => ({ ...state, version: 4 }),
    // Future migrations:
    // 4: (state) => ({ ...state, someNewField: convertOld(state.oldField), version: 5 }),
};

/**
 * Migrate a save state from any older version to the current version.
 */
function migrateState(state: Record<string, unknown>): Record<string, unknown> {
    let current = state;
    let version = (current['version'] as number) || 1;

    while (version < SAVE_VERSION) {
        const migration = MIGRATIONS[version];
        if (!migration) {
            // No migration found, skip to current version (merge-with-defaults will fill gaps)
            console.warn(`No migration for version ${version}, using defaults for missing fields`);
            current = { ...current, version: SAVE_VERSION };
            break;
        }
        console.log(`Migrating save from v${version} to v${version + 1}`);
        current = migration(current);
        version = current['version'] as number;
    }

    return current;
}

// =============================================================================
// GAME SIGNALS INTERFACE
// =============================================================================

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
    garden: ReturnType<typeof signal<GardenState>>;
    brewing: ReturnType<typeof signal<BrewingState>>;
    discoveredResources: ReturnType<typeof signal<string[]>>;
}

// =============================================================================
// SAVE SERVICE
// =============================================================================

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
            garden: this.signals.garden(),
            brewing: this.signals.brewing(),
            discoveredResources: this.signals.discoveredResources(),
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }

    loadGame(): boolean {
        if (!this.signals) return false;

        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) return false;

        try {
            let state = JSON.parse(saved);

            // Migrate older saves to current version
            if (state.version !== SAVE_VERSION) {
                if (state.version > SAVE_VERSION) {
                    console.warn('Save from newer version, cannot downgrade');
                    return false;
                }
                state = migrateState(state);
                // Persist migrated state
                localStorage.setItem(SAVE_KEY, JSON.stringify(state));
            }

            // === PLAYER ===
            this.signals.player.set(state.player);

            // === RESOURCES ===
            this.signals.resources.set(state.resources);

            // === WINDOWS: Merge with defaults (handles new windows) ===
            const currentWindows = this.signals.windows();
            this.signals.windows.set({ ...currentWindows, ...state.windows });

            // === RUNES ===
            this.signals.knownRunes.set(
                state.knownRunes.map((id: string) => RUNES[id]).filter(Boolean)
            );

            // === SPELLS ===
            this.signals.craftedSpells.set(state.craftedSpells);

            // === RESEARCH ===
            this.signals.researchTree.set(state.researchTree);

            // === UPGRADES: Merge with defaults (handles new upgrades) ===
            this.signals.upgrades.set(
                state.upgrades || JSON.parse(JSON.stringify(INITIAL_UPGRADES))
            );

            // === IDLE: Merge with defaults (handles new idle flags) ===
            const currentIdle = this.signals.idle();
            this.signals.idle.set({ ...currentIdle, ...state.idle });

            // === COMBAT: Reset ephemeral state ===
            if (state.combat) {
                this.signals.combat.set({
                    ...state.combat,
                    inCombat: false,
                    currentEnemy: null,
                    combatLog: [],
                    playerTurn: true
                });
            }

            // === EQUIPMENT ===
            if (state.equippedItems) {
                this.signals.equippedItems.set(state.equippedItems);
            }
            if (state.craftedEquipment) {
                this.signals.craftedEquipment.set(state.craftedEquipment);
            }
            if (state.equipmentRecipes) {
                this.signals.equipmentRecipes.set(state.equipmentRecipes);
            }

            // === ALCHEMY: Reset active crafting (transient state) ===
            if (state.alchemyRecipes) {
                this.signals.alchemyRecipes.set(state.alchemyRecipes);
            }
            this.signals.alchemy.set({
                activeRecipeId: null,
                craftStartTime: 0,
                craftEndTime: 0,
            });

            // === POTIONS: Merge with defaults (handles new potions) ===
            const defaultPotions = { ...INITIAL_POTION_INVENTORY };
            this.signals.potions.set({ ...defaultPotions, ...(state.potions || {}) });

            // === GARDEN: Merge with current defaults (handles new plots) ===
            if (state.garden) {
                const currentGarden = this.signals.garden();
                this.signals.garden.set({ ...currentGarden, ...state.garden });
            }
            // If no garden in save, leave current default

            // === BREWING: Reset active brewing (transient state) ===
            this.signals.brewing.set({
                activePotionId: null,
                brewStartTime: 0,
                brewEndTime: 0,
            });

            // === DISCOVERY ===
            this.signals.discoveredResources.set(state.discoveredResources || []);


            return true;
        } catch (e) {
            console.error('Failed to load save:', e);
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
            let state = JSON.parse(decoded);

            // Reject saves from newer versions (can't downgrade)
            if (state.version > SAVE_VERSION) {
                console.warn('Cannot import save from newer version');
                return false;
            }

            // Migrate older saves forward
            if (state.version < SAVE_VERSION) {
                state = migrateState(state);
            }

            localStorage.setItem(SAVE_KEY, JSON.stringify(state));
            return this.loadGame();
        } catch (e) {
            console.error('Failed to import save:', e);
            return false;
        }
    }

    resetGame(): void {
        localStorage.removeItem(SAVE_KEY);
    }
}
