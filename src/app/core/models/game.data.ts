import { Rune, ResearchNode, Enemy, Spell, Upgrade } from './game.interfaces';
import { RESOURCE_NAMES, INITIAL_CRAFTING_RESOURCES } from './resources.data';

// Re-export for convenience
export { ALL_RESOURCES, RESOURCE_NAMES, INITIAL_CRAFTING_RESOURCES, RESOURCE_DEFS, getResourcesByCategory } from './resources.data';

// =============================================================================
// ASCII ART
// =============================================================================

export const ASCII_ART = {
    player: `  /\\
 /  \\
|O  O|
 \\__/`,
    goblin: ` ,
/&\\
(o o)`,
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
