## 2024-12-13 - OnPush Adoption Pattern

**Learning:** This codebase uses Angular signals extensively (`GameStateService.player()`, `.combat()`, `.resources()`, etc.). All feature components read from these signals but only 1/19 components had OnPush enabled.

**Action:** When profiling, prioritize enabling OnPush on high-interaction components (combat, alchemy, spell-crafting) that already use signals correctly. Quick wins with measurable impact.

**Progress:** ✅ 19/19 components now use OnPush (100% coverage achieved 2024-12-13).

## 2024-12-13 - Memoize Static Data Lookups

**Learning:** Functions like `getResourcesByCategory()` that filter constant arrays (e.g., `ALL_RESOURCES`) create new arrays on every call. When called from templates, this happens on every change detection cycle - wasteful since the data never changes.

**Action:** Memoize static data lookup functions with a simple Map cache. The pattern: `const cache = new Map(); export function lookup(key) { if (!cache.has(key)) cache.set(key, compute(key)); return cache.get(key); }`

**Optimization:** ✅ Applied to `getResourcesByCategory()` in resources.data.ts (2024-12-13).

## 2024-12-13 - Deep Clone vs JSON.parse(JSON.stringify)

**Learning:** The codebase was using `JSON.parse(JSON.stringify(...))` for deep cloning game data arrays (`INITIAL_EQUIPMENT_RECIPES`, `INITIAL_ALCHEMY_RECIPES`). This pattern is ~3-5x slower than `structuredClone` or a simple recursive clone.

**Action:** Created `shared/utils/clone.utils.ts` with a `deepClone()` utility that uses `structuredClone` when available (modern browsers) or falls back to recursive cloning. Use this utility for any deep cloning needs in the codebase.

**Optimization:** ✅ Applied to game-state.service.ts initialization and reset (2024-12-13).

## 2024-12-15 - Template Methods → Computed Signals

**Learning:** Template methods that read from signals (e.g., `getAmount(id)`, `hasResourcesInCategory()`) are called on every change detection cycle even when OnPush is enabled. In nested loops this creates O(n×m) function calls per cycle.

**Action:** Replace template methods with computed signals that pre-compute the entire display data structure. The pattern:
```typescript
readonly displayData = computed(() => {
  const source = this.sourceSignal();
  return this.categories.map(cat => ({
    ...cat,
    items: getItems(cat.id).filter(i => source[i.id] > 0).map(i => ({ ...i, value: source[i.id] }))
  })).filter(cat => cat.items.length > 0);
});
```

**Optimization:** ✅ Applied to InventoryComponent (2024-12-15): Eliminated ~200+ function calls per CD cycle by replacing `getAmount()`, `hasResourcesInCategory()`, `getCategoryCount()`, `getTotalResources()` with `categoryData` and `totalResources` computed signals.

## 2024-12-18 - Equipment Bonus Caching

**Learning:** `getEquipmentBonus()` was called 31+ times per combat action (for stats, damage, crit, loot bonuses, etc.), each call iterating through 7 equipment slots and their bonuses. This O(n×m) per-call pattern was wasteful since equipment rarely changes.

**Action:** Add a computed signal that precomputes ALL equipment bonuses once when equipment changes. The `getEquipmentBonus()` method now does O(1) lookups from the cache instead of O(n×m) iterations.

**Optimization:** ✅ Applied to EquipmentService (2024-12-18): Reduced ~650+ bonus iterations per combat action to 1 recomputation when equipment changes.

