import { ResourceDef, ResourceCategory } from './game.interfaces';

// =============================================================================
// ALL RESOURCES (105 total)
// =============================================================================

export const ALL_RESOURCES: ResourceDef[] = [
    // =========================================================================
    // ESSENCES (12) - Elemental materials
    // =========================================================================
    { id: 'fire_essence', name: 'Fire Essence', category: 'essence', description: 'Pure elemental fire.', rarity: 'common' },
    { id: 'ice_essence', name: 'Ice Essence', category: 'essence', description: 'Crystallized cold.', rarity: 'common' },
    { id: 'lightning_essence', name: 'Lightning Essence', category: 'essence', description: 'Captured storm energy.', rarity: 'common' },
    { id: 'earth_essence', name: 'Earth Essence', category: 'essence', description: 'Concentrated terra firma.', rarity: 'common' },
    { id: 'water_essence', name: 'Water Essence', category: 'essence', description: 'Purified elemental water.', rarity: 'common' },
    { id: 'wind_essence', name: 'Wind Essence', category: 'essence', description: 'Bottled gale.', rarity: 'common' },
    { id: 'holy_essence', name: 'Holy Essence', category: 'essence', description: 'Divine radiance.', rarity: 'uncommon' },
    { id: 'dark_essence', name: 'Dark Essence', category: 'essence', description: 'Condensed shadow.', rarity: 'uncommon' },
    { id: 'life_essence', name: 'Life Essence', category: 'essence', description: 'Vital energy.', rarity: 'uncommon' },
    { id: 'void_essence', name: 'Void Essence', category: 'essence', description: 'Emptiness made manifest.', rarity: 'rare' },
    { id: 'arcane_essence', name: 'Arcane Essence', category: 'essence', description: 'Pure magical energy.', rarity: 'rare' },
    { id: 'primal_essence', name: 'Primal Essence', category: 'essence', description: 'Ancient elemental power.', rarity: 'epic' },

    // =========================================================================
    // REAGENTS (15) - Magical components
    // =========================================================================
    { id: 'mana_crystal', name: 'Mana Crystal', category: 'reagent', description: 'Crystallized mana.', rarity: 'common' },
    { id: 'arcane_ash', name: 'Arcane Ash', category: 'reagent', description: 'Residue of spent magic.', rarity: 'common' },
    { id: 'spirit_dust', name: 'Spirit Dust', category: 'reagent', description: 'Ethereal particles.', rarity: 'common' },
    { id: 'moonstone_powder', name: 'Moonstone Powder', category: 'reagent', description: 'Ground moonstone.', rarity: 'common' },
    { id: 'starlight_shard', name: 'Starlight Shard', category: 'reagent', description: 'Captured starlight.', rarity: 'uncommon' },
    { id: 'witch_salt', name: 'Witch Salt', category: 'reagent', description: 'Purified ritual salt.', rarity: 'common' },
    { id: 'enchanted_ink', name: 'Enchanted Ink', category: 'reagent', description: 'Magical writing fluid.', rarity: 'uncommon' },
    { id: 'spell_parchment', name: 'Spell Parchment', category: 'reagent', description: 'Magically treated paper.', rarity: 'common' },
    { id: 'binding_thread', name: 'Binding Thread', category: 'reagent', description: 'Enchanted binding material.', rarity: 'uncommon' },
    { id: 'ether_glass', name: 'Ether Glass', category: 'reagent', description: 'Glass infused with ether.', rarity: 'rare' },
    { id: 'soul_shard', name: 'Soul Shard', category: 'reagent', description: 'Fragment of a soul.', rarity: 'rare' },
    { id: 'shadow_thread', name: 'Shadow Thread', category: 'reagent', description: 'Woven darkness.', rarity: 'rare' },
    { id: 'phoenix_ash', name: 'Phoenix Ash', category: 'reagent', description: 'Ashes of rebirth.', rarity: 'epic' },
    { id: 'dragon_blood', name: 'Dragon Blood', category: 'reagent', description: 'Potent dragon vitae.', rarity: 'epic' },
    { id: 'titan_marrow', name: 'Titan Marrow', category: 'reagent', description: 'Essence of giants.', rarity: 'legendary' },

    // =========================================================================
    // GEMS (12) - Precious stones
    // =========================================================================
    { id: 'ruby', name: 'Ruby', category: 'gem', description: 'Red gem of fire.', rarity: 'uncommon' },
    { id: 'sapphire', name: 'Sapphire', category: 'gem', description: 'Blue gem of ice.', rarity: 'uncommon' },
    { id: 'emerald', name: 'Emerald', category: 'gem', description: 'Green gem of nature.', rarity: 'uncommon' },
    { id: 'topaz', name: 'Topaz', category: 'gem', description: 'Yellow gem of lightning.', rarity: 'uncommon' },
    { id: 'amethyst', name: 'Amethyst', category: 'gem', description: 'Purple gem of arcane.', rarity: 'uncommon' },
    { id: 'onyx', name: 'Onyx', category: 'gem', description: 'Black gem of shadow.', rarity: 'uncommon' },
    { id: 'opal', name: 'Opal', category: 'gem', description: 'Iridescent gem of many.', rarity: 'rare' },
    { id: 'diamond', name: 'Diamond', category: 'gem', description: 'Perfect clarity.', rarity: 'rare' },
    { id: 'obsidian', name: 'Obsidian', category: 'gem', description: 'Volcanic glass.', rarity: 'rare' },
    { id: 'moonstone', name: 'Moonstone', category: 'gem', description: 'Lunar gem.', rarity: 'rare' },
    { id: 'bloodstone', name: 'Bloodstone', category: 'gem', description: 'Dark red power gem.', rarity: 'epic' },
    { id: 'soulstone', name: 'Soulstone', category: 'gem', description: 'Contains trapped souls.', rarity: 'legendary' },

    // =========================================================================
    // METALS (10) - Ores and ingots
    // =========================================================================
    { id: 'iron_ore', name: 'Iron Ore', category: 'metal', description: 'Common iron.', rarity: 'common' },
    { id: 'copper_ore', name: 'Copper Ore', category: 'metal', description: 'Conductive metal.', rarity: 'common' },
    { id: 'silver_ore', name: 'Silver Ore', category: 'metal', description: 'Moon-blessed metal.', rarity: 'uncommon' },
    { id: 'gold_ore', name: 'Gold Ore', category: 'metal', description: 'Precious metal.', rarity: 'uncommon' },
    { id: 'mithril_ore', name: 'Mithril Ore', category: 'metal', description: 'Light magical metal.', rarity: 'rare' },
    { id: 'adamantine_ore', name: 'Adamantine Ore', category: 'metal', description: 'Unbreakable metal.', rarity: 'rare' },
    { id: 'orichalcum_ore', name: 'Orichalcum Ore', category: 'metal', description: 'Legendary alloy.', rarity: 'epic' },
    { id: 'starmetal_ore', name: 'Starmetal Ore', category: 'metal', description: 'Meteor metal.', rarity: 'epic' },
    { id: 'voidsteel_ore', name: 'Voidsteel Ore', category: 'metal', description: 'Metal from the void.', rarity: 'legendary' },
    { id: 'primordial_ore', name: 'Primordial Ore', category: 'metal', description: 'First metal.', rarity: 'legendary' },

    // =========================================================================
    // HERBS (12) - Magical plants
    // =========================================================================
    { id: 'healing_moss', name: 'Healing Moss', category: 'herb', description: 'Restorative plant.', rarity: 'common' },
    { id: 'mana_blossom', name: 'Mana Blossom', category: 'herb', description: 'Magical flower.', rarity: 'common' },
    { id: 'fireweed', name: 'Fireweed', category: 'herb', description: 'Burns to touch.', rarity: 'common' },
    { id: 'frostleaf', name: 'Frostleaf', category: 'herb', description: 'Ice cold herb.', rarity: 'common' },
    { id: 'thornroot', name: 'Thornroot', category: 'herb', description: 'Painful but useful.', rarity: 'common' },
    { id: 'shadowcap', name: 'Shadowcap', category: 'herb', description: 'Grows in darkness.', rarity: 'uncommon' },
    { id: 'sunpetal', name: 'Sunpetal', category: 'herb', description: 'Radiates light.', rarity: 'uncommon' },
    { id: 'dreamweed', name: 'Dreamweed', category: 'herb', description: 'Induces visions.', rarity: 'uncommon' },
    { id: 'ghostcap', name: 'Ghostcap', category: 'herb', description: 'Ethereal mushroom.', rarity: 'rare' },
    { id: 'dragonlily', name: 'Dragon Lily', category: 'herb', description: 'Draconic flora.', rarity: 'rare' },
    { id: 'worldtree_leaf', name: 'Worldtree Leaf', category: 'herb', description: 'From the great tree.', rarity: 'epic' },
    { id: 'voidbloom', name: 'Voidbloom', category: 'herb', description: 'Grows in nothing.', rarity: 'legendary' },

    // =========================================================================
    // CREATURE PARTS (15) - Monster drops
    // =========================================================================
    { id: 'goblin_tooth', name: 'Goblin Tooth', category: 'creature', description: 'Sharp and dirty.', rarity: 'common' },
    { id: 'skeleton_bone', name: 'Skeleton Bone', category: 'creature', description: 'Animated remains.', rarity: 'common' },
    { id: 'imp_horn', name: 'Imp Horn', category: 'creature', description: 'Small demon horn.', rarity: 'common' },
    { id: 'wolf_leather', name: 'Wolf Leather', category: 'creature', description: 'Beast fur.', rarity: 'common' },
    { id: 'spider_silk', name: 'Spider Silk', category: 'creature', description: 'Sticky and strong.', rarity: 'common' },
    { id: 'elemental_core', name: 'Elemental Core', category: 'creature', description: 'Heart of an elemental.', rarity: 'uncommon' },
    { id: 'wraith_essence', name: 'Wraith Essence', category: 'creature', description: 'Ghostly remains.', rarity: 'uncommon' },
    { id: 'golem_heart', name: 'Golem Heart', category: 'creature', description: 'Animated core.', rarity: 'uncommon' },
    { id: 'demon_claw', name: 'Demon Claw', category: 'creature', description: 'Infernal talon.', rarity: 'rare' },
    { id: 'angel_feather', name: 'Angel Feather', category: 'creature', description: 'Divine plumage.', rarity: 'rare' },
    { id: 'phoenix_feather', name: 'Phoenix Feather', category: 'creature', description: 'Immortal plume.', rarity: 'rare' },
    { id: 'dragon_scale', name: 'Dragon Scale', category: 'creature', description: 'Nearly impervious.', rarity: 'epic' },
    { id: 'dragon_fang', name: 'Dragon Fang', category: 'creature', description: 'Razor sharp.', rarity: 'epic' },
    { id: 'titan_bone', name: 'Titan Bone', category: 'creature', description: 'Giant remains.', rarity: 'epic' },
    { id: 'elder_eye', name: 'Elder Eye', category: 'creature', description: 'Sees all.', rarity: 'legendary' },

    // =========================================================================
    // ENCHANTED ITEMS (12) - Magical objects
    // =========================================================================
    { id: 'enchanted_scroll', name: 'Enchanted Scroll', category: 'enchanted', description: 'Pre-written spell.', rarity: 'common' },
    { id: 'magic_candle', name: 'Magic Candle', category: 'enchanted', description: 'Never-ending flame.', rarity: 'common' },
    { id: 'runed_stone', name: 'Runed Stone', category: 'enchanted', description: 'Carved with power.', rarity: 'uncommon' },
    { id: 'spell_focus', name: 'Spell Focus', category: 'enchanted', description: 'Channels magic.', rarity: 'uncommon' },
    { id: 'mana_battery', name: 'Mana Battery', category: 'enchanted', description: 'Stores mana.', rarity: 'uncommon' },
    { id: 'spell_catalyst', name: 'Spell Catalyst', category: 'enchanted', description: 'Amplifies spells.', rarity: 'rare' },
    { id: 'ethereal_chain', name: 'Ethereal Chain', category: 'enchanted', description: 'Binds spirits.', rarity: 'rare' },
    { id: 'temporal_sand', name: 'Temporal Sand', category: 'enchanted', description: 'Time in a bottle.', rarity: 'rare' },
    { id: 'dimensional_shard', name: 'Dimensional Shard', category: 'enchanted', description: 'Reality fragment.', rarity: 'epic' },
    { id: 'void_prism', name: 'Void Prism', category: 'enchanted', description: 'Refracts nothing.', rarity: 'epic' },
    { id: 'infinity_loop', name: 'Infinity Loop', category: 'enchanted', description: 'Endless cycle.', rarity: 'legendary' },
    { id: 'genesis_spark', name: 'Genesis Spark', category: 'enchanted', description: 'Origin of creation.', rarity: 'legendary' },

    // =========================================================================
    // RUNE MATERIALS (8) - Runecrafting specific
    // =========================================================================
    { id: 'runestone', name: 'Runestone', category: 'rune_mat', description: 'Blank rune base.', rarity: 'common' },
    { id: 'rune_chisel', name: 'Rune Chisel', category: 'rune_mat', description: 'Carving tool.', rarity: 'common' },
    { id: 'inscription_dust', name: 'Inscription Dust', category: 'rune_mat', description: 'For rune writing.', rarity: 'uncommon' },
    { id: 'binding_rune', name: 'Binding Rune', category: 'rune_mat', description: 'Connects runes.', rarity: 'uncommon' },
    { id: 'amplifying_glyph', name: 'Amplifying Glyph', category: 'rune_mat', description: 'Increases power.', rarity: 'rare' },
    { id: 'master_rune', name: 'Master Rune', category: 'rune_mat', description: 'Perfect rune.', rarity: 'epic' },
    { id: 'primordial_glyph', name: 'Primordial Glyph', category: 'rune_mat', description: 'Ancient symbol.', rarity: 'epic' },
    { id: 'elder_rune', name: 'Elder Rune', category: 'rune_mat', description: 'Rune of the ancients.', rarity: 'legendary' },

    // =========================================================================
    // ARTIFACTS (6) - Ultra rare
    // =========================================================================
    { id: 'philosophers_stone', name: 'Philosophers Stone', category: 'artifact', description: 'Legendary transmuter.', rarity: 'legendary' },
    { id: 'eye_of_ages', name: 'Eye of Ages', category: 'artifact', description: 'Sees through time.', rarity: 'legendary' },
    { id: 'heart_of_magic', name: 'Heart of Magic', category: 'artifact', description: 'Source of all magic.', rarity: 'legendary' },
    { id: 'crown_fragment', name: 'Crown Fragment', category: 'artifact', description: 'Part of a divine crown.', rarity: 'legendary' },
    { id: 'void_crystal', name: 'Void Crystal', category: 'artifact', description: 'Pure nothingness.', rarity: 'legendary' },
    { id: 'world_seed', name: 'World Seed', category: 'artifact', description: 'Creates worlds.', rarity: 'legendary' },

    // =========================================================================
    // CURRENCIES (3) - Special currencies
    // =========================================================================
    { id: 'arcane_token', name: 'Arcane Token', category: 'currency', description: 'Magical currency.', rarity: 'uncommon' },
    { id: 'soul_coin', name: 'Soul Coin', category: 'currency', description: 'Worth a soul.', rarity: 'rare' },
    { id: 'divine_mark', name: 'Divine Mark', category: 'currency', description: 'Gods currency.', rarity: 'legendary' },

    // =========================================================================
    // ABSTRACT (3) - Research resources
    // =========================================================================
    { id: 'knowledge', name: 'Knowledge', category: 'currency', description: 'Basic understanding of the world.', rarity: 'common' },
    { id: 'insight', name: 'Insight', category: 'currency', description: 'Deep understanding of magic.', rarity: 'rare' },
    { id: 'percipience', name: 'Percipience', category: 'currency', description: 'True seeing of reality.', rarity: 'legendary' },
];

// Generate initial resources object (all zero)
export const INITIAL_CRAFTING_RESOURCES: Record<string, number> = {};
ALL_RESOURCES.forEach(r => { INITIAL_CRAFTING_RESOURCES[r.id] = 0; });

// Resource name lookup
export const RESOURCE_NAMES: Record<string, string> = {};
ALL_RESOURCES.forEach(r => { RESOURCE_NAMES[r.id] = r.name; });

// Resource lookup by id
export const RESOURCE_DEFS: Record<string, ResourceDef> = {};
ALL_RESOURCES.forEach(r => { RESOURCE_DEFS[r.id] = r; });

// Get resources by category (memoized to avoid repeated filtering)
const resourcesByCategoryCache = new Map<ResourceCategory, ResourceDef[]>();

export function getResourcesByCategory(category: ResourceCategory): ResourceDef[] {
    let cached = resourcesByCategoryCache.get(category);
    if (!cached) {
        cached = ALL_RESOURCES.filter(r => r.category === category);
        resourcesByCategoryCache.set(category, cached);
    }
    return cached;
}
