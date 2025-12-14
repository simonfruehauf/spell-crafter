// =============================================================================
// GAME INTERFACES - Spell-Crafting Idle Game (Expanded)
// =============================================================================

/**
 * Damage types for spells
 */
export type DamageType =
  | 'physical' | 'fire' | 'ice' | 'lightning' | 'earth'
  | 'water' | 'wind' | 'holy' | 'dark' | 'arcane' | 'poison' | 'nature';

/**
 * Player statistics
 */
export interface PlayerStats {
  WIS: number;  // Wisdom - mana regen, research
  HP: number;   // Health Points
  ARC: number;  // Arcane - spell damage
  VIT: number;  // Vitality - HP regen
  BAR: number;  // Barrier - damage reduction
  LCK: number;  // Luck - crit chance, loot bonus
  SPD: number;  // Speed - combat turn speed
  CHA: number;  // Charisma - market prices
}

/**
 * Base entity
 */
export interface Entity extends PlayerStats {
  id: string;
  name: string;
  currentHP: number;
  maxHP: number;
  level: number;
}

/**
 * Player entity
 */
export interface Player extends Entity {
  currentMana: number;
  maxMana: number;
  experience: number;
  experienceToLevel: number;
  attributePoints: number;
}

/**
 * Loot drop
 */
export interface LootDrop {
  resourceId: string;
  minAmount: number;
  maxAmount: number;
  chance: number;
}

/**
 * Enemy entity
 */
export interface Enemy extends Entity {
  goldReward: number;
  expReward: number;
  lootTable: LootDrop[];
  ascii: string;
  weakness?: DamageType;
  resistance?: DamageType;
}

/**
 * Rune effect types
 */
export type RuneEffectType =
  | 'damage' | 'heal' | 'dot' | 'hot' | 'buff' | 'debuff'
  | 'lifesteal' | 'shield' | 'manaDrain' | 'execute' | 'crit'
  | 'stun' | 'slow' | 'piercing' | 'splash' | 'chain';

export interface RuneEffect {
  type: RuneEffectType;
  value: number;
  duration?: number;
  targetStat?: keyof PlayerStats;
  secondaryValue?: number;
}

/**
 * Resource cost
 */
export interface ResourceCost {
  resourceId: string;
  amount: number;
}

/**
 * Rune definition
 */
export interface Rune {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  baseDamage: number;
  damageType: DamageType;
  effect: RuneEffect;
  craftCost: ResourceCost[];
  symbol: string;
}

/**
 * Crafted spell
 */
export interface Spell {
  id: string;
  name: string;
  runes: Rune[];
  totalManaCost: number;
  calculatedDamage: number;
  description: string;
  symbol: string;
  isDefault?: boolean;
  damageTypes: DamageType[];
  craftCost: ResourceCost[];
  experience: number;
  level: number;
}

/**
 * Resource categories
 */
export type ResourceCategory =
  | 'essence'      // Elemental essences (12)
  | 'reagent'      // Magical reagents (15)
  | 'gem'          // Precious gems (12)
  | 'metal'        // Ores and ingots (10)
  | 'herb'         // Magical plants (12)
  | 'creature'     // Monster parts (15)
  | 'enchanted'    // Enchanted items (12)
  | 'rune_mat'     // Runecrafting materials (8)
  | 'artifact'     // Rare artifacts (6)
  | 'currency';    // Special currencies (3)

/**
 * Resource definition
 */
export interface ResourceDef {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/**
 * Game resources
 */
export interface Resources {
  mana: number;
  maxMana: number;
  gold: number;
  crafting: Record<string, number>;
}

/**
 * Window state
 */
export interface WindowState {
  unlocked: boolean;
  visible: boolean;
  x?: number;  // Position on screen
  y?: number;
}

export interface WindowStates {
  altar: WindowState;
  research: WindowState;
  scriptorium: WindowState;
  laboratory: WindowState;
  combat: WindowState;
  inventory: WindowState;
  workshop: WindowState;
  runebook: WindowState;
  grimoire: WindowState;
  stats: WindowState;
  bestiary: WindowState;
  chronicle: WindowState;
  settings: WindowState;
  discoveries: WindowState;
  armory: WindowState;
  equipment: WindowState;
  alchemy: WindowState;
  apothecary: WindowState;
  goblinApprentice: WindowState;
  garden: WindowState;
  spellbook: WindowState;
  market: WindowState;
}

/**
 * Garden plot state
 */
export interface GardenPlot {
  id: number;
  plantedHerbId: string | null;  // Currently always 'mint_plant' when planted
  plantedAt: number;             // Timestamp when planted
  growthDurationMs: number;      // Time to mature (default 30000ms)
  unlocked: boolean;
}

/**
 * Garden state
 */
export interface GardenState {
  plots: GardenPlot[];
  maxPlots: number;
}

/**
 * Equipment slot types
 */
export type EquipmentSlot = 'head' | 'face' | 'accessory' | 'body' | 'handL' | 'handR' | 'relic';

/**
 * Equipment bonus types
 */
export type EquipmentBonusType =
  | 'stat'          // +stat value (WIS, ARC, VIT, BAR, LCK, SPD)
  | 'maxMana'       // +maxMana
  | 'maxHP'         // +maxHP
  | 'damagePercent' // +X% spell damage
  | 'critChance'    // +X% crit chance
  | 'critDamage'    // +X% crit damage
  | 'lootChance'    // +X% loot drop chance
  | 'lootQuantity'; // +X% loot quantity

/**
 * Equipment bonus
 */
export interface EquipmentBonus {
  type: EquipmentBonusType;
  stat?: keyof PlayerStats; // Only for type 'stat'
  value: number;
}

/**
 * Equipment rarity
 */
export type EquipmentRarity = 'mundane' | 'elevated' | 'exceptional' | 'primal' | 'epochal' | 'unique';

/**
 * Equipment item definition
 */
export interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  slot: EquipmentSlot;
  bonuses: EquipmentBonus[];
  rarity: EquipmentRarity;
}

/**
 * Equipment crafting recipe
 */
export interface EquipmentRecipe {
  id: string;
  resultItem: EquipmentItem;
  cost: ResourceCost[];
  unlocked: boolean;
}

/**
 * Possible output for alchemy (for random chance recipes)
 */
export interface AlchemyPossibleOutput {
  outputs: ResourceCost[];
  chance: number; // Weight for random selection (higher = more likely)
}

/**
 * Alchemy recipe for transmuting materials
 */
export interface AlchemyRecipe {
  id: string;
  name: string;
  description: string;
  inputs: ResourceCost[];
  outputs?: ResourceCost[]; // Fixed outputs (used if possibleOutputs not set)
  possibleOutputs?: AlchemyPossibleOutput[]; // Random outputs - one will be chosen
  craftTimeMs: number;
  unlocked: boolean;
}

/**
 * Active alchemy crafting state
 */
export interface AlchemyState {
  activeRecipeId: string | null;
  craftStartTime: number;
  craftEndTime: number;
}

/**
 * Active potion brewing state
 */
export interface BrewingState {
  activePotionId: string | null;
  brewStartTime: number;
  brewEndTime: number;
}

/**
 * Potion effect types
 */
export type PotionEffectType =
  | 'healFlat'        // Heal flat HP (e.g., +5 HP)
  | 'healPercent'     // Heal % of max HP (e.g., +10% HP)
  | 'manaFlat'        // Restore flat mana
  | 'manaPercent'     // Restore % of max mana
  | 'buffStat'        // Temporary stat buff
  | 'shield'          // Grant temporary shield
  | 'damageBoost'     // Boost damage for X turns
  | 'cleanse'         // Remove negative effects
  | 'regen'           // Heal over time (per turn)
  | 'critBoost'       // Increase crit chance
  | 'speedBoost'      // Grant extra action(s)
  | 'reflect'         // Reflect damage back to attacker
  | 'lifesteal';      // Heal for % of damage dealt

/**
 * Individual potion effect
 */
export interface PotionEffect {
  type: PotionEffectType;
  value: number;
  duration?: number;           // For buffs (turns)
  stat?: keyof PlayerStats;    // For buffStat type
}

/**
 * Potion definition
 */
export interface Potion {
  id: string;
  name: string;
  description: string;
  effects: PotionEffect[];
  craftCost: ResourceCost[];
  manaCost: number;            // Mana required to craft (can be 0 for % cost)
  manaCostPercent?: number;    // Mana cost as % of max mana (alternative to flat)
  symbol: string;              // Display symbol
}

/**
 * Player potion inventory
 */
export type PotionInventory = Record<string, number>;

/**
 * Player equipped items
 */
export interface EquippedItems {
  head: EquipmentItem | null;
  face: EquipmentItem | null;
  accessory: EquipmentItem | null;
  body: EquipmentItem | null;
  handL: EquipmentItem | null;
  handR: EquipmentItem | null;
  relic: EquipmentItem | null;
}

/**
 * Research node
 */
export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  resourceCost?: ResourceCost[];
  unlocked: boolean;
  researched: boolean;
  unlockEffect: ResearchUnlockEffect;
  prerequisites: string[];
}

export type ResearchUnlockEffect =
  | { type: 'window'; windowId: keyof WindowStates }
  | { type: 'rune'; runeId: string }
  | { type: 'stat'; stat: keyof PlayerStats; value: number }
  | { type: 'upgrade'; upgradeId: string }
  | { type: 'idle'; idleId: string }
  | { type: 'maxMana'; value: number }
  | { type: 'misc'; value: string }; // For special UI features

/**
 * Workshop upgrade
 */
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'stats' | 'combat' | 'crafting' | 'idle' | 'special';
  level: number;
  maxLevel: number;
  cost: ResourceCost[];
  costMultiplier: number;
  effect: UpgradeEffect;
  unlocked: boolean;
  prerequisite?: string;
}

export type UpgradeEffect =
  | { type: 'stat'; stat: keyof PlayerStats; valuePerLevel: number }
  | { type: 'maxMana'; valuePerLevel: number }
  | { type: 'manaRegen'; percentPerLevel: number }
  | { type: 'damage'; percentPerLevel: number }
  | { type: 'lootChance'; percentPerLevel: number }
  | { type: 'lootQuantity'; percentPerLevel: number }
  | { type: 'combatSpeed'; msReductionPerLevel: number }
  | { type: 'critChance'; percentPerLevel: number }
  | { type: 'critDamage'; percentPerLevel: number }
  | { type: 'maxRunes'; valuePerLevel: number }
  | { type: 'unlockFeature'; feature: string }
  // New effect types for expanded upgrades
  | { type: 'armorPen'; percentPerLevel: number }
  | { type: 'lifesteal'; percentPerLevel: number }
  | { type: 'manaCostReduction'; percentPerLevel: number }
  | { type: 'expBoost'; percentPerLevel: number }
  | { type: 'goldBoost'; percentPerLevel: number }
  | { type: 'hpRegen'; valuePerLevel: number }
  | { type: 'runeCostReduction'; percentPerLevel: number }
  | { type: 'runeDamage'; percentPerLevel: number }
  | { type: 'spellExp'; percentPerLevel: number }
  | { type: 'allStats'; valuePerLevel: number }
  | { type: 'critAll'; percentPerLevel: number }
  | { type: 'allEffects'; percentPerLevel: number }
  | { type: 'spellChain'; valuePerLevel: number }
  | { type: 'doubleEffect'; percentPerLevel: number }
  | { type: 'allGains'; percentPerLevel: number }
  | { type: 'soulBonus'; percentPerLevel: number }
  | { type: 'allDefense'; percentPerLevel: number }
  | { type: 'beastDamage'; percentPerLevel: number }
  | { type: 'gardenPlot'; valuePerLevel: number }
  | { type: 'potionPower'; percentPerLevel: number };

/**
 * Combat log entry
 */
export interface CombatLogEntry {
  timestamp: Date;
  message: string;
  type: 'damage' | 'heal' | 'info' | 'victory' | 'defeat' | 'loot' | 'effect' | 'crit';
}

/**
 * Active effect
 */
export interface ActiveEffect {
  name: string;
  type: RuneEffectType;
  value: number;
  remainingTurns: number;
  targetStat?: keyof PlayerStats;
}

/**
 * Combat state
 */
export interface CombatState {
  inCombat: boolean;
  currentEnemy: Enemy | null;
  combatLog: CombatLogEntry[];
  playerTurn: boolean;
  autoCombat: boolean;
  combatSpeed: number;
  selectedSpellId: string | null;
  playerEffects: ActiveEffect[];
  enemyEffects: ActiveEffect[];
  enemiesDefeated: number;
  enemyDefeats: Record<string, number>;
  deathLockoutUntil: number;  // Timestamp when lockout ends
  victoryFlash: boolean;      // Show victory message briefly
  spellQueue: string[];       // Ordered list of spell IDs for auto-combat
  spellQueueIndex: number;    // Current position in spell queue
}

/**
 * Idle settings
 */
export interface IdleSettings {
  // autoMeditate removed (consolidated into passiveManaRegen)
  autoCombat: boolean;
  autoCombatUnlocked: boolean;
  autoProgress: boolean;  // Auto-progress to next enemy when victory is trivial (>50% HP remaining)
  autoLoot: boolean;
  combatTickMs: number;
  passiveManaRegenUnlocked: boolean;
  usePotionUnlocked: boolean;
  goblinApprenticeUnlocked: boolean;
  spellbookUnlocked: boolean;
}

/**
 * Complete game state
 */
export interface GameState {
  player: Player;
  resources: Resources;
  windows: WindowStates;
  knownRunes: Rune[];
  craftedSpells: Spell[];
  researchTree: ResearchNode[];
  upgrades: Upgrade[];
  combat: CombatState;
  idle: IdleSettings;
  themes: ThemeState;
  tickRate: number;
  // Equipment system
  equippedItems: EquippedItems;
  craftedEquipment: EquipmentItem[];
  equipmentRecipes: EquipmentRecipe[];
  // Potion system
  potions: PotionInventory;
  // Garden system
  garden: GardenState;
  discoveredResources: string[];
}

/**
 * Theme state
 */
export interface ThemeState {
  active: string;
  unlocked: string[];
}

