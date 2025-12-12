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
}

export interface WindowStates {
  altar: WindowState;
  research: WindowState;
  scriptorium: WindowState;
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
  | { type: 'maxMana'; value: number };

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
  | { type: 'unlockFeature'; feature: string };

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
}

/**
 * Idle settings
 */
export interface IdleSettings {
  autoMeditate: boolean;
  autoMeditateUnlocked: boolean;
  autoCombat: boolean;
  autoCombatUnlocked: boolean;
  autoLoot: boolean;
  combatTickMs: number;
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
  tickRate: number;
  // Equipment system
  equippedItems: EquippedItems;
  craftedEquipment: EquipmentItem[];
  equipmentRecipes: EquipmentRecipe[];
}
