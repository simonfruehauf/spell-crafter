import { EquipmentItem, EquipmentRecipe, EquippedItems } from './game.interfaces';

// =============================================================================
// EQUIPMENT ITEMS
// =============================================================================

export const EQUIPMENT_ITEMS: Record<string, EquipmentItem> = {
    // HEAD SLOT
    apprentice_hat: {
        id: 'apprentice_hat',
        name: 'Apprentice Hat',
        description: 'A simple pointed hat worn by novice mages.',
        slot: 'head',
        bonuses: [{ type: 'maxMana', value: 5 }],
        rarity: 'mundane',
    },
    scholars_cap: {
        id: 'scholars_cap',
        name: "Scholar's Cap",
        description: 'A well-worn cap that aids in concentration.',
        slot: 'head',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 1 },
            { type: 'maxMana', value: 10 },
        ],
        rarity: 'elevated',
    },
    circlet_of_focus: {
        id: 'circlet_of_focus',
        name: 'Circlet of Focus',
        description: 'An enchanted circlet that sharpens the mind.',
        slot: 'head',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 2 },
            { type: 'stat', stat: 'ARC', value: 1 },
            { type: 'maxMana', value: 15 },
        ],
        rarity: 'exceptional',
    },

    // FACE SLOT
    reading_glasses: {
        id: 'reading_glasses',
        name: 'Reading Glasses',
        description: 'Simple spectacles for scholarly pursuits.',
        slot: 'face',
        bonuses: [{ type: 'stat', stat: 'WIS', value: 1 }],
        rarity: 'mundane',
    },
    arcane_monocle: {
        id: 'arcane_monocle',
        name: 'Arcane Monocle',
        description: 'A monocle infused with magical sight.',
        slot: 'face',
        bonuses: [{ type: 'damagePercent', value: 5 }],
        rarity: 'elevated',
    },
    eyes_of_the_void: {
        id: 'eyes_of_the_void',
        name: 'Eyes of the Void',
        description: 'Dark lenses that peer beyond reality.',
        slot: 'face',
        bonuses: [
            { type: 'damagePercent', value: 10 },
            { type: 'critChance', value: 3 },
        ],
        rarity: 'exceptional',
    },

    // ACCESSORY SLOT
    lucky_charm: {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        description: 'A small trinket that brings fortune.',
        slot: 'accessory',
        bonuses: [{ type: 'lootChance', value: 5 }],
        rarity: 'mundane',
    },
    swift_pendant: {
        id: 'swift_pendant',
        name: 'Swift Pendant',
        description: 'A pendant that quickens reflexes.',
        slot: 'accessory',
        bonuses: [{ type: 'stat', stat: 'SPD', value: 2 }],
        rarity: 'elevated',
    },
    amulet_of_fortune: {
        id: 'amulet_of_fortune',
        name: 'Amulet of Fortune',
        description: 'An amulet blessed by fate itself.',
        slot: 'accessory',
        bonuses: [
            { type: 'lootChance', value: 8 },
            { type: 'lootQuantity', value: 5 },
            { type: 'stat', stat: 'LCK', value: 2 },
        ],
        rarity: 'exceptional',
    },

    // BODY SLOT
    robes_of_focus: {
        id: 'robes_of_focus',
        name: 'Robes of Focus',
        description: 'Simple robes that aid meditation.',
        slot: 'body',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 1 },
            { type: 'maxHP', value: 10 },
        ],
        rarity: 'mundane',
    },
    battle_vestments: {
        id: 'battle_vestments',
        name: 'Battle Vestments',
        description: 'Reinforced robes for combat mages.',
        slot: 'body',
        bonuses: [
            { type: 'stat', stat: 'BAR', value: 2 },
            { type: 'maxHP', value: 20 },
        ],
        rarity: 'elevated',
    },
    archmage_robes: {
        id: 'archmage_robes',
        name: 'Archmage Robes',
        description: 'Magnificent robes worn by masters.',
        slot: 'body',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 2 },
            { type: 'stat', stat: 'ARC', value: 2 },
            { type: 'maxHP', value: 25 },
            { type: 'maxMana', value: 20 },
        ],
        rarity: 'exceptional',
    },

    // LEFT HAND SLOT
    arcane_focus: {
        id: 'arcane_focus',
        name: 'Arcane Focus',
        description: 'A crystal that channels magical energy.',
        slot: 'handL',
        bonuses: [{ type: 'stat', stat: 'ARC', value: 2 }],
        rarity: 'mundane',
    },
    warding_buckler: {
        id: 'warding_buckler',
        name: 'Warding Buckler',
        description: 'A small shield enchanted with protection.',
        slot: 'handL',
        bonuses: [
            { type: 'stat', stat: 'BAR', value: 3 },
            { type: 'maxHP', value: 15 },
        ],
        rarity: 'elevated',
    },
    tome_of_knowledge: {
        id: 'tome_of_knowledge',
        name: 'Tome of Knowledge',
        description: 'An ancient book radiating wisdom.',
        slot: 'handL',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 3 },
            { type: 'stat', stat: 'ARC', value: 2 },
            { type: 'maxMana', value: 25 },
        ],
        rarity: 'exceptional',
    },

    // RIGHT HAND SLOT
    staff_of_power: {
        id: 'staff_of_power',
        name: 'Staff of Power',
        description: 'A staff crackling with energy.',
        slot: 'handR',
        bonuses: [{ type: 'damagePercent', value: 10 }],
        rarity: 'mundane',
    },
    healing_scepter: {
        id: 'healing_scepter',
        name: 'Healing Scepter',
        description: 'A scepter blessed with restorative power.',
        slot: 'handR',
        bonuses: [
            { type: 'stat', stat: 'VIT', value: 2 },
            { type: 'maxHP', value: 15 },
        ],
        rarity: 'elevated',
    },
    staff_of_annihilation: {
        id: 'staff_of_annihilation',
        name: 'Staff of Annihilation',
        description: 'A dread staff of devastating power.',
        slot: 'handR',
        bonuses: [
            { type: 'damagePercent', value: 20 },
            { type: 'critDamage', value: 15 },
        ],
        rarity: 'exceptional',
    },

    // RELIC SLOT
    orb_of_insight: {
        id: 'orb_of_insight',
        name: 'Orb of Insight',
        description: 'A crystal sphere revealing hidden treasures.',
        slot: 'relic',
        bonuses: [{ type: 'lootQuantity', value: 10 }],
        rarity: 'mundane',
    },
    void_crystal: {
        id: 'void_crystal',
        name: 'Void Crystal',
        description: 'A dark crystal of immense but dangerous power.',
        slot: 'relic',
        bonuses: [
            { type: 'damagePercent', value: 15 },
            { type: 'maxHP', value: -10 },
        ],
        rarity: 'elevated',
    },
    heart_of_the_arcane: {
        id: 'heart_of_the_arcane',
        name: 'Heart of the Arcane',
        description: 'A pulsing core of pure magical essence.',
        slot: 'relic',
        bonuses: [
            { type: 'stat', stat: 'ARC', value: 3 },
            { type: 'stat', stat: 'WIS', value: 2 },
            { type: 'maxMana', value: 30 },
            { type: 'damagePercent', value: 10 },
        ],
        rarity: 'exceptional',
    },
};

// =============================================================================
// EQUIPMENT RECIPES
// =============================================================================

export const INITIAL_EQUIPMENT_RECIPES: EquipmentRecipe[] = [
    // HEAD
    {
        id: 'recipe_apprentice_hat',
        resultItem: EQUIPMENT_ITEMS['apprentice_hat'],
        cost: [{ resourceId: 'shadow_thread', amount: 3 }],
        unlocked: true,
    },
    {
        id: 'recipe_scholars_cap',
        resultItem: EQUIPMENT_ITEMS['scholars_cap'],
        cost: [
            { resourceId: 'shadow_thread', amount: 5 },
            { resourceId: 'mana_crystal', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_circlet_of_focus',
        resultItem: EQUIPMENT_ITEMS['circlet_of_focus'],
        cost: [
            { resourceId: 'arcane_essence', amount: 10 },
            { resourceId: 'mithril_ore', amount: 3 },
            { resourceId: 'sapphire', amount: 2 },
        ],
        unlocked: true,
    },

    // FACE
    {
        id: 'recipe_reading_glasses',
        resultItem: EQUIPMENT_ITEMS['reading_glasses'],
        cost: [{ resourceId: 'iron_ore', amount: 2 }],
        unlocked: true,
    },
    {
        id: 'recipe_arcane_monocle',
        resultItem: EQUIPMENT_ITEMS['arcane_monocle'],
        cost: [
            { resourceId: 'iron_ore', amount: 3 },
            { resourceId: 'arcane_essence', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_eyes_of_the_void',
        resultItem: EQUIPMENT_ITEMS['eyes_of_the_void'],
        cost: [
            { resourceId: 'void_essence', amount: 10 },
            { resourceId: 'dark_essence', amount: 8 },
            { resourceId: 'soulstone', amount: 1 },
        ],
        unlocked: true,
    },

    // ACCESSORY
    {
        id: 'recipe_lucky_charm',
        resultItem: EQUIPMENT_ITEMS['lucky_charm'],
        cost: [
            { resourceId: 'opal', amount: 1 },
            { resourceId: 'binding_thread', amount: 2 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_swift_pendant',
        resultItem: EQUIPMENT_ITEMS['swift_pendant'],
        cost: [
            { resourceId: 'wind_essence', amount: 5 },
            { resourceId: 'silver_ore', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_amulet_of_fortune',
        resultItem: EQUIPMENT_ITEMS['amulet_of_fortune'],
        cost: [
            { resourceId: 'opal', amount: 3 },
            { resourceId: 'emerald', amount: 2 },
            { resourceId: 'arcane_token', amount: 5 },
        ],
        unlocked: true,
    },

    // BODY
    {
        id: 'recipe_robes_of_focus',
        resultItem: EQUIPMENT_ITEMS['robes_of_focus'],
        cost: [
            { resourceId: 'shadow_thread', amount: 5 },
            { resourceId: 'healing_moss', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_battle_vestments',
        resultItem: EQUIPMENT_ITEMS['battle_vestments'],
        cost: [
            { resourceId: 'shadow_thread', amount: 8 },
            { resourceId: 'iron_ore', amount: 5 },
            { resourceId: 'earth_essence', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_archmage_robes',
        resultItem: EQUIPMENT_ITEMS['archmage_robes'],
        cost: [
            { resourceId: 'phoenix_feather', amount: 2 },
            { resourceId: 'arcane_essence', amount: 15 },
            { resourceId: 'master_rune', amount: 1 },
        ],
        unlocked: true,
    },

    // LEFT HAND
    {
        id: 'recipe_arcane_focus',
        resultItem: EQUIPMENT_ITEMS['arcane_focus'],
        cost: [
            { resourceId: 'mana_crystal', amount: 5 },
            { resourceId: 'arcane_essence', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_warding_buckler',
        resultItem: EQUIPMENT_ITEMS['warding_buckler'],
        cost: [
            { resourceId: 'iron_ore', amount: 8 },
            { resourceId: 'earth_essence', amount: 5 },
            { resourceId: 'runed_stone', amount: 2 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_tome_of_knowledge',
        resultItem: EQUIPMENT_ITEMS['tome_of_knowledge'],
        cost: [
            { resourceId: 'spell_parchment', amount: 10 },
            { resourceId: 'arcane_essence', amount: 12 },
            { resourceId: 'elder_eye', amount: 1 },
        ],
        unlocked: true,
    },

    // RIGHT HAND
    {
        id: 'recipe_staff_of_power',
        resultItem: EQUIPMENT_ITEMS['staff_of_power'],
        cost: [
            { resourceId: 'runestone', amount: 3 },
            { resourceId: 'fire_essence', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_healing_scepter',
        resultItem: EQUIPMENT_ITEMS['healing_scepter'],
        cost: [
            { resourceId: 'life_essence', amount: 8 },
            { resourceId: 'healing_moss', amount: 5 },
            { resourceId: 'silver_ore', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_staff_of_annihilation',
        resultItem: EQUIPMENT_ITEMS['staff_of_annihilation'],
        cost: [
            { resourceId: 'void_essence', amount: 12 },
            { resourceId: 'dragon_fang', amount: 2 },
            { resourceId: 'demon_claw', amount: 3 },
        ],
        unlocked: true,
    },

    // RELIC
    {
        id: 'recipe_orb_of_insight',
        resultItem: EQUIPMENT_ITEMS['orb_of_insight'],
        cost: [
            { resourceId: 'mana_crystal', amount: 8 },
            { resourceId: 'arcane_essence', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_void_crystal',
        resultItem: EQUIPMENT_ITEMS['void_crystal'],
        cost: [
            { resourceId: 'void_essence', amount: 8 },
            { resourceId: 'soul_shard', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_heart_of_the_arcane',
        resultItem: EQUIPMENT_ITEMS['heart_of_the_arcane'],
        cost: [
            { resourceId: 'primal_essence', amount: 1 },
            { resourceId: 'arcane_essence', amount: 20 },
            { resourceId: 'diamond', amount: 2 },
        ],
        unlocked: true,
    },
];

// =============================================================================
// INITIAL STATE
// =============================================================================

export const INITIAL_EQUIPPED_ITEMS: EquippedItems = {
    head: null,
    face: null,
    accessory: null,
    body: null,
    handL: null,
    handR: null,
    relic: null,
};

// =============================================================================
// SLOT DISPLAY NAMES
// =============================================================================

export const EQUIPMENT_SLOT_NAMES: Record<string, string> = {
    head: 'Head',
    face: 'Face',
    accessory: 'Accessory',
    body: 'Body',
    handL: 'Left Hand',
    handR: 'Right Hand',
    relic: 'Relic',
};

export const EQUIPMENT_BONUS_NAMES: Record<string, string> = {
    stat: '',
    maxMana: 'Max Mana',
    maxHP: 'Max HP',
    damagePercent: 'Damage',
    critChance: 'Crit Chance',
    critDamage: 'Crit Damage',
    lootChance: 'Loot Chance',
    lootQuantity: 'Loot Quantity',
};
