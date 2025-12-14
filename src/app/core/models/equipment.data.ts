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

    // =========================================================================
    // NEW EQUIPMENT - Using previously unused resources
    // =========================================================================

    // HEAD - Higher tiers
    crown_of_ages: {
        id: 'crown_of_ages',
        name: 'Crown of Ages',
        description: 'A crown that grants timeless wisdom.',
        slot: 'head',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 5 },
            { type: 'maxMana', value: 50 },
            { type: 'stat', stat: 'ARC', value: 3 },
        ],
        rarity: 'primal',
    },
    helm_of_the_worldtree: {
        id: 'helm_of_the_worldtree',
        name: 'Helm of the Worldtree',
        description: 'Woven from leaves of the great tree.',
        slot: 'head',
        bonuses: [
            { type: 'stat', stat: 'VIT', value: 4 },
            { type: 'maxHP', value: 50 },
            { type: 'stat', stat: 'WIS', value: 2 },
        ],
        rarity: 'primal',
    },

    // FACE - Higher tiers
    mask_of_shadows: {
        id: 'mask_of_shadows',
        name: 'Mask of Shadows',
        description: 'A dark mask that hides the wearer.',
        slot: 'face',
        bonuses: [
            { type: 'damagePercent', value: 15 },
            { type: 'critChance', value: 5 },
        ],
        rarity: 'primal',
    },
    divine_visage: {
        id: 'divine_visage',
        name: 'Divine Visage',
        description: 'A holy mask blessed by the divine.',
        slot: 'face',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 3 },
            { type: 'stat', stat: 'VIT', value: 3 },
            { type: 'maxHP', value: 25 },
        ],
        rarity: 'primal',
    },

    // ACCESSORY - Higher tiers
    pendant_of_stars: {
        id: 'pendant_of_stars',
        name: 'Pendant of Stars',
        description: 'Captures the light of distant stars.',
        slot: 'accessory',
        bonuses: [
            { type: 'stat', stat: 'ARC', value: 3 },
            { type: 'damagePercent', value: 8 },
            { type: 'maxMana', value: 20 },
        ],
        rarity: 'primal',
    },
    philosophers_amulet: {
        id: 'philosophers_amulet',
        name: "Philosopher's Amulet",
        description: 'Contains a fragment of the legendary stone.',
        slot: 'accessory',
        bonuses: [
            { type: 'lootChance', value: 15 },
            { type: 'lootQuantity', value: 15 },
            { type: 'stat', stat: 'LCK', value: 5 },
        ],
        rarity: 'epochal',
    },

    // BODY - Higher tiers
    robes_of_the_void: {
        id: 'robes_of_the_void',
        name: 'Robes of the Void',
        description: 'Woven from pure nothingness.',
        slot: 'body',
        bonuses: [
            { type: 'damagePercent', value: 25 },
            { type: 'stat', stat: 'ARC', value: 4 },
            { type: 'maxMana', value: 40 },
        ],
        rarity: 'primal',
    },
    dragon_mail: {
        id: 'dragon_mail',
        name: 'Dragon Mail',
        description: 'Armor forged from dragon scales.',
        slot: 'body',
        bonuses: [
            { type: 'stat', stat: 'BAR', value: 5 },
            { type: 'maxHP', value: 75 },
            { type: 'stat', stat: 'VIT', value: 3 },
        ],
        rarity: 'primal',
    },
    genesis_vestments: {
        id: 'genesis_vestments',
        name: 'Genesis Vestments',
        description: 'Robes woven at the dawn of creation.',
        slot: 'body',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 5 },
            { type: 'stat', stat: 'ARC', value: 5 },
            { type: 'maxMana', value: 60 },
            { type: 'maxHP', value: 50 },
        ],
        rarity: 'epochal',
    },

    // LEFT HAND - Higher tiers
    grimoire_of_infinity: {
        id: 'grimoire_of_infinity',
        name: 'Grimoire of Infinity',
        description: 'A tome with infinite pages of knowledge.',
        slot: 'handL',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 5 },
            { type: 'stat', stat: 'ARC', value: 4 },
            { type: 'maxMana', value: 50 },
        ],
        rarity: 'epochal',
    },
    shield_of_the_titans: {
        id: 'shield_of_the_titans',
        name: 'Shield of the Titans',
        description: 'Forged from the bones of giants.',
        slot: 'handL',
        bonuses: [
            { type: 'stat', stat: 'BAR', value: 6 },
            { type: 'maxHP', value: 60 },
            { type: 'stat', stat: 'VIT', value: 2 },
        ],
        rarity: 'primal',
    },

    // RIGHT HAND - Higher tiers
    staff_of_creation: {
        id: 'staff_of_creation',
        name: 'Staff of Creation',
        description: 'A staff that can shape reality itself.',
        slot: 'handR',
        bonuses: [
            { type: 'damagePercent', value: 30 },
            { type: 'critDamage', value: 25 },
            { type: 'stat', stat: 'ARC', value: 4 },
        ],
        rarity: 'epochal',
    },
    wand_of_dreams: {
        id: 'wand_of_dreams',
        name: 'Wand of Dreams',
        description: 'A wand carved from dreamwood.',
        slot: 'handR',
        bonuses: [
            { type: 'damagePercent', value: 12 },
            { type: 'stat', stat: 'WIS', value: 3 },
            { type: 'critChance', value: 4 },
        ],
        rarity: 'primal',
    },
    dragon_fang_dagger: {
        id: 'dragon_fang_dagger',
        name: 'Dragon Fang Dagger',
        description: 'A blade made from a dragon tooth.',
        slot: 'handR',
        bonuses: [
            { type: 'critChance', value: 8 },
            { type: 'critDamage', value: 20 },
            { type: 'damagePercent', value: 10 },
        ],
        rarity: 'primal',
    },

    // RELIC - Higher tiers
    eye_of_ages_relic: {
        id: 'eye_of_ages_relic',
        name: 'Eye of Ages',
        description: 'An ancient eye that sees through time.',
        slot: 'relic',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 4 },
            { type: 'stat', stat: 'LCK', value: 4 },
            { type: 'critChance', value: 5 },
        ],
        rarity: 'primal',
    },
    heart_of_magic_relic: {
        id: 'heart_of_magic_relic',
        name: 'Heart of Magic',
        description: 'The legendary source of all magic.',
        slot: 'relic',
        bonuses: [
            { type: 'stat', stat: 'ARC', value: 6 },
            { type: 'maxMana', value: 75 },
            { type: 'damagePercent', value: 15 },
        ],
        rarity: 'epochal',
    },
    crown_fragment_relic: {
        id: 'crown_fragment_relic',
        name: 'Crown Fragment',
        description: 'A piece of a divine crown.',
        slot: 'relic',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 3 },
            { type: 'stat', stat: 'ARC', value: 3 },
            { type: 'stat', stat: 'VIT', value: 3 },
            { type: 'stat', stat: 'BAR', value: 3 },
        ],
        rarity: 'primal',
    },
    world_seed_relic: {
        id: 'world_seed_relic',
        name: 'World Seed',
        description: 'A seed that could create entire worlds.',
        slot: 'relic',
        bonuses: [
            { type: 'stat', stat: 'WIS', value: 5 },
            { type: 'stat', stat: 'ARC', value: 5 },
            { type: 'maxHP', value: 50 },
            { type: 'maxMana', value: 50 },
            { type: 'damagePercent', value: 10 },
        ],
        rarity: 'epochal',
    },

    // =========================================================================
    // RESOURCE-USE EQUIPMENT - Using underutilized resources
    // =========================================================================
    goblin_talisman: {
        id: 'goblin_talisman',
        name: 'Goblin Talisman',
        description: 'A crude talisman made from goblin remains.',
        slot: 'accessory',
        bonuses: [
            { type: 'stat', stat: 'LCK', value: 3 },
            { type: 'lootChance', value: 8 },
        ],
        rarity: 'elevated',
    },
    temporal_bracers: {
        id: 'temporal_bracers',
        name: 'Temporal Bracers',
        description: 'Bracers infused with the sands of time.',
        slot: 'handL',
        bonuses: [
            { type: 'stat', stat: 'SPD', value: 3 },
            { type: 'stat', stat: 'LCK', value: 2 },
        ],
        rarity: 'primal',
    },
    void_prism_pendant: {
        id: 'void_prism_pendant',
        name: 'Void Prism Pendant',
        description: 'A pendant that refracts reality itself.',
        slot: 'accessory',
        bonuses: [
            { type: 'damagePercent', value: 18 },
            { type: 'critDamage', value: 12 },
        ],
        rarity: 'primal',
    },
    mana_conduit: {
        id: 'mana_conduit',
        name: 'Mana Conduit',
        description: 'A focus that amplifies magical energy.',
        slot: 'handL',
        bonuses: [
            { type: 'maxMana', value: 40 },
            { type: 'stat', stat: 'WIS', value: 2 },
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

    // =========================================================================
    // NEW RECIPES - Using previously unused resources
    // =========================================================================

    // HEAD - Higher tiers
    {
        id: 'recipe_crown_of_ages',
        resultItem: EQUIPMENT_ITEMS['crown_of_ages'],
        cost: [
            { resourceId: 'eye_of_ages', amount: 1 },
            { resourceId: 'gold_ore', amount: 10 },
            { resourceId: 'moonstone', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_helm_of_the_worldtree',
        resultItem: EQUIPMENT_ITEMS['helm_of_the_worldtree'],
        cost: [
            { resourceId: 'worldtree_leaf', amount: 3 },
            { resourceId: 'voidbloom', amount: 1 },
            { resourceId: 'dragonlily', amount: 5 },
        ],
        unlocked: true,
    },

    // FACE - Higher tiers
    {
        id: 'recipe_mask_of_shadows',
        resultItem: EQUIPMENT_ITEMS['mask_of_shadows'],
        cost: [
            { resourceId: 'shadowcap', amount: 8 },
            { resourceId: 'onyx', amount: 3 },
            { resourceId: 'obsidian', amount: 2 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_divine_visage',
        resultItem: EQUIPMENT_ITEMS['divine_visage'],
        cost: [
            { resourceId: 'holy_essence', amount: 8 },
            { resourceId: 'angel_feather', amount: 2 },
            { resourceId: 'sunpetal', amount: 5 },
        ],
        unlocked: true,
    },

    // ACCESSORY - Higher tiers
    {
        id: 'recipe_pendant_of_stars',
        resultItem: EQUIPMENT_ITEMS['pendant_of_stars'],
        cost: [
            { resourceId: 'starlight_shard', amount: 5 },
            { resourceId: 'starmetal_ore', amount: 3 },
            { resourceId: 'moonstone_powder', amount: 8 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_philosophers_amulet',
        resultItem: EQUIPMENT_ITEMS['philosophers_amulet'],
        cost: [
            { resourceId: 'philosophers_stone', amount: 1 },
            { resourceId: 'gold_ore', amount: 15 },
            { resourceId: 'amethyst', amount: 5 },
        ],
        unlocked: true,
    },

    // BODY - Higher tiers
    {
        id: 'recipe_robes_of_the_void',
        resultItem: EQUIPMENT_ITEMS['robes_of_the_void'],
        cost: [
            { resourceId: 'void_crystal', amount: 1 },
            { resourceId: 'voidbloom', amount: 2 },
            { resourceId: 'voidsteel_ore', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_dragon_mail',
        resultItem: EQUIPMENT_ITEMS['dragon_mail'],
        cost: [
            { resourceId: 'dragon_scale', amount: 5 },
            { resourceId: 'orichalcum_ore', amount: 3 },
            { resourceId: 'adamantine_ore', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_genesis_vestments',
        resultItem: EQUIPMENT_ITEMS['genesis_vestments'],
        cost: [
            { resourceId: 'genesis_spark', amount: 1 },
            { resourceId: 'primordial_ore', amount: 2 },
            { resourceId: 'infinity_loop', amount: 1 },
        ],
        unlocked: true,
    },

    // LEFT HAND - Higher tiers
    {
        id: 'recipe_grimoire_of_infinity',
        resultItem: EQUIPMENT_ITEMS['grimoire_of_infinity'],
        cost: [
            { resourceId: 'infinity_loop', amount: 1 },
            { resourceId: 'enchanted_ink', amount: 10 },
            { resourceId: 'spell_parchment', amount: 20 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_shield_of_the_titans',
        resultItem: EQUIPMENT_ITEMS['shield_of_the_titans'],
        cost: [
            { resourceId: 'titan_bone', amount: 2 },
            { resourceId: 'titan_marrow', amount: 1 },
            { resourceId: 'primordial_ore', amount: 2 },
        ],
        unlocked: true,
    },

    // RIGHT HAND - Higher tiers
    {
        id: 'recipe_staff_of_creation',
        resultItem: EQUIPMENT_ITEMS['staff_of_creation'],
        cost: [
            { resourceId: 'world_seed', amount: 1 },
            { resourceId: 'genesis_spark', amount: 1 },
            { resourceId: 'primordial_glyph', amount: 2 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_wand_of_dreams',
        resultItem: EQUIPMENT_ITEMS['wand_of_dreams'],
        cost: [
            { resourceId: 'dreamweed', amount: 10 },
            { resourceId: 'ghostcap', amount: 5 },
            { resourceId: 'ether_glass', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_dragon_fang_dagger',
        resultItem: EQUIPMENT_ITEMS['dragon_fang_dagger'],
        cost: [
            { resourceId: 'dragon_fang', amount: 3 },
            { resourceId: 'dragon_blood', amount: 2 },
            { resourceId: 'bloodstone', amount: 2 },
        ],
        unlocked: true,
    },

    // RELIC - Higher tiers
    {
        id: 'recipe_eye_of_ages_relic',
        resultItem: EQUIPMENT_ITEMS['eye_of_ages_relic'],
        cost: [
            { resourceId: 'eye_of_ages', amount: 1 },
            { resourceId: 'elder_eye', amount: 2 },
            { resourceId: 'temporal_sand', amount: 5 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_heart_of_magic_relic',
        resultItem: EQUIPMENT_ITEMS['heart_of_magic_relic'],
        cost: [
            { resourceId: 'heart_of_magic', amount: 1 },
            { resourceId: 'elemental_core', amount: 5 },
            { resourceId: 'dimensional_shard', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_crown_fragment_relic',
        resultItem: EQUIPMENT_ITEMS['crown_fragment_relic'],
        cost: [
            { resourceId: 'crown_fragment', amount: 1 },
            { resourceId: 'divine_mark', amount: 1 },
            { resourceId: 'holy_essence', amount: 10 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_world_seed_relic',
        resultItem: EQUIPMENT_ITEMS['world_seed_relic'],
        cost: [
            { resourceId: 'world_seed', amount: 1 },
            { resourceId: 'voidbloom', amount: 2 },
            { resourceId: 'elder_rune', amount: 1 },
        ],
        unlocked: true,
    },

    // RESOURCE-USE EQUIPMENT RECIPES
    {
        id: 'recipe_goblin_talisman',
        resultItem: EQUIPMENT_ITEMS['goblin_talisman'],
        cost: [
            { resourceId: 'goblin_skull', amount: 1 },
            { resourceId: 'goblin_tooth', amount: 10 },
            { resourceId: 'binding_thread', amount: 3 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_temporal_bracers',
        resultItem: EQUIPMENT_ITEMS['temporal_bracers'],
        cost: [
            { resourceId: 'temporal_sand', amount: 3 },
            { resourceId: 'lightning_essence', amount: 5 },
            { resourceId: 'mithril_ore', amount: 2 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_void_prism_pendant',
        resultItem: EQUIPMENT_ITEMS['void_prism_pendant'],
        cost: [
            { resourceId: 'void_prism', amount: 1 },
            { resourceId: 'void_essence', amount: 8 },
            { resourceId: 'diamond', amount: 1 },
        ],
        unlocked: true,
    },
    {
        id: 'recipe_mana_conduit',
        resultItem: EQUIPMENT_ITEMS['mana_conduit'],
        cost: [
            { resourceId: 'mana_battery', amount: 2 },
            { resourceId: 'mana_crystal', amount: 10 },
            { resourceId: 'arcane_essence', amount: 8 },
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
