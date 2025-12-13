---
description: Wiki creation flow
---

GitHub Wiki Generation

Role: Documentation Agent
Source of Truth: .agent/documentation/wiki.md (Style Guide)
Target Directory: wiki/
Objective: Create or update the project's GitHub Wiki to match the "Arcanum" aesthetic defined in the source guide.

1. Context Analysis

Load Style Guide: Read .agent/documentation/wiki.md to understand the formatting rules (Dashboard layout, emoji usage, data tables).

Scan Target: Check the wiki/ directory for existing files (Home.md, _Sidebar.md, content pages).

Scan Codebase: (Implicit) Analyze the project root to understand the domain (Resources, Skills, Combat) that needs documenting.

2. Execution Steps

Step A: Structure Verification

Ensure Directory: Verify wiki/ exists.

Sidebar: Create/Update wiki/_Sidebar.md.

Constraint: Must match the navigation hierarchy in the Style Guide.

Constraint: Ensure all links use [[WikiLink]] syntax.

Step B: Homepage Generation (wiki/Home.md)

Action: Generate the landing page.

Layout: Use the 3-column Markdown table "Dashboard" layout specified in the Style Guide.

Content:

Project Title & Version.

Navigation Grid (Resources, Skills, Tasks, etc.).

Essential Guides list.

Step C: Content Page Generation

Iterate: For each category identified in the Sidebar (e.g., Resources, Skills):

Check Existence: If wiki/{Category}.md exists, read it.

Format Enforcement: Rewrite or create the file using the 4-Column Data Table format:

| Name | Description | Effects | Tags |

Style Injection:

Bold all Names.

Insert <br> for line breaks in descriptions.

Add italicized flavor text if context permits.

Wrap stats in backticks (e.g., `Value: 10`).

3. Validation

Check Links: Ensure all [[Links]] in Home.md and _Sidebar.md point to valid filenames.

Check Rendering: Verify no unescaped pipes | are breaking tables.

Do not include things that are not present! E.g. do not include a "School.md" if there are no school features.

Check Consistency: Ensure emojis in the Sidebar match emojis on the Homepage.