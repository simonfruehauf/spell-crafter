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

