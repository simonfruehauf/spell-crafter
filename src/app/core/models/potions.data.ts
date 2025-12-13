import { Potion } from './game.interfaces';

// =============================================================================
// POTIONS - Consumable elixirs crafted from creature parts and mana
// =============================================================================

export const POTIONS: Potion[] = [
    // =========================================================================
    // RESTORATION ELIXIRS
    // =========================================================================
    {
        id: 'crimson_draught',
        name: 'Crimson Draught',
        description: 'A basic restorative. Heals 5 HP + 10% max HP.',
        effects: [
            { type: 'healFlat', value: 5 },
            { type: 'healPercent', value: 10 }
        ],
        craftCost: [{ resourceId: 'goblin_tooth', amount: 1 }],
        manaCost: 15,
        symbol: '[+]'
    },
    {
        id: 'vitae_tonic',
        name: 'Vitae Tonic',
        description: 'Concentrated life essence. Heals 15 HP + 15% max HP.',
        effects: [
            { type: 'healFlat', value: 15 },
            { type: 'healPercent', value: 15 }
        ],
        craftCost: [{ resourceId: 'healing_moss', amount: 3 }, { resourceId: 'life_essence', amount: 1 }],
        manaCost: 25,
        symbol: '[++]'
    },
    {
        id: 'phoenix_tears',
        name: 'Phoenix Tears',
        description: 'Legendary healing. Restores 30 HP + 25% max HP.',
        effects: [
            { type: 'healFlat', value: 30 },
            { type: 'healPercent', value: 25 }
        ],
        craftCost: [{ resourceId: 'phoenix_feather', amount: 1 }, { resourceId: 'life_essence', amount: 3 }],
        manaCost: 40,
        symbol: '[+++]'
    },
    {
        id: 'sanguine_bloom',
        name: 'Sanguine Bloom',
        description: 'Heals 3 HP per turn for 5 turns.',
        effects: [
            { type: 'regen', value: 3, duration: 5 }
        ],
        craftCost: [{ resourceId: 'fireweed', amount: 2 }, { resourceId: 'healing_moss', amount: 2 }],
        manaCost: 18,
        symbol: '[*+]'
    },

    // =========================================================================
    // MANA ELIXIRS
    // =========================================================================
    {
        id: 'aether_sip',
        name: 'Aether Sip',
        description: 'A quick mana boost. Restores 12% max mana.',
        effects: [
            { type: 'manaPercent', value: 12 }
        ],
        craftCost: [{ resourceId: 'skeleton_bone', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 10,
        symbol: '[~]'
    },
    {
        id: 'starlight_philter',
        name: 'Starlight Philter',
        description: 'Bottled starlight. Restores 25% max mana.',
        effects: [
            { type: 'manaPercent', value: 25 }
        ],
        craftCost: [{ resourceId: 'mana_crystal', amount: 2 }, { resourceId: 'arcane_essence', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 15,
        symbol: '[*~]'
    },
    {
        id: 'voidwell_essence',
        name: 'Voidwell Essence',
        description: 'Draws mana from the void. Restores 50% max mana.',
        effects: [
            { type: 'manaPercent', value: 50 }
        ],
        craftCost: [{ resourceId: 'mana_crystal', amount: 5 }, { resourceId: 'void_essence', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 20,
        symbol: '[<>]'
    },

    // =========================================================================
    // COMBAT ENHANCERS
    // =========================================================================
    {
        id: 'dragons_bile',
        name: "Dragon's Bile",
        description: 'Burns with inner fire. +3 ARC for 5 turns.',
        effects: [
            { type: 'buffStat', value: 3, duration: 5, stat: 'ARC' }
        ],
        craftCost: [{ resourceId: 'imp_horn', amount: 2 }, { resourceId: 'fire_essence', amount: 2 }],
        manaCost: 20,
        symbol: '[^]'
    },
    {
        id: 'mindshatter_brew',
        name: 'Mindshatter Brew',
        description: 'Expands mental capacity. +3 WIS for 5 turns.',
        effects: [
            { type: 'buffStat', value: 3, duration: 5, stat: 'WIS' }
        ],
        craftCost: [{ resourceId: 'wraith_essence', amount: 2 }, { resourceId: 'arcane_essence', amount: 1 }],
        manaCost: 20,
        symbol: '[o]'
    },
    {
        id: 'berserker_ichor',
        name: 'Berserker Ichor',
        description: 'Unleash primal fury. +25% damage for 3 turns.',
        effects: [
            { type: 'damageBoost', value: 25, duration: 3 }
        ],
        craftCost: [{ resourceId: 'demon_claw', amount: 1 }, { resourceId: 'dark_essence', amount: 2 }],
        manaCost: 30,
        symbol: '[!]'
    },
    {
        id: 'prowlers_edge',
        name: "Prowler's Edge",
        description: 'Sharpens your instincts. +15% crit chance for 4 turns.',
        effects: [
            { type: 'critBoost', value: 15, duration: 4 }
        ],
        craftCost: [{ resourceId: 'wolf_leather', amount: 2 }, { resourceId: 'spider_silk', amount: 3 }],
        manaCost: 22,
        symbol: '[X]'
    },
    {
        id: 'vampiric_cordial',
        name: 'Vampiric Cordial',
        description: 'Steal life from enemies. +20% lifesteal for 4 turns.',
        effects: [
            { type: 'lifesteal', value: 20, duration: 4 }
        ],
        craftCost: [{ resourceId: 'shadowcap', amount: 2 }, { resourceId: 'dark_essence', amount: 1 }],
        manaCost: 28,
        symbol: '[V]'
    },

    // =========================================================================
    // DEFENSIVE ELIXIRS
    // =========================================================================
    {
        id: 'stoneskin_salve',
        name: 'Stoneskin Salve',
        description: 'Grants a 20 HP shield for 3 turns.',
        effects: [
            { type: 'shield', value: 20, duration: 3 }
        ],
        craftCost: [{ resourceId: 'golem_heart', amount: 1 }, { resourceId: 'earth_essence', amount: 2 }],
        manaCost: 25,
        symbol: '[#]'
    },
    {
        id: 'ironhide_tincture',
        name: 'Ironhide Tincture',
        description: 'Hardens your defenses. +5 BAR for 4 turns.',
        effects: [
            { type: 'buffStat', value: 5, duration: 4, stat: 'BAR' }
        ],
        craftCost: [{ resourceId: 'iron_ore', amount: 5 }, { resourceId: 'earth_essence', amount: 3 }],
        manaCost: 20,
        symbol: '[=]'
    },
    {
        id: 'mirror_elixir',
        name: 'Mirror Elixir',
        description: 'Reflect 30% of damage taken for 3 turns.',
        effects: [
            { type: 'reflect', value: 30, duration: 3 }
        ],
        craftCost: [{ resourceId: 'ether_glass', amount: 1 }, { resourceId: 'ice_essence', amount: 2 }],
        manaCost: 32,
        symbol: '[|]'
    },

    // =========================================================================
    // UTILITY ELIXIRS
    // =========================================================================
    {
        id: 'purifying_waters',
        name: 'Purifying Waters',
        description: 'Cleanses all negative effects.',
        effects: [
            { type: 'cleanse', value: 0 }
        ],
        craftCost: [{ resourceId: 'holy_essence', amount: 1 }, { resourceId: 'water_essence', amount: 2 }],
        manaCost: 25,
        symbol: '[%]'
    },
    {
        id: 'quicksilver_draught',
        name: 'Quicksilver Draught',
        description: 'Grants an extra action this turn.',
        effects: [
            { type: 'speedBoost', value: 1 }
        ],
        craftCost: [{ resourceId: 'wind_essence', amount: 3 }, { resourceId: 'lightning_essence', amount: 1 }],
        manaCost: 35,
        symbol: '[>>]'
    },

    // =========================================================================
    // LEGENDARY ELIXIRS
    // =========================================================================
    {
        id: 'elixir_of_ascension',
        name: 'Elixir of Ascension',
        description: 'The ultimate enhancement. +2 to all stats for 3 turns.',
        effects: [
            { type: 'buffStat', value: 2, duration: 3, stat: 'WIS' },
            { type: 'buffStat', value: 2, duration: 3, stat: 'ARC' },
            { type: 'buffStat', value: 2, duration: 3, stat: 'VIT' },
            { type: 'buffStat', value: 2, duration: 3, stat: 'BAR' },
            { type: 'buffStat', value: 2, duration: 3, stat: 'LCK' },
            { type: 'buffStat', value: 2, duration: 3, stat: 'SPD' }
        ],
        craftCost: [
            { resourceId: 'dragon_blood', amount: 1 },
            { resourceId: 'phoenix_ash', amount: 1 },
            { resourceId: 'primal_essence', amount: 1 }
        ],
        manaCost: 60,
        symbol: '[**]'
    },
    {
        id: 'soul_ambrosia',
        name: 'Soul Ambrosia',
        description: 'Divine nectar. Heals 50% HP and grants 40 shield.',
        effects: [
            { type: 'healPercent', value: 50 },
            { type: 'shield', value: 40, duration: 5 }
        ],
        craftCost: [
            { resourceId: 'angel_feather', amount: 2 },
            { resourceId: 'holy_essence', amount: 3 },
            { resourceId: 'life_essence', amount: 2 }
        ],
        manaCost: 55,
        symbol: '[@@]'
    },
    {
        id: 'chaos_catalyst',
        name: 'Chaos Catalyst',
        description: 'Embrace destruction. +40% damage, +20% crit for 2 turns.',
        effects: [
            { type: 'damageBoost', value: 40, duration: 2 },
            { type: 'critBoost', value: 20, duration: 2 }
        ],
        craftCost: [
            { resourceId: 'demon_claw', amount: 2 },
            { resourceId: 'void_essence', amount: 2 },
            { resourceId: 'bloodstone', amount: 1 }
        ],
        manaCost: 45,
        symbol: '[8]'
    },
];

// Lookup map for quick access
export const POTIONS_MAP: Record<string, Potion> = {};
POTIONS.forEach(p => { POTIONS_MAP[p.id] = p; });

// Initial empty potion inventory
export const INITIAL_POTION_INVENTORY: Record<string, number> = {};
POTIONS.forEach(p => { INITIAL_POTION_INVENTORY[p.id] = 0; });
