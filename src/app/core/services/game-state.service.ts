import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
    GameState, Player, Resources, WindowStates, WindowState, Rune, Spell,
    ResearchNode, CombatState, CombatLogEntry, Enemy, IdleSettings,
    ActiveEffect, LootDrop, ResourceCost, Upgrade, DamageType,
    EquipmentItem, EquipmentRecipe, EquippedItems, EquipmentSlot, PlayerStats,
    AlchemyRecipe, AlchemyState
} from '../models/game.interfaces';
import { INITIAL_RESEARCH_TREE, RUNES, MAGIC_MISSILE, ENEMIES, INITIAL_UPGRADES, INITIAL_ALCHEMY_RECIPES } from '../models/game.data';
import { INITIAL_CRAFTING_RESOURCES, RESOURCE_NAMES } from '../models/resources.data';
import { INITIAL_EQUIPMENT_RECIPES, INITIAL_EQUIPPED_ITEMS, EQUIPMENT_ITEMS } from '../models/equipment.data';

// Import extracted services
import { SaveService } from './save.service';
import { ResourceService } from './resource.service';
import { ResearchService } from './research.service';
import { CombatService } from './combat.service';

@Injectable({ providedIn: 'root' })
export class GameStateService implements OnDestroy {
    // Injected services
    private saveService = inject(SaveService);
    private resourceService = inject(ResourceService);
    private researchService = inject(ResearchService);
    private combatService = inject(CombatService);

    // SIGNALS
    private readonly _player = signal<Player>(this.createInitialPlayer());
    private readonly _resources = signal<Resources>(this.resourceService.createInitialResources());
    private readonly _windows = signal<WindowStates>(this.createInitialWindows());
    private readonly _knownRunes = signal<Rune[]>([]);
    private readonly _craftedSpells = signal<Spell[]>([MAGIC_MISSILE]);
    private readonly _researchTree = signal<ResearchNode[]>(this.researchService.createInitialResearchTree());
    private readonly _upgrades = signal<Upgrade[]>(this.researchService.createInitialUpgrades());
    private readonly _combat = signal<CombatState>(this.combatService.createInitialCombatState());
    private readonly _idle = signal<IdleSettings>(this.createInitialIdleSettings());
    private readonly _equippedItems = signal<EquippedItems>(this.createInitialEquippedItems());
    private readonly _craftedEquipment = signal<EquipmentItem[]>([]);
    private readonly _equipmentRecipes = signal<EquipmentRecipe[]>(JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_RECIPES)));
    private readonly _alchemyRecipes = signal<AlchemyRecipe[]>(JSON.parse(JSON.stringify(INITIAL_ALCHEMY_RECIPES)));
    private readonly _alchemy = signal<AlchemyState>(this.createInitialAlchemyState());

    // Public readonly
    readonly player = this._player.asReadonly();
    readonly resources = this._resources.asReadonly();
    readonly windows = this._windows.asReadonly();
    readonly knownRunes = this._knownRunes.asReadonly();
    readonly craftedSpells = this._craftedSpells.asReadonly();
    readonly researchTree = this._researchTree.asReadonly();
    readonly upgrades = this._upgrades.asReadonly();
    readonly combat = this._combat.asReadonly();
    readonly idle = this._idle.asReadonly();
    readonly equippedItems = this._equippedItems.asReadonly();
    readonly craftedEquipment = this._craftedEquipment.asReadonly();
    readonly equipmentRecipes = this._equipmentRecipes.asReadonly();
    readonly alchemyRecipes = this._alchemyRecipes.asReadonly();
    readonly alchemy = this._alchemy.asReadonly();

    // Computed
    readonly availableResearch = computed(() =>
        this._researchTree().filter(node => node.unlocked && !node.researched));
    readonly visibleWindows = computed(() => {
        const w = this._windows();
        return Object.entries(w).filter(([_, s]) => s.unlocked && s.visible).map(([id]) => id as keyof WindowStates);
    });
    readonly closedWindows = computed(() => {
        const w = this._windows();
        return Object.entries(w).filter(([_, s]) => s.unlocked && !s.visible).map(([id]) => id as keyof WindowStates);
    });

    // Game loop
    private readonly destroy$ = new Subject<void>();
    private readonly TICK_RATE = 100;
    private autoSaveCounter = 0;
    private combatTickCounter = 0;

    constructor() {
        this.registerServicesSignals();
        this.loadGame();
        this.startGameLoop();
    }

    private registerServicesSignals(): void {
        // Register resource service
        this.resourceService.registerSignal(this._resources);

        // Register save service
        this.saveService.registerSignals({
            player: this._player,
            resources: this._resources,
            windows: this._windows,
            knownRunes: this._knownRunes,
            craftedSpells: this._craftedSpells,
            researchTree: this._researchTree,
            upgrades: this._upgrades,
            combat: this._combat,
            idle: this._idle,
            equippedItems: this._equippedItems,
            craftedEquipment: this._craftedEquipment,
            equipmentRecipes: this._equipmentRecipes,
            alchemyRecipes: this._alchemyRecipes,
            alchemy: this._alchemy,
        });

        // Register research service
        this.researchService.registerSignals({
            researchTree: this._researchTree,
            windows: this._windows,
            player: this._player,
            knownRunes: this._knownRunes,
            upgrades: this._upgrades,
        });
        this.researchService.registerCallbacks({
            spendMana: (amount) => this.spendMana(amount),
            unlockAutoCombat: () => this.unlockAutoCombat(),
            unlockPassiveManaRegen: () => this.unlockPassiveManaRegen(),
            increaseMaxMana: (amount) => this.resourceService.increaseMaxMana(amount),
            canAffordResources: (costs) => this.resourceService.canAffordResources(costs),
            spendCraftingResources: (costs) => this.resourceService.spendCraftingResources(costs),
        });

        // Register combat service
        this.combatService.registerSignals({
            combat: this._combat,
            player: this._player,
            craftedSpells: this._craftedSpells,
            idle: this._idle,
        });
        this.combatService.registerCallbacks({
            spendMana: (amount) => this.spendMana(amount),
            addMana: (amount) => this.addMana(amount),
            addGold: (amount) => this.addGold(amount),
            addCraftingResource: (id, amount) => this.addCraftingResource(id, amount),
            getUpgradeBonus: (type) => this.getUpgradeBonus(type),
            addSpellExperience: (spellId, xp) => this.addSpellExperience(spellId, xp),
        });
    }

    private startGameLoop(): void {
        interval(this.TICK_RATE).pipe(takeUntil(this.destroy$)).subscribe(() => this.tick());
    }

    private tick(): void {
        const idle = this._idle();
        const player = this._player();
        const resources = this._resources();
        const combat = this._combat();

        // Passive mana regen (requires unlock)
        if (idle.passiveManaRegenUnlocked && resources.mana < resources.maxMana) {
            const manaRegenMult = 1 + this.getUpgradeBonus('manaRegen') / 100;
            // Base regen: WIS * 0.025 per tick
            const manaRegen = player.WIS * 0.025 * manaRegenMult;
            this._resources.update(r => ({ ...r, mana: Math.min(r.maxMana, r.mana + manaRegen) }));
        }

        // Auto-meditate removed (consolidated)

        // HP regen (out of combat)
        if (!combat.inCombat && player.currentHP < player.maxHP) {
            this._player.update(p => ({ ...p, currentHP: Math.min(p.maxHP, p.currentHP + p.VIT * 0.02) }));
        }

        // Auto-combat
        if (idle.autoCombat && combat.inCombat) {
            this.combatTickCounter += this.TICK_RATE;
            const combatSpeed = this.combatService.getEffectiveCombatSpeed(player, idle.combatTickMs);
            if (this.combatTickCounter >= combatSpeed) {
                this.combatTickCounter = 0;
                this.combatService.autoCombatTick();
            }
        }

        // Auto-save
        this.autoSaveCounter += this.TICK_RATE;
        if (this.autoSaveCounter >= 10000) {
            this.autoSaveCounter = 0;
            this.saveGame();
        }

        // Check for level up
        this.checkLevelUp();

        // Check alchemy completion
        this.tickAlchemy();
    }

    // UPGRADE BONUSES (delegated to research service)
    getUpgradeBonus(type: string): number {
        return this.researchService.getUpgradeBonus(type);
    }

    getMaxRunesPerSpell(): number {
        return this.researchService.getMaxRunesPerSpell();
    }

    // SAVE/LOAD (delegated to save service)
    saveGame(): void { this.saveService.saveGame(); }
    loadGame(): boolean { return this.saveService.loadGame(); }
    exportSave(): string { return this.saveService.exportSave(); }
    importSave(data: string): boolean { return this.saveService.importSave(data); }

    resetGame(): void {
        this.saveService.resetGame();
        this._player.set(this.createInitialPlayer());
        this._resources.set(this.resourceService.createInitialResources());
        this._windows.set(this.createInitialWindows());
        this._knownRunes.set([]);
        this._craftedSpells.set([MAGIC_MISSILE]);
        this._researchTree.set(this.researchService.createInitialResearchTree());
        this._upgrades.set(this.researchService.createInitialUpgrades());
        this._combat.set(this.combatService.createInitialCombatState());
        this._idle.set(this.createInitialIdleSettings());
        this._equippedItems.set(this.createInitialEquippedItems());
        this._craftedEquipment.set([]);
        this._equipmentRecipes.set(JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_RECIPES)));
        this._alchemyRecipes.set(JSON.parse(JSON.stringify(INITIAL_ALCHEMY_RECIPES)));
        this._alchemy.set(this.createInitialAlchemyState());
    }

    // WINDOW
    openWindow(id: keyof WindowStates): void {
        this._windows.update(w => ({ ...w, [id]: { ...w[id], visible: true } }));
    }
    closeWindow(id: keyof WindowStates): void {
        this._windows.update(w => ({ ...w, [id]: { ...w[id], visible: false } }));
    }
    toggleWindow(id: keyof WindowStates): void {
        const c = this._windows()[id];
        if (c.unlocked) this._windows.update(w => ({ ...w, [id]: { ...w[id], visible: !w[id].visible } }));
    }
    updateWindowPosition(id: keyof WindowStates, x: number, y: number): void {
        this._windows.update(w => ({ ...w, [id]: { ...w[id], x, y } }));
    }
    getWindowPosition(id: keyof WindowStates): { x?: number; y?: number } {
        const w = this._windows()[id];
        return { x: w?.x, y: w?.y };
    }

    // RESOURCES (delegated to resource service)
    addMana(amount: number): void { this.resourceService.addMana(amount); }
    spendMana(amount: number): boolean { return this.resourceService.spendMana(amount); }
    addGold(amount: number): void { this.resourceService.addGold(amount); }
    addCraftingResource(id: string, amount: number): void { this.resourceService.addCraftingResource(id, amount); }
    spendCraftingResources(costs: ResourceCost[]): boolean { return this.resourceService.spendCraftingResources(costs); }
    canAffordResources(costs: ResourceCost[]): boolean { return this.resourceService.canAffordResources(costs); }

    // MEDITATION
    meditate(): void {
        const manaGain = 1 + Math.floor(this._player().WIS * 0.5);
        this.addMana(manaGain);
    }

    // IDLE
    setAutoCombat(e: boolean): void {
        if (!this._idle().autoCombatUnlocked) return;
        this._idle.update(i => ({ ...i, autoCombat: e }));
        this._combat.update(c => ({ ...c, autoCombat: e }));
    }
    unlockAutoCombat(): void {
        this._idle.update(i => ({ ...i, autoCombatUnlocked: true }));
    }
    unlockPassiveManaRegen(): void {
        this._idle.update(i => ({ ...i, passiveManaRegenUnlocked: true }));
    }
    setCombatSpeed(ms: number): void {
        this._idle.update(i => ({ ...i, combatTickMs: ms }));
        this._combat.update(c => ({ ...c, combatSpeed: ms }));
    }
    setSelectedSpell(id: string): void { this.combatService.setSelectedSpell(id); }

    // RESEARCH (delegated to research service)
    canResearch(id: string): boolean {
        return this.researchService.canResearch(id, this._resources().mana);
    }
    research(id: string): boolean {
        return this.researchService.research(id, this._resources().mana);
    }

    // UPGRADES (delegated to research service)
    getUpgradeCost(u: Upgrade): ResourceCost[] {
        return this.researchService.getUpgradeCost(u);
    }
    canAffordUpgrade(id: string): boolean {
        return this.researchService.canAffordUpgrade(id);
    }
    purchaseUpgrade(id: string): boolean {
        return this.researchService.purchaseUpgrade(id);
    }

    // SPELL CRAFTING
    craftSpell(name: string, runes: Rune[], materialCost: ResourceCost[]): Spell | null {
        if (runes.length === 0) return null;
        if (!this.spendCraftingResources(materialCost)) return null;
        const totalMana = runes.reduce((s, r) => s + r.manaCost, 0);
        const baseDmg = runes.reduce((s, r) => s + r.baseDamage, 0);
        const dmgMult = 1 + this._player().ARC * 0.1 + this.getUpgradeBonus('damage') / 100;
        const dmgTypes = [...new Set(runes.map(r => r.damageType))];
        const spell: Spell = {
            id: `spell-${Date.now()}`, name, runes: [...runes],
            totalManaCost: totalMana, calculatedDamage: Math.floor(baseDmg * dmgMult),
            description: `Woven from ${runes.map(r => r.name).join(', ')}.`,
            symbol: runes[0]?.symbol || '[*]', damageTypes: dmgTypes, craftCost: materialCost,
            experience: 0, level: 1,
        };
        this._craftedSpells.update(s => [...s, spell]);
        return spell;
    }

    addSpellExperience(spellId: string, xp: number): void {
        this._craftedSpells.update(spells => spells.map(s => {
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
        this._craftedSpells.update(s => s.filter(x => x.id !== id && !x.isDefault));
    }

    // COMBAT (delegated to combat service)
    startCombat(enemy: Enemy): void { this.combatService.startCombat(enemy); }
    castSpell(spell: Spell): void { this.combatService.castSpell(spell); }
    fleeCombat(): void { this.combatService.fleeCombat(); }

    // LEVELING SYSTEM
    getExperienceToLevel(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    checkLevelUp(): void {
        const player = this._player();
        const expNeeded = player.experienceToLevel;
        if (player.experience >= expNeeded) {
            this._player.update(p => ({
                ...p,
                experience: p.experience - expNeeded,
                level: p.level + 1,
                experienceToLevel: this.getExperienceToLevel(p.level + 1),
                attributePoints: p.attributePoints + 2,
                maxHP: p.maxHP + 10,
                currentHP: Math.min(p.currentHP + 10, p.maxHP + 10)
            }));
            this.combatService.addCombatLog(`Level Up! You are now level ${this._player().level}!`, 'victory');
        }
    }

    spendAttributePoint(stat: 'WIS' | 'ARC' | 'VIT' | 'BAR' | 'LCK' | 'SPD'): boolean {
        const player = this._player();
        if (player.attributePoints <= 0) return false;
        this._player.update(p => ({
            ...p,
            [stat]: p[stat] + 1,
            attributePoints: p.attributePoints - 1
        }));
        return true;
    }

    // EQUIPMENT SYSTEM
    craftEquipment(recipeId: string): boolean {
        const recipe = this._equipmentRecipes().find(r => r.id === recipeId);
        if (!recipe || !recipe.unlocked) return false;
        if (!this.resourceService.canAffordResources(recipe.cost)) return false;
        if (!this.resourceService.spendCraftingResources(recipe.cost)) return false;

        // Add item to crafted equipment inventory
        this._craftedEquipment.update(items => [...items, { ...recipe.resultItem }]);
        return true;
    }

    equipItem(itemId: string): boolean {
        const items = this._craftedEquipment();
        const itemIndex = items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return false;

        const item = items[itemIndex];
        const currentEquipped = this._equippedItems()[item.slot];

        // Remove item from inventory
        this._craftedEquipment.update(inv => inv.filter((_, idx) => idx !== itemIndex));

        // If something is already equipped in that slot, put it back in inventory
        if (currentEquipped) {
            this._craftedEquipment.update(inv => [...inv, currentEquipped]);
        }

        // Equip the new item
        this._equippedItems.update(eq => ({ ...eq, [item.slot]: item }));
        return true;
    }

    unequipItem(slot: EquipmentSlot): boolean {
        const equipped = this._equippedItems()[slot];
        if (!equipped) return false;

        // Put item back in inventory
        this._craftedEquipment.update(inv => [...inv, equipped]);

        // Clear the slot
        this._equippedItems.update(eq => ({ ...eq, [slot]: null }));
        return true;
    }

    getEquipmentBonus(bonusType: string, stat?: keyof PlayerStats): number {
        const equipped = this._equippedItems();
        let total = 0;

        for (const slot of Object.keys(equipped) as EquipmentSlot[]) {
            const item = equipped[slot];
            if (!item) continue;

            for (const bonus of item.bonuses) {
                if (bonus.type === bonusType) {
                    if (bonusType === 'stat' && stat && bonus.stat === stat) {
                        total += bonus.value;
                    } else if (bonusType !== 'stat') {
                        total += bonus.value;
                    }
                }
            }
        }

        return total;
    }

    // ALCHEMY SYSTEM
    startAlchemy(recipeId: string): boolean {
        const alchemy = this._alchemy();
        if (alchemy.activeRecipeId) return false; // Already crafting

        const recipe = this._alchemyRecipes().find(r => r.id === recipeId);
        if (!recipe || !recipe.unlocked) return false;
        if (!this.resourceService.canAffordResources(recipe.inputs)) return false;
        if (!this.resourceService.spendCraftingResources(recipe.inputs)) return false;

        const now = Date.now();
        this._alchemy.set({
            activeRecipeId: recipeId,
            craftStartTime: now,
            craftEndTime: now + recipe.craftTimeMs,
        });
        return true;
    }

    cancelAlchemy(): void {
        this._alchemy.set(this.createInitialAlchemyState());
    }

    private tickAlchemy(): void {
        const alchemy = this._alchemy();
        if (!alchemy.activeRecipeId) return;

        if (Date.now() >= alchemy.craftEndTime) {
            const recipe = this._alchemyRecipes().find(r => r.id === alchemy.activeRecipeId);
            if (recipe) {
                let selectedOutputs: { resourceId: string; amount: number }[] = [];

                if (recipe.possibleOutputs && recipe.possibleOutputs.length > 0) {
                    // Random selection based on weighted chances
                    const totalWeight = recipe.possibleOutputs.reduce((sum, po) => sum + po.chance, 0);
                    let random = Math.random() * totalWeight;
                    for (const possibleOutput of recipe.possibleOutputs) {
                        random -= possibleOutput.chance;
                        if (random <= 0) {
                            selectedOutputs = possibleOutput.outputs;
                            break;
                        }
                    }
                    // Fallback to first if somehow none selected
                    if (selectedOutputs.length === 0) {
                        selectedOutputs = recipe.possibleOutputs[0].outputs;
                    }
                } else if (recipe.outputs) {
                    selectedOutputs = recipe.outputs;
                }

                for (const output of selectedOutputs) {
                    this.resourceService.addCraftingResource(output.resourceId, output.amount);
                }
            }
            this._alchemy.set(this.createInitialAlchemyState());
        }
    }

    private createInitialAlchemyState(): AlchemyState {
        return {
            activeRecipeId: null,
            craftStartTime: 0,
            craftEndTime: 0,
        };
    }

    // INITIAL STATE
    private createInitialPlayer(): Player {
        return {
            id: 'player', name: 'Apprentice',
            WIS: 1, HP: 50, ARC: 1, VIT: 1, BAR: 0, LCK: 1, SPD: 1,
            currentHP: 50, maxHP: 50, currentMana: 0, maxMana: 25,
            level: 1, experience: 0, experienceToLevel: 100, attributePoints: 0
        };
    }

    private createInitialWindows(): WindowStates {
        return {
            altar: { unlocked: true, visible: true },
            research: { unlocked: true, visible: true },
            scriptorium: { unlocked: false, visible: false },
            combat: { unlocked: false, visible: false },
            inventory: { unlocked: false, visible: false },
            workshop: { unlocked: false, visible: false },
            runebook: { unlocked: false, visible: false },
            grimoire: { unlocked: false, visible: false },
            stats: { unlocked: true, visible: true },
            bestiary: { unlocked: false, visible: false },
            chronicle: { unlocked: false, visible: false },
            settings: { unlocked: true, visible: false },
            discoveries: { unlocked: false, visible: false },
            armory: { unlocked: false, visible: false },
            equipment: { unlocked: false, visible: false },
            alchemy: { unlocked: false, visible: false },
        };
    }

    private createInitialEquippedItems(): EquippedItems {
        return {
            head: null,
            face: null,
            accessory: null,
            body: null,
            handL: null,
            handR: null,
            relic: null,
        };
    }

    private createInitialIdleSettings(): IdleSettings {
        return {
            autoCombat: false, autoCombatUnlocked: false,
            autoLoot: true, combatTickMs: 1000,
            passiveManaRegenUnlocked: false
        };
    }

    ngOnDestroy(): void {
        this.saveGame();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
