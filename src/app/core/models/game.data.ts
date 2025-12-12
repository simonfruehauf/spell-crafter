import { Rune, ResearchNode, Enemy, Spell, Upgrade, AlchemyRecipe } from './game.interfaces';
import { RESOURCE_NAMES, INITIAL_CRAFTING_RESOURCES } from './resources.data';

// Re-export for convenience
export { ALL_RESOURCES, RESOURCE_NAMES, INITIAL_CRAFTING_RESOURCES, RESOURCE_DEFS, getResourcesByCategory } from './resources.data';

// =============================================================================
// ASCII ART
// =============================================================================

export const ASCII_ART = {
    player: `
  /\
 /  \
-------
|O  O|
 \__/`,
    goblin: `  ,
 /&\\
(o o)
`,
    skeleton: ` ___
/x x\\
 |_|`,
    wraith: ` ~~~
~O O~
 ~~~`,
    dragon: `  /\\
 /  \\__
/ ^  \\>`,
};

// =============================================================================
// STARTING SPELL
// =============================================================================

export const MAGIC_MISSILE: Spell = {
    id: 'magic-missile',
    name: 'Magic Missile',
    runes: [],
    totalManaCost: 10,
    calculatedDamage: 5,
    description: 'A basic bolt of arcane energy.',
    symbol: '[*]',
    isDefault: true,
    damageTypes: ['arcane'],
    craftCost: [],
    experience: 0,
    level: 1,
};

// =============================================================================
// RUNES (25 runes with damage types)
// =============================================================================

export const RUNES: Record<string, Rune> = {
    // FIRE RUNES
    ignis: {
        id: 'ignis', name: 'Ignis', description: 'The primal fire rune. Burns foes.',
        manaCost: 8, baseDamage: 12, damageType: 'fire',
        effect: { type: 'damage', value: 12 },
        craftCost: [{ resourceId: 'fire_essence', amount: 5 }, { resourceId: 'runestone', amount: 2 }],
        symbol: '[~]',
    },
    inferno: {
        id: 'inferno', name: 'Inferno', description: 'Intense flames that burn over time.',
        manaCost: 15, baseDamage: 8, damageType: 'fire',
        effect: { type: 'dot', value: 6, duration: 4 },
        craftCost: [{ resourceId: 'fire_essence', amount: 10 }, { resourceId: 'ruby', amount: 2 }],
        symbol: '[#]',
    },

    // ICE RUNES
    glacies: {
        id: 'glacies', name: 'Glacies', description: 'The frozen rune. Chills the soul.',
        manaCost: 7, baseDamage: 10, damageType: 'ice',
        effect: { type: 'damage', value: 10 },
        craftCost: [{ resourceId: 'ice_essence', amount: 5 }, { resourceId: 'runestone', amount: 2 }],
        symbol: '[*]',
    },
    frigus: {
        id: 'frigus', name: 'Frigus', description: 'Slows enemies with bitter cold.',
        manaCost: 10, baseDamage: 6, damageType: 'ice',
        effect: { type: 'slow', value: 2, duration: 3 },
        craftCost: [{ resourceId: 'ice_essence', amount: 8 }, { resourceId: 'sapphire', amount: 1 }],
        symbol: '[<]',
    },

    // LIGHTNING RUNES
    fulgur: {
        id: 'fulgur', name: 'Fulgur', description: 'Lightning strikes with shocking force.',
        manaCost: 10, baseDamage: 15, damageType: 'lightning',
        effect: { type: 'damage', value: 15 },
        craftCost: [{ resourceId: 'lightning_essence', amount: 6 }, { resourceId: 'runestone', amount: 2 }],
        symbol: '[/]',
    },
    catena: {
        id: 'catena', name: 'Catena', description: 'Lightning that chains between foes.',
        manaCost: 18, baseDamage: 10, damageType: 'lightning',
        effect: { type: 'chain', value: 10, secondaryValue: 3 },
        craftCost: [{ resourceId: 'lightning_essence', amount: 12 }, { resourceId: 'topaz', amount: 2 }],
        symbol: '[Z]',
    },

    // EARTH RUNES
    terra: {
        id: 'terra', name: 'Terra', description: 'The earth rune. Solid and powerful.',
        manaCost: 9, baseDamage: 14, damageType: 'earth',
        effect: { type: 'damage', value: 14 },
        craftCost: [{ resourceId: 'earth_essence', amount: 5 }, { resourceId: 'runestone', amount: 2 }],
        symbol: '[=]',
    },
    murus: {
        id: 'murus', name: 'Murus', description: 'Creates a protective barrier.',
        manaCost: 12, baseDamage: 0, damageType: 'earth',
        effect: { type: 'shield', value: 20, duration: 3 },
        craftCost: [{ resourceId: 'earth_essence', amount: 8 }, { resourceId: 'golem_heart', amount: 1 }],
        symbol: '[#]',
    },

    // DARK RUNES
    mortem: {
        id: 'mortem', name: 'Mortem', description: 'The death rune. Drains life over time.',
        manaCost: 12, baseDamage: 4, damageType: 'dark',
        effect: { type: 'dot', value: 5, duration: 3 },
        craftCost: [{ resourceId: 'dark_essence', amount: 6 }, { resourceId: 'soul_shard', amount: 1 }],
        symbol: '[x]',
    },
    sanguis: {
        id: 'sanguis', name: 'Sanguis', description: 'The blood rune. Steals life from foes.',
        manaCost: 14, baseDamage: 8, damageType: 'dark',
        effect: { type: 'lifesteal', value: 8, secondaryValue: 0.5 },
        craftCost: [{ resourceId: 'dark_essence', amount: 8 }, { resourceId: 'dragon_blood', amount: 1 }],
        symbol: '[=]',
    },
    umbra: {
        id: 'umbra', name: 'Umbra', description: 'Shadow that weakens enemy defenses.',
        manaCost: 10, baseDamage: 5, damageType: 'dark',
        effect: { type: 'debuff', value: 4, duration: 3, targetStat: 'BAR' },
        craftCost: [{ resourceId: 'dark_essence', amount: 7 }, { resourceId: 'shadow_thread', amount: 2 }],
        symbol: '[.]',
    },

    // HOLY RUNES
    lux: {
        id: 'lux', name: 'Lux', description: 'Holy light that smites the wicked.',
        manaCost: 10, baseDamage: 12, damageType: 'holy',
        effect: { type: 'damage', value: 12 },
        craftCost: [{ resourceId: 'holy_essence', amount: 6 }, { resourceId: 'runestone', amount: 2 }],
        symbol: '[+]',
    },
    vita: {
        id: 'vita', name: 'Vita', description: 'The life rune. Mends wounds.',
        manaCost: 15, baseDamage: 0, damageType: 'holy',
        effect: { type: 'heal', value: 25 },
        craftCost: [{ resourceId: 'life_essence', amount: 8 }, { resourceId: 'healing_moss', amount: 5 }],
        symbol: '[+]',
    },
    sana: {
        id: 'sana', name: 'Sana', description: 'Healing energy over time.',
        manaCost: 12, baseDamage: 0, damageType: 'holy',
        effect: { type: 'hot', value: 6, duration: 4 },
        craftCost: [{ resourceId: 'life_essence', amount: 6 }, { resourceId: 'mana_blossom', amount: 3 }],
        symbol: '[&]',
    },

    // BUFF RUNES
    fortis: {
        id: 'fortis', name: 'Fortis', description: 'Strengthens magical barriers.',
        manaCost: 8, baseDamage: 0, damageType: 'arcane',
        effect: { type: 'buff', value: 5, duration: 3, targetStat: 'BAR' },
        craftCost: [{ resourceId: 'earth_essence', amount: 4 }, { resourceId: 'runed_stone', amount: 2 }],
        symbol: '[#]',
    },
    velox: {
        id: 'velox', name: 'Velox', description: 'Hastens arcane power.',
        manaCost: 6, baseDamage: 0, damageType: 'arcane',
        effect: { type: 'buff', value: 3, duration: 4, targetStat: 'ARC' },
        craftCost: [{ resourceId: 'wind_essence', amount: 4 }, { resourceId: 'spirit_dust', amount: 3 }],
        symbol: '[>]',
    },
    potens: {
        id: 'potens', name: 'Potens', description: 'Increases raw damage output.',
        manaCost: 10, baseDamage: 0, damageType: 'arcane',
        effect: { type: 'buff', value: 5, duration: 3, targetStat: 'ARC' },
        craftCost: [{ resourceId: 'arcane_essence', amount: 5 }, { resourceId: 'mana_crystal', amount: 5 }],
        symbol: '[^]',
    },

    // SPECIAL RUNES
    scutum: {
        id: 'scutum', name: 'Scutum', description: 'Creates a temporary shield.',
        manaCost: 12, baseDamage: 0, damageType: 'arcane',
        effect: { type: 'shield', value: 15, duration: 2 },
        craftCost: [{ resourceId: 'earth_essence', amount: 5 }, { resourceId: 'mana_crystal', amount: 3 }],
        symbol: '[O]',
    },
    sorbere: {
        id: 'sorbere', name: 'Sorbere', description: 'Drains mana from the aether.',
        manaCost: 5, baseDamage: 6, damageType: 'arcane',
        effect: { type: 'manaDrain', value: 6, secondaryValue: 10 },
        craftCost: [{ resourceId: 'arcane_essence', amount: 5 }, { resourceId: 'mana_battery', amount: 1 }],
        symbol: '[@]',
    },
    occidere: {
        id: 'occidere', name: 'Occidere', description: 'Devastating to wounded foes.',
        manaCost: 15, baseDamage: 8, damageType: 'dark',
        effect: { type: 'execute', value: 8, secondaryValue: 0.3 },
        craftCost: [{ resourceId: 'void_essence', amount: 6 }, { resourceId: 'demon_claw', amount: 1 }],
        symbol: '[!]',
    },
    fortuna: {
        id: 'fortuna', name: 'Fortuna', description: 'Chance for devastating strikes.',
        manaCost: 7, baseDamage: 10, damageType: 'arcane',
        effect: { type: 'crit', value: 10, secondaryValue: 0.25 },
        craftCost: [{ resourceId: 'arcane_essence', amount: 4 }, { resourceId: 'diamond', amount: 1 }],
        symbol: '[?]',
    },
    venenum: {
        id: 'venenum', name: 'Venenum', description: 'Poison that lingers.',
        manaCost: 8, baseDamage: 3, damageType: 'poison',
        effect: { type: 'dot', value: 4, duration: 5 },
        craftCost: [{ resourceId: 'thornroot', amount: 5 }, { resourceId: 'spider_silk', amount: 3 }],
        symbol: '[%]',
    },
    stupor: {
        id: 'stupor', name: 'Stupor', description: 'Stuns the target briefly.',
        manaCost: 14, baseDamage: 5, damageType: 'arcane',
        effect: { type: 'stun', value: 1, duration: 1 },
        craftCost: [{ resourceId: 'lightning_essence', amount: 5 }, { resourceId: 'temporal_sand', amount: 1 }],
        symbol: '[!]',
    },
    perforare: {
        id: 'perforare', name: 'Perforare', description: 'Pierces magical defenses.',
        manaCost: 12, baseDamage: 10, damageType: 'arcane',
        effect: { type: 'piercing', value: 10, secondaryValue: 0.5 },
        craftCost: [{ resourceId: 'arcane_essence', amount: 6 }, { resourceId: 'adamantine_ore', amount: 2 }],
        symbol: '[>]',
    },
};

// =============================================================================
// ENEMIES (12 enemies with weaknesses/resistances)
// =============================================================================

export const ENEMIES: Enemy[] = [
    {
        id: 'goblin', name: 'Goblin Trickster', level: 1,
        WIS: 1, HP: 30, ARC: 2, VIT: 1, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 30, maxHP: 30, goldReward: 5, expReward: 10,
        ascii: ASCII_ART.goblin, weakness: 'fire',
        lootTable: [
            { resourceId: 'goblin_tooth', minAmount: 1, maxAmount: 2, chance: 0.6 },
            { resourceId: 'arcane_ash', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'iron_ore', minAmount: 1, maxAmount: 1, chance: 0.3 },
            { resourceId: 'copper_ore', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'healing_moss', minAmount: 1, maxAmount: 2, chance: 0.3 },
        ],
    },
    {
        id: 'wolf', name: 'Shadow Wolf', level: 1,
        WIS: 0, HP: 28, ARC: 1, VIT: 2, BAR: 0, LCK: 2, SPD: 3,
        currentHP: 28, maxHP: 28, goldReward: 6, expReward: 12,
        ascii: ` /\\___
(o   o)
 \\mmm/`, weakness: 'fire',
        lootTable: [
            { resourceId: 'wolf_pelt', minAmount: 1, maxAmount: 2, chance: 0.7 },
            { resourceId: 'healing_moss', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'thornroot', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'fireweed', minAmount: 1, maxAmount: 1, chance: 0.2 },
        ],
    },
    {
        id: 'spider', name: 'Giant Spider', level: 2,
        WIS: 0, HP: 32, ARC: 2, VIT: 1, BAR: 0, LCK: 1, SPD: 2,
        currentHP: 32, maxHP: 32, goldReward: 8, expReward: 14,
        ascii: ` /\\_/\\
(o . o)
 /_|_\\`, weakness: 'fire',
        lootTable: [
            { resourceId: 'spider_silk', minAmount: 2, maxAmount: 4, chance: 0.7 },
            { resourceId: 'thornroot', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'witch_salt', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'binding_thread', minAmount: 1, maxAmount: 1, chance: 0.2 },
        ],
    },
    {
        id: 'skeleton', name: 'Risen Skeleton', level: 2,
        WIS: 0, HP: 40, ARC: 3, VIT: 0, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 40, maxHP: 40, goldReward: 8, expReward: 15,
        ascii: ASCII_ART.skeleton, weakness: 'holy', resistance: 'dark',
        lootTable: [
            { resourceId: 'skeleton_bone', minAmount: 1, maxAmount: 3, chance: 0.7 },
            { resourceId: 'dark_essence', minAmount: 1, maxAmount: 1, chance: 0.3 },
            { resourceId: 'soul_shard', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'rune_chisel', minAmount: 1, maxAmount: 1, chance: 0.2 },
        ],
    },
    {
        id: 'fireImp', name: 'Fire Imp', level: 2,
        WIS: 2, HP: 25, ARC: 5, VIT: 1, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 25, maxHP: 25, goldReward: 10, expReward: 18,
        ascii: ` \\^/
 (o)
  Y`, weakness: 'ice', resistance: 'fire',
        lootTable: [
            { resourceId: 'fire_essence', minAmount: 1, maxAmount: 3, chance: 0.6 },
            { resourceId: 'imp_horn', minAmount: 1, maxAmount: 2, chance: 0.5 },
            { resourceId: 'ruby', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'fireweed', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'magic_candle', minAmount: 1, maxAmount: 1, chance: 0.2 },
        ],
    },
    {
        id: 'waterElemental', name: 'Water Elemental', level: 3,
        WIS: 3, HP: 38, ARC: 5, VIT: 3, BAR: 0, LCK: 1, SPD: 2,
        currentHP: 38, maxHP: 38, goldReward: 14, expReward: 24,
        ascii: ` ~~~
(o o)
 ~~~`, weakness: 'lightning', resistance: 'fire',
        lootTable: [
            { resourceId: 'water_essence', minAmount: 2, maxAmount: 4, chance: 0.7 },
            { resourceId: 'frostleaf', minAmount: 1, maxAmount: 2, chance: 0.5 },
            { resourceId: 'mana_blossom', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'ether_glass', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'iceWraith', name: 'Ice Wraith', level: 3,
        WIS: 3, HP: 35, ARC: 4, VIT: 2, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 35, maxHP: 35, goldReward: 12, expReward: 22,
        ascii: ASCII_ART.wraith, weakness: 'fire', resistance: 'ice',
        lootTable: [
            { resourceId: 'ice_essence', minAmount: 1, maxAmount: 3, chance: 0.6 },
            { resourceId: 'wraith_essence', minAmount: 1, maxAmount: 1, chance: 0.4 },
            { resourceId: 'sapphire', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'frostleaf', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'ghostcap', minAmount: 1, maxAmount: 1, chance: 0.2 },
        ],
    },
    {
        id: 'stormElemental', name: 'Storm Elemental', level: 4,
        WIS: 4, HP: 45, ARC: 6, VIT: 2, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 45, maxHP: 45, goldReward: 18, expReward: 30,
        ascii: ` /\\
/~~\\
|zZ|`, weakness: 'earth', resistance: 'lightning',
        lootTable: [
            { resourceId: 'lightning_essence', minAmount: 2, maxAmount: 4, chance: 0.6 },
            { resourceId: 'elemental_core', minAmount: 1, maxAmount: 1, chance: 0.4 },
            { resourceId: 'topaz', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'wind_essence', minAmount: 1, maxAmount: 2, chance: 0.5 },
            { resourceId: 'mana_battery', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'forestGuardian', name: 'Forest Guardian', level: 4,
        WIS: 4, HP: 55, ARC: 4, VIT: 5, BAR: 0, LCK: 2, SPD: 1,
        currentHP: 55, maxHP: 55, goldReward: 20, expReward: 35,
        ascii: ` /|\\
(o o)
 /|\\`, weakness: 'fire', resistance: 'earth',
        lootTable: [
            { resourceId: 'life_essence', minAmount: 1, maxAmount: 3, chance: 0.6 },
            { resourceId: 'mana_blossom', minAmount: 2, maxAmount: 4, chance: 0.6 },
            { resourceId: 'sunpetal', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'shadowcap', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'dreamweed', minAmount: 1, maxAmount: 1, chance: 0.25 },
            { resourceId: 'dragonlily', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'earthGolem', name: 'Earth Golem', level: 5,
        WIS: 0, HP: 80, ARC: 3, VIT: 4, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 80, maxHP: 80, goldReward: 25, expReward: 40,
        ascii: `[###]
|   |
|___|`, weakness: 'lightning', resistance: 'earth',
        lootTable: [
            { resourceId: 'earth_essence', minAmount: 2, maxAmount: 5, chance: 0.7 },
            { resourceId: 'golem_heart', minAmount: 1, maxAmount: 1, chance: 0.35 },
            { resourceId: 'runestone', minAmount: 1, maxAmount: 2, chance: 0.5 },
            { resourceId: 'iron_ore', minAmount: 2, maxAmount: 4, chance: 0.5 },
            { resourceId: 'silver_ore', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'gold_ore', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'alchemistGolem', name: 'Alchemist Golem', level: 5,
        WIS: 3, HP: 65, ARC: 5, VIT: 3, BAR: 0, LCK: 3, SPD: 1,
        currentHP: 65, maxHP: 65, goldReward: 28, expReward: 45,
        ascii: `[ooo]
|~~~|
|___|`, weakness: 'lightning',
        lootTable: [
            { resourceId: 'mana_crystal', minAmount: 2, maxAmount: 4, chance: 0.6 },
            { resourceId: 'spell_focus', minAmount: 1, maxAmount: 1, chance: 0.3 },
            { resourceId: 'enchanted_scroll', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'inscription_dust', minAmount: 1, maxAmount: 2, chance: 0.35 },
            { resourceId: 'binding_rune', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'amethyst', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'voidShade', name: 'Void Shade', level: 6,
        WIS: 5, HP: 50, ARC: 7, VIT: 2, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 50, maxHP: 50, goldReward: 30, expReward: 50,
        ascii: ` ???
?   ?
 ???`, weakness: 'holy', resistance: 'dark',
        lootTable: [
            { resourceId: 'void_essence', minAmount: 2, maxAmount: 4, chance: 0.7 },
            { resourceId: 'shadow_thread', minAmount: 1, maxAmount: 3, chance: 0.5 },
            { resourceId: 'soulstone', minAmount: 1, maxAmount: 1, chance: 0.1 },
            { resourceId: 'onyx', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'obsidian', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'dreamWeaver', name: 'Dream Weaver', level: 6,
        WIS: 6, HP: 48, ARC: 8, VIT: 2, BAR: 0, LCK: 2, SPD: 2,
        currentHP: 48, maxHP: 48, goldReward: 32, expReward: 55,
        ascii: ` *~*
(o_o)
 ~~`, weakness: 'fire',
        lootTable: [
            { resourceId: 'arcane_essence', minAmount: 2, maxAmount: 4, chance: 0.6 },
            { resourceId: 'dreamweed', minAmount: 2, maxAmount: 3, chance: 0.6 },
            { resourceId: 'moonstone_powder', minAmount: 1, maxAmount: 3, chance: 0.5 },
            { resourceId: 'starlight_shard', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'moonstone', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'enchanted_ink', minAmount: 1, maxAmount: 2, chance: 0.3 },
        ],
    },
    {
        id: 'phoenix', name: 'Lesser Phoenix', level: 7,
        WIS: 6, HP: 60, ARC: 8, VIT: 5, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 60, maxHP: 60, goldReward: 40, expReward: 65,
        ascii: `  _
 /#\\
/###\\`, weakness: 'ice', resistance: 'fire',
        lootTable: [
            { resourceId: 'fire_essence', minAmount: 3, maxAmount: 5, chance: 0.8 },
            { resourceId: 'phoenix_feather', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'phoenix_ash', minAmount: 1, maxAmount: 1, chance: 0.25 },
            { resourceId: 'temporal_sand', minAmount: 1, maxAmount: 1, chance: 0.15 },
        ],
    },
    {
        id: 'corruptedAngel', name: 'Corrupted Angel', level: 7,
        WIS: 5, HP: 58, ARC: 9, VIT: 4, BAR: 0, LCK: 2, SPD: 2,
        currentHP: 58, maxHP: 58, goldReward: 45, expReward: 70,
        ascii: `  †
 /|\\
  |`, weakness: 'dark', resistance: 'holy',
        lootTable: [
            { resourceId: 'holy_essence', minAmount: 2, maxAmount: 4, chance: 0.7 },
            { resourceId: 'angel_feather', minAmount: 1, maxAmount: 2, chance: 0.5 },
            { resourceId: 'arcane_token', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'spell_catalyst', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'soul_coin', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'demon', name: 'Lesser Demon', level: 8,
        WIS: 4, HP: 70, ARC: 9, VIT: 3, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 70, maxHP: 70, goldReward: 50, expReward: 80,
        ascii: ` /^\\
|x x|
 \\V/`, weakness: 'holy', resistance: 'fire',
        lootTable: [
            { resourceId: 'dark_essence', minAmount: 2, maxAmount: 4, chance: 0.7 },
            { resourceId: 'demon_claw', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'bloodstone', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'ethereal_chain', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'amplifying_glyph', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'titan', name: 'Stone Titan', level: 9,
        WIS: 2, HP: 100, ARC: 6, VIT: 6, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 100, maxHP: 100, goldReward: 70, expReward: 100,
        ascii: ` [#]
[###]
 [ ]`, weakness: 'arcane', resistance: 'physical',
        lootTable: [
            { resourceId: 'earth_essence', minAmount: 3, maxAmount: 6, chance: 0.8 },
            { resourceId: 'titan_bone', minAmount: 1, maxAmount: 1, chance: 0.3 },
            { resourceId: 'titan_marrow', minAmount: 1, maxAmount: 1, chance: 0.1 },
            { resourceId: 'mithril_ore', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'orichalcum_ore', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'dragon', name: 'Young Dragon', level: 10,
        WIS: 8, HP: 120, ARC: 10, VIT: 6, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 120, maxHP: 120, goldReward: 100, expReward: 150,
        ascii: ASCII_ART.dragon, weakness: 'ice',
        lootTable: [
            { resourceId: 'dragon_scale', minAmount: 1, maxAmount: 3, chance: 0.6 },
            { resourceId: 'dragon_fang', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'dragon_blood', minAmount: 1, maxAmount: 1, chance: 0.25 },
            { resourceId: 'diamond', minAmount: 1, maxAmount: 1, chance: 0.1 },
            { resourceId: 'starmetal_ore', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'worldtree_leaf', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'ancientGuardian', name: 'Ancient Guardian', level: 11,
        WIS: 8, HP: 130, ARC: 11, VIT: 7, BAR: 2, LCK: 2, SPD: 1,
        currentHP: 130, maxHP: 130, goldReward: 150, expReward: 200,
        ascii: `  [*]
 [###]
  |_|`, weakness: 'dark',
        lootTable: [
            { resourceId: 'primordial_glyph', minAmount: 1, maxAmount: 1, chance: 0.3 },
            { resourceId: 'master_rune', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'dimensional_shard', minAmount: 1, maxAmount: 1, chance: 0.25 },
            { resourceId: 'void_prism', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'adamantine_ore', minAmount: 1, maxAmount: 2, chance: 0.3 },
            { resourceId: 'voidsteel_ore', minAmount: 1, maxAmount: 1, chance: 0.1 },
        ],
    },
    {
        id: 'elderThing', name: 'Elder Thing', level: 12,
        WIS: 10, HP: 150, ARC: 12, VIT: 8, BAR: 0, LCK: 1, SPD: 1,
        currentHP: 150, maxHP: 150, goldReward: 200, expReward: 300,
        ascii: `  ?!?
 (??)
  ~~`, resistance: 'arcane',
        lootTable: [
            { resourceId: 'void_essence', minAmount: 3, maxAmount: 6, chance: 0.8 },
            { resourceId: 'elder_eye', minAmount: 1, maxAmount: 1, chance: 0.2 },
            { resourceId: 'primal_essence', minAmount: 1, maxAmount: 1, chance: 0.15 },
            { resourceId: 'arcane_token', minAmount: 1, maxAmount: 3, chance: 0.5 },
            { resourceId: 'elder_rune', minAmount: 1, maxAmount: 1, chance: 0.08 },
            { resourceId: 'primordial_ore', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'voidbloom', minAmount: 1, maxAmount: 1, chance: 0.1 },
            { resourceId: 'infinity_loop', minAmount: 1, maxAmount: 1, chance: 0.03 },
            { resourceId: 'genesis_spark', minAmount: 1, maxAmount: 1, chance: 0.02 },
        ],
    },
    {
        id: 'cosmicHorror', name: 'Cosmic Horror', level: 15,
        WIS: 12, HP: 200, ARC: 15, VIT: 10, BAR: 3, LCK: 3, SPD: 2,
        currentHP: 200, maxHP: 200, goldReward: 500, expReward: 500,
        ascii: `  ?*?
 /???\\
  ???`, resistance: 'arcane',
        lootTable: [
            { resourceId: 'void_essence', minAmount: 5, maxAmount: 10, chance: 0.9 },
            { resourceId: 'primal_essence', minAmount: 1, maxAmount: 2, chance: 0.4 },
            { resourceId: 'philosophers_stone', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'eye_of_ages', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'heart_of_magic', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'crown_fragment', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'void_crystal', minAmount: 1, maxAmount: 1, chance: 0.05 },
            { resourceId: 'world_seed', minAmount: 1, maxAmount: 1, chance: 0.03 },
            { resourceId: 'divine_mark', minAmount: 1, maxAmount: 1, chance: 0.1 },
            { resourceId: 'soul_coin', minAmount: 1, maxAmount: 2, chance: 0.3 },
        ],
    },
];

// =============================================================================
// UPGRADES
// =============================================================================

export const INITIAL_UPGRADES: Upgrade[] = [
    // STATS
    {
        id: 'wis_1', name: 'Wisdom I', description: 'Increase WIS by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'mana_crystal', amount: 5 }, { resourceId: 'spirit_dust', amount: 3 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'WIS', valuePerLevel: 1 }, unlocked: true
    },
    {
        id: 'arc_1', name: 'Arcane Power I', description: 'Increase ARC by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'arcane_essence', amount: 5 }, { resourceId: 'mana_crystal', amount: 3 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'ARC', valuePerLevel: 1 }, unlocked: true
    },
    {
        id: 'vit_1', name: 'Vitality I', description: 'Increase VIT by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'life_essence', amount: 5 }, { resourceId: 'healing_moss', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'VIT', valuePerLevel: 1 }, unlocked: true
    },
    {
        id: 'bar_1', name: 'Barrier I', description: 'Increase BAR by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'earth_essence', amount: 5 }, { resourceId: 'iron_ore', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'BAR', valuePerLevel: 1 }, unlocked: true
    },
    {
        id: 'max_hp', name: 'Max Health', description: 'Increase max HP by 10 per level.',
        category: 'stats', level: 0, maxLevel: 20,
        cost: [{ resourceId: 'life_essence', amount: 3 }, { resourceId: 'healing_moss', amount: 3 }],
        costMultiplier: 1.3, effect: { type: 'stat', stat: 'HP', valuePerLevel: 10 }, unlocked: true
    },
    {
        id: 'max_mana', name: 'Mana Pool', description: 'Increase max mana by 20 per level.',
        category: 'stats', level: 0, maxLevel: 20,
        cost: [{ resourceId: 'mana_crystal', amount: 3 }, { resourceId: 'mana_blossom', amount: 3 }],
        costMultiplier: 1.3, effect: { type: 'maxMana', valuePerLevel: 20 }, unlocked: true
    },

    // COMBAT
    {
        id: 'crit_chance', name: 'Critical Strike', description: 'Increase crit chance by 2% per level.',
        category: 'combat', level: 0, maxLevel: 15,
        cost: [{ resourceId: 'demon_claw', amount: 1 }, { resourceId: 'arcane_ash', amount: 5 }],
        costMultiplier: 1.6, effect: { type: 'critChance', percentPerLevel: 2 }, unlocked: false, prerequisite: 'arc_1'
    },
    {
        id: 'crit_damage', name: 'Devastating Blows', description: 'Increase crit damage by 10% per level.',
        category: 'combat', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'dragon_fang', amount: 1 }, { resourceId: 'ruby', amount: 2 }],
        costMultiplier: 1.8, effect: { type: 'critDamage', percentPerLevel: 10 }, unlocked: false, prerequisite: 'crit_chance'
    },
    {
        id: 'spell_power', name: 'Spell Mastery', description: 'Increase spell damage by 5% per level.',
        category: 'combat', level: 0, maxLevel: 20,
        cost: [{ resourceId: 'arcane_essence', amount: 3 }, { resourceId: 'spell_catalyst', amount: 1 }],
        costMultiplier: 1.4, effect: { type: 'damage', percentPerLevel: 5 }, unlocked: true
    },

    // IDLE
    {
        id: 'mana_regen', name: 'Mana Regeneration', description: 'Increase mana regen by 10% per level.',
        category: 'idle', level: 0, maxLevel: 20,
        cost: [{ resourceId: 'mana_crystal', amount: 5 }, { resourceId: 'spirit_dust', amount: 5 }],
        costMultiplier: 1.4, effect: { type: 'manaRegen', percentPerLevel: 10 }, unlocked: true
    },
    {
        id: 'faster_combat', name: 'Swift Combat', description: 'Reduce combat tick by 50ms per level.',
        category: 'idle', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'wind_essence', amount: 5 }, { resourceId: 'temporal_sand', amount: 1 }],
        costMultiplier: 2.0, effect: { type: 'combatSpeed', msReductionPerLevel: 50 }, unlocked: true
    },

    // CRAFTING
    {
        id: 'loot_chance', name: 'Lucky Looter', description: 'Increase loot drop chance by 5% per level.',
        category: 'crafting', level: 0, maxLevel: 20,
        cost: [{ resourceId: 'opal', amount: 1 }, { resourceId: 'arcane_token', amount: 1 }],
        costMultiplier: 1.5, effect: { type: 'lootChance', percentPerLevel: 5 }, unlocked: true
    },
    {
        id: 'loot_quantity', name: 'Abundant Harvest', description: 'Increase loot quantity by 10% per level.',
        category: 'crafting', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'emerald', amount: 2 }, { resourceId: 'binding_thread', amount: 3 }],
        costMultiplier: 1.6, effect: { type: 'lootQuantity', percentPerLevel: 10 }, unlocked: false, prerequisite: 'loot_chance'
    },
    {
        id: 'max_runes', name: 'Spell Complexity', description: 'Increase max runes per spell by 1 per level. (Base: 3)',
        category: 'crafting', level: 0, maxLevel: 7,
        cost: [{ resourceId: 'master_rune', amount: 1 }, { resourceId: 'spell_parchment', amount: 5 }],
        costMultiplier: 2.0, effect: { type: 'maxRunes', valuePerLevel: 1 }, unlocked: true
    },

    // NEW UPGRADES - Using previously unused resources
    // STATS II (uses rare herbs and gems)
    {
        id: 'wis_2', name: 'Wisdom II', description: 'Further increase WIS by 1 per level.',
        category: 'stats', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'dreamweed', amount: 3 }, { resourceId: 'moonstone', amount: 1 }],
        costMultiplier: 1.8, effect: { type: 'stat', stat: 'WIS', valuePerLevel: 1 }, unlocked: false, prerequisite: 'wis_1'
    },
    {
        id: 'arc_2', name: 'Arcane Power II', description: 'Further increase ARC by 1 per level.',
        category: 'stats', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'amethyst', amount: 2 }, { resourceId: 'starlight_shard', amount: 3 }],
        costMultiplier: 1.8, effect: { type: 'stat', stat: 'ARC', valuePerLevel: 1 }, unlocked: false, prerequisite: 'arc_1'
    },
    {
        id: 'vit_2', name: 'Vitality II', description: 'Further increase VIT by 1 per level.',
        category: 'stats', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'sunpetal', amount: 3 }, { resourceId: 'holy_essence', amount: 2 }],
        costMultiplier: 1.8, effect: { type: 'stat', stat: 'VIT', valuePerLevel: 1 }, unlocked: false, prerequisite: 'vit_1'
    },
    {
        id: 'bar_2', name: 'Barrier II', description: 'Further increase BAR by 1 per level.',
        category: 'stats', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'obsidian', amount: 2 }, { resourceId: 'copper_ore', amount: 5 }],
        costMultiplier: 1.8, effect: { type: 'stat', stat: 'BAR', valuePerLevel: 1 }, unlocked: false, prerequisite: 'bar_1'
    },
    {
        id: 'lck_1', name: 'Fortune I', description: 'Increase LCK by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'gold_ore', amount: 3 }, { resourceId: 'goblin_tooth', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'LCK', valuePerLevel: 1 }, unlocked: true
    },
    {
        id: 'spd_1', name: 'Swiftness I', description: 'Increase SPD by 1 per level.',
        category: 'stats', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'water_essence', amount: 4 }, { resourceId: 'frostleaf', amount: 3 }],
        costMultiplier: 1.5, effect: { type: 'stat', stat: 'SPD', valuePerLevel: 1 }, unlocked: true
    },

    // COMBAT II (uses creature parts and rare items)
    {
        id: 'armor_pen', name: 'Armor Piercing', description: 'Ignore 3% of enemy barrier per level.',
        category: 'combat', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'skeleton_bone', amount: 5 }, { resourceId: 'onyx', amount: 1 }],
        costMultiplier: 1.5, effect: { type: 'armorPen', percentPerLevel: 3 }, unlocked: true
    },
    {
        id: 'life_steal', name: 'Vampiric Touch', description: 'Heal for 2% of damage dealt per level.',
        category: 'combat', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'shadowcap', amount: 3 }, { resourceId: 'bloodstone', amount: 1 }],
        costMultiplier: 1.7, effect: { type: 'lifesteal', percentPerLevel: 2 }, unlocked: false, prerequisite: 'vit_1'
    },
    {
        id: 'spell_efficiency', name: 'Spell Efficiency', description: 'Reduce spell mana cost by 3% per level.',
        category: 'combat', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'ether_glass', amount: 1 }, { resourceId: 'enchanted_ink', amount: 2 }],
        costMultiplier: 1.6, effect: { type: 'manaCostReduction', percentPerLevel: 3 }, unlocked: true
    },

    // IDLE II (uses enchanted items)
    {
        id: 'exp_boost', name: 'Combat Experience', description: 'Increase combat experience by 10% per level.',
        category: 'idle', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'enchanted_scroll', amount: 3 }, { resourceId: 'witch_salt', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'expBoost', percentPerLevel: 10 }, unlocked: true
    },
    {
        id: 'gold_boost', name: 'Treasure Hunter', description: 'Increase gold from combat by 10% per level.',
        category: 'idle', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'gold_ore', amount: 2 }, { resourceId: 'magic_candle', amount: 2 }],
        costMultiplier: 1.5, effect: { type: 'goldBoost', percentPerLevel: 10 }, unlocked: true
    },
    {
        id: 'hp_regen', name: 'Regeneration', description: 'Regenerate 1 HP per 5 seconds per level.',
        category: 'idle', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'fireweed', amount: 5 }, { resourceId: 'ghostcap', amount: 2 }],
        costMultiplier: 1.4, effect: { type: 'hpRegen', valuePerLevel: 1 }, unlocked: true
    },

    // CRAFTING II (uses rune materials)
    {
        id: 'rune_efficiency', name: 'Rune Efficiency', description: 'Reduce rune mana cost by 5% per level.',
        category: 'crafting', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'rune_chisel', amount: 2 }, { resourceId: 'inscription_dust', amount: 3 }],
        costMultiplier: 1.5, effect: { type: 'runeCostReduction', percentPerLevel: 5 }, unlocked: true
    },
    {
        id: 'rune_power', name: 'Rune Empowerment', description: 'Increase rune damage by 5% per level.',
        category: 'crafting', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'binding_rune', amount: 2 }, { resourceId: 'amplifying_glyph', amount: 1 }],
        costMultiplier: 1.6, effect: { type: 'runeDamage', percentPerLevel: 5 }, unlocked: false, prerequisite: 'rune_efficiency'
    },
    {
        id: 'spell_exp', name: 'Spell Mastery Training', description: 'Increase spell experience gain by 10% per level.',
        category: 'crafting', level: 0, maxLevel: 10,
        cost: [{ resourceId: 'spell_focus', amount: 1 }, { resourceId: 'moonstone_powder', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'spellExp', percentPerLevel: 10 }, unlocked: true
    },

    // LEGENDARY UPGRADES (uses artifacts and rare materials)
    {
        id: 'transcendence', name: 'Transcendence', description: 'All stats +1 per level.',
        category: 'stats', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'primordial_glyph', amount: 1 }, { resourceId: 'dragonlily', amount: 3 }],
        costMultiplier: 2.5, effect: { type: 'allStats', valuePerLevel: 1 }, unlocked: false, prerequisite: 'wis_2'
    },
    {
        id: 'dragon_aspect', name: 'Dragon Aspect', description: 'Massive damage boost (+15% per level).',
        category: 'combat', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'dragon_scale', amount: 2 }, { resourceId: 'orichalcum_ore', amount: 1 }],
        costMultiplier: 2.5, effect: { type: 'damage', percentPerLevel: 15 }, unlocked: false, prerequisite: 'spell_power'
    },
    {
        id: 'titan_endurance', name: 'Titan Endurance', description: 'Massive HP boost (+50 per level).',
        category: 'stats', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'titan_bone', amount: 1 }, { resourceId: 'starmetal_ore', amount: 1 }],
        costMultiplier: 2.5, effect: { type: 'stat', stat: 'HP', valuePerLevel: 50 }, unlocked: false, prerequisite: 'max_hp'
    },
    {
        id: 'void_mastery', name: 'Void Mastery', description: 'All crit stats +5% per level.',
        category: 'combat', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'voidsteel_ore', amount: 1 }, { resourceId: 'dimensional_shard', amount: 1 }],
        costMultiplier: 2.5, effect: { type: 'critAll', percentPerLevel: 5 }, unlocked: false, prerequisite: 'crit_damage'
    },
    {
        id: 'primordial_power', name: 'Primordial Power', description: 'Unlock true power. All effects +10% per level.',
        category: 'crafting', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'primordial_ore', amount: 1 }, { resourceId: 'elder_rune', amount: 1 }],
        costMultiplier: 3.0, effect: { type: 'allEffects', percentPerLevel: 10 }, unlocked: false, prerequisite: 'rune_power'
    },
    {
        id: 'ethereal_binding', name: 'Ethereal Binding', description: 'Spells chain to additional targets.',
        category: 'combat', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'ethereal_chain', amount: 2 }, { resourceId: 'angel_feather', amount: 1 }],
        costMultiplier: 2.0, effect: { type: 'spellChain', valuePerLevel: 1 }, unlocked: false, prerequisite: 'spell_power'
    },
    {
        id: 'reality_warp', name: 'Reality Warp', description: 'Chance to double spell effects.',
        category: 'crafting', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'void_prism', amount: 1 }, { resourceId: 'worldtree_leaf', amount: 1 }],
        costMultiplier: 2.0, effect: { type: 'doubleEffect', percentPerLevel: 5 }, unlocked: false, prerequisite: 'rune_power'
    },
    {
        id: 'infinite_potential', name: 'Infinite Potential', description: 'Unlock endless growth. +2% to all gains per level.',
        category: 'idle', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'infinity_loop', amount: 1 }, { resourceId: 'genesis_spark', amount: 1 }],
        costMultiplier: 3.0, effect: { type: 'allGains', percentPerLevel: 2 }, unlocked: false, prerequisite: 'primordial_power'
    },

    // CURRENCY-BASED UPGRADES
    {
        id: 'soul_investment', name: 'Soul Investment', description: 'Permanent +5% gold and exp per level.',
        category: 'idle', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'soul_coin', amount: 1 }, { resourceId: 'soulstone', amount: 1 }],
        costMultiplier: 2.0, effect: { type: 'soulBonus', percentPerLevel: 5 }, unlocked: false, prerequisite: 'gold_boost'
    },
    {
        id: 'divine_blessing', name: 'Divine Blessing', description: 'Divine protection. +10% all defenses per level.',
        category: 'stats', level: 0, maxLevel: 3,
        cost: [{ resourceId: 'divine_mark', amount: 1 }, { resourceId: 'holy_essence', amount: 5 }],
        costMultiplier: 2.5, effect: { type: 'allDefense', percentPerLevel: 10 }, unlocked: false, prerequisite: 'bar_2'
    },

    // WOLF AND SPIDER CRAFTING
    {
        id: 'beast_slayer', name: 'Beast Slayer', description: '+10% damage vs beasts per level.',
        category: 'combat', level: 0, maxLevel: 5,
        cost: [{ resourceId: 'wolf_pelt', amount: 3 }, { resourceId: 'spider_silk', amount: 5 }],
        costMultiplier: 1.5, effect: { type: 'beastDamage', percentPerLevel: 10 }, unlocked: true
    },
];

// =============================================================================
// ALCHEMY RECIPES
// =============================================================================

export const INITIAL_ALCHEMY_RECIPES: AlchemyRecipe[] = [
    // Basic elemental essences (~20s craft time)
    {
        id: 'distill-minor', name: 'Distill Minor Essence',
        description: 'Extract a random basic essence from goblin teeth and healing moss.',
        inputs: [{ resourceId: 'goblin_tooth', amount: 2 }, { resourceId: 'healing_moss', amount: 2 }],
        possibleOutputs: [
            { outputs: [{ resourceId: 'fire_essence', amount: 1 }], chance: 0.25 },
            { outputs: [{ resourceId: 'ice_essence', amount: 1 }], chance: 0.25 },
            { outputs: [{ resourceId: 'earth_essence', amount: 1 }], chance: 0.25 },
            { outputs: [{ resourceId: 'water_essence', amount: 1 }], chance: 0.25 },
        ],
        craftTimeMs: 15000, unlocked: true,
    },
    {
        id: 'distill-fire', name: 'Distill Fire Essence',
        description: 'Extract fire essence from imp horns and fireweed.',
        inputs: [{ resourceId: 'imp_horn', amount: 3 }, { resourceId: 'fireweed', amount: 2 }],
        outputs: [{ resourceId: 'fire_essence', amount: 3 }],
        craftTimeMs: 20000, unlocked: true,
    },
    {
        id: 'distill-ice', name: 'Distill Ice Essence',
        description: 'Extract ice essence from wraith remains and frostleaf.',
        inputs: [{ resourceId: 'wraith_essence', amount: 3 }, { resourceId: 'frostleaf', amount: 2 }],
        outputs: [{ resourceId: 'ice_essence', amount: 3 }],
        craftTimeMs: 20000, unlocked: true,
    },
    {
        id: 'distill-lightning', name: 'Distill Lightning Essence',
        description: 'Extract lightning essence from elemental cores.',
        inputs: [{ resourceId: 'elemental_core', amount: 2 }, { resourceId: 'spirit_dust', amount: 2 }],
        outputs: [{ resourceId: 'lightning_essence', amount: 3 }],
        craftTimeMs: 25000, unlocked: true,
    },
    {
        id: 'distill-earth', name: 'Distill Earth Essence',
        description: 'Extract earth essence from bones and thornroot.',
        inputs: [{ resourceId: 'skeleton_bone', amount: 5 }, { resourceId: 'thornroot', amount: 2 }],
        outputs: [{ resourceId: 'earth_essence', amount: 3 }],
        craftTimeMs: 20000, unlocked: true,
    },
    {
        id: 'distill-water', name: 'Distill Water Essence',
        description: 'Extract water essence from spider silk and frostleaf.',
        inputs: [{ resourceId: 'spider_silk', amount: 3 }, { resourceId: 'frostleaf', amount: 3 }],
        outputs: [{ resourceId: 'water_essence', amount: 3 }],
        craftTimeMs: 20000, unlocked: true,
    },
    {
        id: 'distill-wind', name: 'Distill Wind Essence',
        description: 'Extract wind essence from pelts and moss.',
        inputs: [{ resourceId: 'wolf_pelt', amount: 3 }, { resourceId: 'healing_moss', amount: 3 }],
        outputs: [{ resourceId: 'wind_essence', amount: 3 }],
        craftTimeMs: 20000, unlocked: true,
    },
    // Uncommon essences (30s craft time)
    {
        id: 'distill-dark', name: 'Distill Dark Essence',
        description: 'Extract dark essence from shadow materials.',
        inputs: [{ resourceId: 'shadow_thread', amount: 4 }, { resourceId: 'shadowcap', amount: 2 }],
        outputs: [{ resourceId: 'dark_essence', amount: 2 }],
        craftTimeMs: 30000, unlocked: true,
    },
    {
        id: 'distill-holy', name: 'Distill Holy Essence',
        description: 'Extract holy essence from angelic remnants.',
        inputs: [{ resourceId: 'angel_feather', amount: 2 }, { resourceId: 'sunpetal', amount: 3 }],
        outputs: [{ resourceId: 'holy_essence', amount: 2 }],
        craftTimeMs: 30000, unlocked: true,
    },
    {
        id: 'distill-life', name: 'Distill Life Essence',
        description: 'Extract life essence from healing materials.',
        inputs: [{ resourceId: 'healing_moss', amount: 5 }, { resourceId: 'mana_blossom', amount: 3 }],
        outputs: [{ resourceId: 'life_essence', amount: 2 }],
        craftTimeMs: 25000, unlocked: true,
    },
    // Rare essences (30-40s craft time)
    {
        id: 'distill-arcane', name: 'Distill Arcane Essence',
        description: 'Extract pure arcane essence from magical reagents.',
        inputs: [{ resourceId: 'mana_crystal', amount: 5 }, { resourceId: 'arcane_ash', amount: 3 }],
        outputs: [{ resourceId: 'arcane_essence', amount: 2 }],
        craftTimeMs: 30000, unlocked: true,
    },
    {
        id: 'distill-void', name: 'Distill Void Essence',
        description: 'Transmute dark essence into void essence.',
        inputs: [{ resourceId: 'dark_essence', amount: 3 }, { resourceId: 'soul_shard', amount: 1 }],
        outputs: [{ resourceId: 'void_essence', amount: 1 }],
        craftTimeMs: 40000, unlocked: true,
    },
];

// =============================================================================
// RESEARCH TREE
// =============================================================================

export const INITIAL_RESEARCH_TREE: ResearchNode[] = [
    // Mana Capacity Unlocks (25 -> 50 -> 75 -> 100)
    {
        id: 'mana-capacity-1', name: 'Expanded Mind I', description: 'Increase max mana to 50.',
        manaCost: 20, unlocked: true, researched: false,
        unlockEffect: { type: 'maxMana', value: 25 }, prerequisites: []
    },
    {
        id: 'mana-capacity-2', name: 'Expanded Mind II', description: 'Increase max mana to 75.',
        manaCost: 40, unlocked: false, researched: false,
        unlockEffect: { type: 'maxMana', value: 25 }, prerequisites: ['mana-capacity-1']
    },
    {
        id: 'mana-capacity-3', name: 'Expanded Mind III', description: 'Increase max mana to 100.',
        manaCost: 60, unlocked: false, researched: false,
        unlockEffect: { type: 'maxMana', value: 25 }, prerequisites: ['mana-capacity-2']
    },
    {
        id: 'basic-meditation', name: 'Deep Meditation', description: 'Draw more mana from the aether. (+1 WIS)',
        manaCost: 15, unlocked: true, researched: false,
        unlockEffect: { type: 'stat', stat: 'WIS', value: 1 }, prerequisites: []
    },
    {
        id: 'mana-attunement', name: 'Mana Attunement', description: 'Your connection to the aether passively regenerates mana.',
        manaCost: 10, unlocked: true, researched: false,
        unlockEffect: { type: 'idle', idleId: 'passiveManaRegen' }, prerequisites: []
    },
    {
        id: 'unlock-scriptorium', name: 'The Scriptorium', description: 'Discover the art of spell-crafting.',
        manaCost: 35, unlocked: true, researched: false,
        unlockEffect: { type: 'window', windowId: 'scriptorium' }, prerequisites: []
    },
    {
        id: 'unlock-inventory', name: 'The Vault', description: 'Store your collected resources.',
        manaCost: 15, unlocked: true, researched: false,
        unlockEffect: { type: 'window', windowId: 'inventory' }, prerequisites: []
    },
    {
        id: 'unlock-runebook', name: 'The Runebook', description: 'A tome of arcane rune knowledge.',
        manaCost: 55, unlocked: true, researched: false,
        unlockEffect: { type: 'window', windowId: 'runebook' }, prerequisites: []
    },
    {
        id: 'unlock-grimoire', name: 'The Grimoire', description: 'Track your bound spells and mastery.',
        manaCost: 15, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'grimoire' }, prerequisites: ['unlock-scriptorium']
    },

    {
        id: 'pyromancy', name: 'Pyromancy I', description: 'Unlock the Ignis rune.',
        manaCost: 30, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'ignis' }, prerequisites: ['unlock-scriptorium']
    },
    {
        id: 'cryomancy', name: 'Cryomancy I', description: 'Unlock the Glacies rune.',
        manaCost: 30, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'glacies' }, prerequisites: ['unlock-scriptorium']
    },
    {
        id: 'unlock-combat', name: 'The Arena', description: 'Open the combat arena.',
        manaCost: 40, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'combat' }, prerequisites: ['unlock-scriptorium']
    },

    {
        id: 'electromancy', name: 'Electromancy I', description: 'Unlock the Fulgur rune.',
        manaCost: 50, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'fulgur' }, prerequisites: ['unlock-combat']
    },
    {
        id: 'geomancy', name: 'Geomancy I', description: 'Unlock the Terra rune.',
        manaCost: 50, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'terra' }, prerequisites: ['unlock-combat']
    },
    {
        id: 'restoration', name: 'Restoration I', description: 'Unlock the Vita rune.',
        manaCost: 45, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'vita' }, prerequisites: ['unlock-combat']
    },

    {
        id: 'unlock-workshop', name: 'The Workshop', description: 'Craft powerful upgrades.',
        manaCost: 60, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'workshop' }, prerequisites: ['unlock-combat']
    },

    {
        id: 'unlock-armory', name: 'The Armory', description: 'Craft magical equipment to empower yourself.',
        manaCost: 70, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'armory' }, prerequisites: ['unlock-workshop']
    },

    {
        id: 'unlock-alchemy', name: 'The Alembic', description: 'Unlock the art of transmutation.',
        manaCost: 65, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'alchemy' }, prerequisites: ['unlock-workshop']
    },

    {
        id: 'swift-casting', name: 'Swift Incantations', description: 'Unlock the Velox rune.',
        manaCost: 40, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'velox' }, prerequisites: ['unlock-combat']
    },
    {
        id: 'fortification', name: 'Fortification', description: 'Unlock the Fortis rune.',
        manaCost: 55, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'fortis' }, prerequisites: ['restoration']
    },
    {
        id: 'necromancy', name: 'Dark Studies', description: 'Unlock the Mortem rune.',
        manaCost: 60, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'mortem' }, prerequisites: ['restoration']
    },
    {
        id: 'holy-magic', name: 'Holy Magic', description: 'Unlock the Lux rune.',
        manaCost: 55, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'lux' }, prerequisites: ['restoration']
    },

    {
        id: 'blood-magic', name: 'Blood Magic', description: 'Unlock the Sanguis rune.',
        manaCost: 80, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'sanguis' }, prerequisites: ['necromancy']
    },
    {
        id: 'shield-magic', name: 'Barrier Arts', description: 'Unlock the Scutum rune.',
        manaCost: 70, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'scutum' }, prerequisites: ['fortification']
    },
    {
        id: 'mana-mastery', name: 'Mana Mastery', description: 'Unlock the Sorbere rune.',
        manaCost: 75, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'sorbere' }, prerequisites: ['swift-casting']
    },

    // New unlocks
    {
        id: 'unlock-bestiary', name: 'The Bestiary', description: 'Record knowledge of defeated foes.',
        manaCost: 35, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'bestiary' }, prerequisites: ['unlock-combat']
    },
    {
        id: 'unlock-chronicle', name: 'Battle Chronicle', description: 'A detailed log of combat.',
        manaCost: 30, unlocked: false, researched: false,
        unlockEffect: { type: 'window', windowId: 'chronicle' }, prerequisites: ['unlock-combat']
    },
    {
        id: 'auto-meditate', name: 'Focused Mind', description: 'Unlock automatic meditation.',
        manaCost: 50, unlocked: false, researched: false,
        unlockEffect: { type: 'idle', idleId: 'autoMeditate' }, prerequisites: ['basic-meditation']
    },
    {
        id: 'auto-combat', name: 'Battle Instinct', description: 'Unlock automatic combat.',
        manaCost: 60, unlocked: false, researched: false,
        unlockEffect: { type: 'idle', idleId: 'autoCombat' }, prerequisites: ['unlock-combat']
    },

    // Discoveries window
    {
        id: 'unlock-discoveries', name: 'Arcane Archives', description: 'Open the discoveries window to track progress.',
        manaCost: 25, unlocked: true, researched: false,
        unlockEffect: { type: 'window', windowId: 'discoveries' }, prerequisites: []
    },

    // Advanced stats research
    {
        id: 'wisdom-2', name: 'Enlightenment', description: 'Deep study of the arcane. (+2 WIS)',
        manaCost: 80, unlocked: false, researched: false,
        unlockEffect: { type: 'stat', stat: 'WIS', value: 2 }, prerequisites: ['basic-meditation']
    },
    {
        id: 'arcane-focus', name: 'Arcane Focus', description: 'Sharpen your magical precision. (+2 ARC)',
        manaCost: 70, unlocked: false, researched: false,
        unlockEffect: { type: 'stat', stat: 'ARC', value: 2 }, prerequisites: ['unlock-combat']
    },
    {
        id: 'iron-will', name: 'Iron Will', description: 'Strengthen your mental barriers. (+2 BAR)',
        manaCost: 65, unlocked: false, researched: false,
        unlockEffect: { type: 'stat', stat: 'BAR', value: 2 }, prerequisites: ['fortification']
    },
    {
        id: 'vitality-training', name: 'Vitality Training', description: 'Train your body to heal. (+2 VIT)',
        manaCost: 55, unlocked: false, researched: false,
        unlockEffect: { type: 'stat', stat: 'VIT', value: 2 }, prerequisites: ['restoration']
    },

    // Advanced mana capacity
    {
        id: 'mana-capacity-4', name: 'Expanded Mind IV', description: 'Increase max mana to 125.',
        manaCost: 80, unlocked: false, researched: false,
        unlockEffect: { type: 'maxMana', value: 25 }, prerequisites: ['mana-capacity-3']
    },
    {
        id: 'mana-capacity-5', name: 'Expanded Mind V', description: 'Increase max mana to 150.',
        manaCost: 100, unlocked: false, researched: false,
        unlockEffect: { type: 'maxMana', value: 25 }, prerequisites: ['mana-capacity-4']
    },

    // More rune unlocks
    {
        id: 'pyromancy-2', name: 'Pyromancy II', description: 'Unlock the Inferno rune.',
        manaCost: 70, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'inferno' }, prerequisites: ['pyromancy']
    },
    {
        id: 'cryomancy-2', name: 'Cryomancy II', description: 'Unlock the Frigus rune.',
        manaCost: 70, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'frigus' }, prerequisites: ['cryomancy']
    },
    {
        id: 'electromancy-2', name: 'Electromancy II', description: 'Unlock the Catena rune.',
        manaCost: 90, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'catena' }, prerequisites: ['electromancy']
    },
    {
        id: 'geomancy-2', name: 'Geomancy II', description: 'Unlock the Murus rune.',
        manaCost: 90, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'murus' }, prerequisites: ['geomancy']
    },
    {
        id: 'restoration-2', name: 'Restoration II', description: 'Unlock the Sana rune.',
        manaCost: 80, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'sana' }, prerequisites: ['restoration']
    },
    {
        id: 'shadow-magic', name: 'Shadow Magic', description: 'Unlock the Umbra rune.',
        manaCost: 85, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'umbra' }, prerequisites: ['necromancy']
    },
    {
        id: 'arcane-power', name: 'Arcane Power', description: 'Unlock the Potens rune.',
        manaCost: 95, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'potens' }, prerequisites: ['swift-casting']
    },
    {
        id: 'poison-arts', name: 'Poison Arts', description: 'Unlock the Venenum rune.',
        manaCost: 75, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'venenum' }, prerequisites: ['necromancy']
    },
    {
        id: 'fortune-magic', name: 'Fortune Magic', description: 'Unlock the Fortuna rune.',
        manaCost: 100, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'fortuna' }, prerequisites: ['arcane-power']
    },
    {
        id: 'piercing-arts', name: 'Piercing Arts', description: 'Unlock the Perforare rune.',
        manaCost: 110, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'perforare' }, prerequisites: ['arcane-focus']
    },
    {
        id: 'execution-magic', name: 'Execution Magic', description: 'Unlock the Occidere rune.',
        manaCost: 120, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'occidere' }, prerequisites: ['blood-magic']
    },
    {
        id: 'temporal-arts', name: 'Temporal Arts', description: 'Unlock the Stupor rune.',
        manaCost: 130, unlocked: false, researched: false,
        unlockEffect: { type: 'rune', runeId: 'stupor' }, prerequisites: ['fortune-magic']
    },
];
