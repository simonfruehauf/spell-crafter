GitHub Wiki Style Guide: "Arcanum" Aesthetic

This guide outlines how to replicate the high-density, emoji-categorized style of the Arcanum: Theory of Magic wiki within the constraints of a standard GitHub Wiki.

1. Design Philosophy

Dashboard Layout: The homepage should act as a central hub using a grid system (simulated via tables).

Emoji Coding: Use specific emojis to represent categories rather than external icons. This ensures compatibility across all devices and dark/light modes.

Data Density: Prioritize tables over paragraphs.

Embedded Flavor: Flavor text and lore should be contained within description fields using italics, rather than separate sections.

2. File Structure

A GitHub Wiki relies on specific filenames for structure.

Home.md: The landing page.

_Sidebar.md: The persistent navigation bar on the right.

_Footer.md: (Optional) Persistent footer content.

3. The Homepage (Home.md)

GitHub Wikis do not support CSS Grid. Use a Markdown table to create a 3-column dashboard layout.

EXAMPLE Template (does not have to include all of the follwing):

# Welcome to [Project Name]

> **Version:** 1.0.0 | **License:** MIT
> *A brief, one-sentence summary of the project lore or purpose.*

## 📂 Quick Navigation

| | | |
| :--- | :--- | :--- |
| 💎 **[[Resources]]**<br>Raw materials and currency | 📔 **[[Skills]]**<br>Abilities and tech trees | 📋 **[[Tasks]]**<br>Quests and objectives |
| 🔧 **[[Upgrades]]**<br>Equipment and tools | 🏠 **[[Building]]**<br>Construction guides |
| 🧪 **[[Alchemy]]**<br>Consumables and brewing | ⚔️ **[[Combat]]**<br>Enemies and mechanics | 📜 **[[Lore]]**<br>History and world info |

## 📚 Essential Guides
* [[Getting Started]] - Read this first.
* [[Contribution Guidelines]] - How to edit this wiki.


4. The Sidebar (_Sidebar.md)

This file controls the navigation menu shown on the right side of every page. Use it to replicate the "Important Articles" section.

Template:

### 🧭 Navigation
* [[Home]]
* [[About]]

### 🗃️ Database
* 💎 [[Resources]]
* 🔧 [[Upgrades]]
* 🏠 [[Structures]]

### ⚙️ Mechanics
* 📔 [[Skills]]
* ⚔️ [[Combat]]
* 🧪 [[Crafting]]

### 🌐 Community
* [Discord](YOUR_LINK_HERE)
* [Source Code](YOUR_LINK_HERE)


5. Content Page Templates

The core feature of this style is the "Data Table." Every item list must follow this specific 4-column structure.

Generic Item List Template

Columns:

Name: Bolded item name.

Description: Functional description + Flavor text (italicized) separated by <br>.

Effects: Stats or mechanical impacts, wrapped in backticks for code highlighting.

Tags: Comma-separated categories.

Markdown Code:

# 💎 Resources

## Basic Materials
| Name | Description | Effects | Tags |
| :--- | :--- | :--- | :--- |
| **Gold** | Standard currency.<br>_"Money makes the world go round."_ | `Value: 1` | Currency |
| **Wood** | Basic building block.<br>_"Sturdy oak logs."_ | `Build Power: 5` | Material, Organic |
| **Stone** | Found in quarries. | `Build Power: 10`<br>`Defense: 2` | Material, Mineral |

## Magical Items
| Name | Description | Effects | Tags |
| :--- | :--- | :--- | :--- |
| **Fire Gem** | Gem imbued with heat.<br>_"It burns to the touch."_ | `Fire Dmg: +5`<br>`Heat: +10%` | Gem, Elemental |
| **Void Gem** | The space where a gem once was. | `Void Resist: 1` | Gem, Abstract |


6. Formatting Rules

A. Line Breaks in Tables

GitHub Markdown tables do not support standard newlines. You must use the HTML tag <br> to create a line break inside a cell.

Incorrect:
Description
"Flavor text"

Correct:
Description<br>"Flavor text"

B. Math and Formulas

For game mechanics, use LaTeX formatting for clarity.

Input: $$Damage = (Base \times Level) + Bonus$$

Output: 

$$Damage = (Base \times Level) + Bonus$$

C. Status Indicators

Since text color is not supported in standard Markdown, use emojis to indicate feature status:

✅ - Implemented / Working

⚠️ - WIP / Unstable

❌ - Deprecated / Removed

🔒 - Locked / Admin Only