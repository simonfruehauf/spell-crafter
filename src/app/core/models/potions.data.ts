import { Potion } from './game.interfaces';

// =============================================================================
// POTIONS - Consumable buffs crafted from creature parts and mana
// =============================================================================

export const POTIONS: Potion[] = [
    // =========================================================================
    // HEALING POTIONS
    // =========================================================================
    {
        id: 'health_potion_minor',
        name: 'Minor Health Potion',
        description: 'Restores 5 HP + 10% max HP.',
        effects: [
            { type: 'healFlat', value: 5 },
            { type: 'healPercent', value: 10 }
        ],
        craftCost: [{ resourceId: 'goblin_tooth', amount: 1 }],
        manaCost: 15,
        symbol: '[♥]'
    },
    {
        id: 'health_potion_lesser',
        name: 'Lesser Health Potion',
        description: 'Restores 15 HP + 15% max HP.',
        effects: [
            { type: 'healFlat', value: 15 },
            { type: 'healPercent', value: 15 }
        ],
        craftCost: [{ resourceId: 'healing_moss', amount: 3 }, { resourceId: 'life_essence', amount: 1 }],
        manaCost: 25,
        symbol: '[♥]'
    },
    {
        id: 'health_potion_greater',
        name: 'Greater Health Potion',
        description: 'Restores 30 HP + 25% max HP.',
        effects: [
            { type: 'healFlat', value: 30 },
            { type: 'healPercent', value: 25 }
        ],
        craftCost: [{ resourceId: 'phoenix_feather', amount: 1 }, { resourceId: 'life_essence', amount: 3 }],
        manaCost: 40,
        symbol: '[♥]'
    },

    // =========================================================================
    // MANA POTIONS
    // =========================================================================
    {
        id: 'mana_potion_minor',
        name: 'Minor Mana Potion',
        description: 'Restores 12% max mana.',
        effects: [
            { type: 'manaPercent', value: 12 }
        ],
        craftCost: [{ resourceId: 'skeleton_bone', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 10,  // Costs 10% of max mana to brew
        symbol: '[✦]'
    },
    {
        id: 'mana_potion_lesser',
        name: 'Lesser Mana Potion',
        description: 'Restores 25% max mana.',
        effects: [
            { type: 'manaPercent', value: 25 }
        ],
        craftCost: [{ resourceId: 'mana_crystal', amount: 2 }, { resourceId: 'arcane_essence', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 15,
        symbol: '[✦]'
    },
    {
        id: 'mana_potion_greater',
        name: 'Greater Mana Potion',
        description: 'Restores 50% max mana.',
        effects: [
            { type: 'manaPercent', value: 50 }
        ],
        craftCost: [{ resourceId: 'mana_crystal', amount: 5 }, { resourceId: 'void_essence', amount: 1 }],
        manaCost: 0,
        manaCostPercent: 20,
        symbol: '[✦]'
    },

    // =========================================================================
    // BUFF POTIONS
    // =========================================================================
    {
        id: 'strength_potion',
        name: 'Potion of Strength',
        description: 'Increases ARC by 3 for 5 turns.',
        effects: [
            { type: 'buffStat', value: 3, duration: 5, stat: 'ARC' }
        ],
        craftCost: [{ resourceId: 'imp_horn', amount: 2 }, { resourceId: 'fire_essence', amount: 2 }],
        manaCost: 20,
        symbol: '[🗲]'
    },
    {
        id: 'wisdom_potion',
        name: 'Potion of Wisdom',
        description: 'Increases WIS by 3 for 5 turns.',
        effects: [
            { type: 'buffStat', value: 3, duration: 5, stat: 'WIS' }
        ],
        craftCost: [{ resourceId: 'wraith_essence', amount: 2 }, { resourceId: 'arcane_essence', amount: 1 }],
        manaCost: 20,
        symbol: '[✧]'
    },
    {
        id: 'protection_potion',
        name: 'Potion of Protection',
        description: 'Grants a 20 HP shield for 3 turns.',
        effects: [
            { type: 'shield', value: 20, duration: 3 }
        ],
        craftCost: [{ resourceId: 'golem_heart', amount: 1 }, { resourceId: 'earth_essence', amount: 2 }],
        manaCost: 25,
        symbol: '[◆]'
    },
    {
        id: 'fury_potion',
        name: 'Potion of Fury',
        description: 'Increases damage by 25% for 3 turns.',
        effects: [
            { type: 'damageBoost', value: 25, duration: 3 }
        ],
        craftCost: [{ resourceId: 'demon_claw', amount: 1 }, { resourceId: 'dark_essence', amount: 2 }],
        manaCost: 30,
        symbol: '[☠]'
    },
    {
        id: 'fortitude_potion',
        name: 'Potion of Fortitude',
        description: 'Increases BAR by 5 for 4 turns.',
        effects: [
            { type: 'buffStat', value: 5, duration: 4, stat: 'BAR' }
        ],
        craftCost: [{ resourceId: 'iron_ore', amount: 5 }, { resourceId: 'earth_essence', amount: 3 }],
        manaCost: 20,
        symbol: '[■]'
    },
];

// Lookup map for quick access
export const POTIONS_MAP: Record<string, Potion> = {};
POTIONS.forEach(p => { POTIONS_MAP[p.id] = p; });

// Initial empty potion inventory
export const INITIAL_POTION_INVENTORY: Record<string, number> = {};
POTIONS.forEach(p => { INITIAL_POTION_INVENTORY[p.id] = 0; });
