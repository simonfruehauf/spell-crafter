# 🧪 SpellCrafter

> **⚠️ EXPERIMENTAL PROJECT: This is a Vibecoded AI experiment!**
>
> This project was created as an experiment in AI-assisted "vibecoding" - an exploratory approach where AI agents collaborate with developers to rapidly prototype and build software. The code, design decisions, and features were largely generated through AI conversation and iteration. There has been MINIMAL human intervention in the process, apart from extensive initial design documents.

---

## 🎮 About

**SpellCrafter** is an idle/incremental game where you play as a budding mage learning to craft spells, battle enemies, and unlock arcane secrets. Combine magical runes to create powerful spells, research new abilities, and progress through a spell-crafting journey.

Built with **Angular 21** and styled with a retro Windows 95-inspired aesthetic, SpellCrafter offers a nostalgic UI experience with modern gameplay mechanics.

## ✨ Features

### 🔮 Spell Crafting System
- Discover and unlock magical **Runes** with unique effects
- Combine runes to create custom **Spells** with synergistic effects
- Each rune has its own damage type, mana cost, and special abilities
- Spell power scales with your Arcane (ARC) stat

### ⚔️ Combat
- Battle a variety of enemies with unique weaknesses and resistances
- 12 damage types: Physical, Fire, Ice, Lightning, Earth, Water, Wind, Holy, Dark, Arcane, Poison, Nature
- Active effects system: DOTs, HOTs, Buffs, Debuffs, Shields, and more
- Auto-combat option for idle progression
- Bestiary to track defeated enemies

### 📊 Character Stats
- **WIS** (Wisdom) - Mana regeneration and research speed
- **HP** (Health Points) - Your life pool
- **ARC** (Arcane) - Spell damage
- **VIT** (Vitality) - HP regeneration
- **BAR** (Barrier) - Damage reduction
- **LCK** (Luck) - Critical hit chance and loot bonuses
- **SPD** (Speed) - Combat turn speed

### 🔬 Research Tree
- Unlock new runes, abilities, and game features through research
- Spend mana to progress through the research tree
- Prerequisite system for structured progression

### ⚙️ Equipment System
- 7 equipment slots: Head, Face, Accessory, Body, Left Hand, Right Hand, Relic
- 6 rarity tiers: Mundane, Elevated, Exceptional, Primal, Epochal, Unique
- Craft equipment using gathered resources
- Equipment bonuses: stat boosts, damage %, crit chance, loot bonuses

### 🎒 Resource Gathering
- 10 resource categories: Essences, Reagents, Gems, Metals, Herbs, Creature Parts, Enchanted Items, Rune Materials, Artifacts, Currencies
- 5 rarity levels for resources: Common, Uncommon, Rare, Epic, Legendary
- Combat loot drops and passive generation

### 🪟 Windows 95 Aesthetic
- Nostalgic retro UI with draggable windows
- Classic window chrome with minimize/close buttons
- Multiple game windows: Altar, Research, Combat, Inventory, Workshop, Grimoire, Stats, Bestiary, Chronicle, Armory, and more

### 💾 Save System
- Automatic local storage saves
- Full game state persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v10 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/spell-crafter.git
   cd spell-crafter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4200/`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run watch` | Build in watch mode |

## 🛠️ Tech Stack

- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **Styling**: SCSS with custom Windows 95 theme
- **State Management**: Angular Signals + Services
- **Testing**: Vitest
- **Build Tool**: Angular CLI

## 📁 Project Structure

```
spell-crafter/
├── src/
│   ├── app/
│   │   ├── core/           # Core game logic
│   │   │   ├── models/     # TypeScript interfaces & game data
│   │   │   └── services/   # Game state, combat, save system
│   │   ├── features/       # UI components (windows)
│   │   │   ├── altar/      # Mana meditation
│   │   │   ├── armory/     # Equipment crafting
│   │   │   ├── bestiary/   # Enemy encyclopedia
│   │   │   ├── combat/     # Battle system
│   │   │   ├── discoveries/# Achievement tracking
│   │   │   ├── equipment/  # Player equipment
│   │   │   ├── grimoire/   # Spell book
│   │   │   ├── inventory/  # Resource management
│   │   │   ├── research/   # Tech tree
│   │   │   ├── runebook/   # Rune collection
│   │   │   ├── settings/   # Game options
│   │   │   ├── spell-crafting/ # Spell creation
│   │   │   ├── stats/      # Player statistics
│   │   │   └── workshop/   # Upgrades
│   │   └── shared/         # Shared components
│   ├── styles/             # Global styles
│   └── main.ts             # Application entry point
├── public/                 # Static assets
└── dist/                   # Production build output
```

## 🎯 Game Loop

1. **Meditate** at the Altar to generate Mana
2. **Research** new abilities using Mana
3. **Unlock Runes** to expand your spell options
4. **Craft Spells** by combining runes
5. **Battle Enemies** to earn Gold, XP, and Resources
6. **Craft Equipment** to boost your stats
7. **Upgrade** your abilities in the Workshop
8. **Repeat** and grow ever more powerful!

## 🤖 About the Vibecoding Experiment

This project was developed using an AI-assisted workflow where:
- Game mechanics were designed through conversational iteration
- Code was generated and refined by AI based on high-level descriptions
- UI/UX decisions emerged from back-and-forth dialogue
- Features were implemented rapidly without detailed upfront specifications

The goal was to explore how AI can accelerate game development and enable rapid prototyping of complex systems like spell crafting, combat, and progression mechanics.

## 📄 License

This project is provided as-is for experimental and educational purposes.

