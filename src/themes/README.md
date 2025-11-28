# Themes

This directory contains theme configuration files for Phantom Patch Notes.

## Theme Structure

Each theme is defined as a JSON file with the following structure:

```json
{
  "name": "theme-name",
  "vocabulary": {
    "verbs": ["summoned", "banished", "cursed"],
    "adjectives": ["haunted", "spectral", "eldritch"],
    "nouns": ["phantom", "specter", "wraith"]
  },
  "patterns": [
    {
      "type": "addition",
      "templates": ["Summoned {feature} from the void"]
    },
    {
      "type": "removal",
      "templates": ["Banished {feature} to the shadow realm"]
    },
    {
      "type": "modification",
      "templates": ["Transformed {feature} with dark magic"]
    },
    {
      "type": "fix",
      "templates": ["Exorcised the {bug} haunting {component}"]
    },
    {
      "type": "breaking",
      "templates": ["Shattered {feature} in a ritual of renewal"]
    }
  ],
  "cssStyles": "/* Optional CSS styling */"
}
```

## Available Themes

- `haunted.json` - Default horror theme with spectral vocabulary and gothic styling

## Theme Components

### Vocabulary

Themes define three types of vocabulary words:

- **Verbs**: Action words used in transformations (e.g., "summoned", "banished", "cursed")
- **Adjectives**: Descriptive words for atmosphere (e.g., "spectral", "eldritch", "haunted")
- **Nouns**: Thematic entities and concepts (e.g., "phantom", "wraith", "specter")

### Patterns

Patterns define narrative templates for different types of changes:

- **addition**: New features or functionality (e.g., "Summoned {feature} from the void")
- **removal**: Deleted features or code (e.g., "Banished {feature} to the shadow realm")
- **modification**: Changed or updated features (e.g., "Transformed {feature} with dark magic")
- **fix**: Bug fixes and corrections (e.g., "Exorcised the {bug} haunting {component}")
- **breaking**: Breaking changes (e.g., "Shattered {feature} in a ritual of renewal")

Templates can use placeholders:
- `{feature}` - Extracted feature name from commit message
- `{component}` - Component or module name
- `{bug}` - Bug or issue description

### CSS Styles

Optional CSS styling rules that define the visual appearance of exported HTML patch notes. The haunted theme includes:

- Dark gradient backgrounds (purples, blacks)
- Gothic fonts (Crimson Text, Cinzel)
- Glowing text effects and shadows
- Smooth animations (fade-ins, hover effects)
- Horror-themed color palette

## Creating Custom Themes

### Step-by-Step Guide

#### Step 1: Create Your Theme File

Create a new JSON file in the `src/themes/` directory with a descriptive name (e.g., `cyberpunk.json`, `medieval.json`, `space.json`).

#### Step 2: Define the Basic Structure

Start with the required fields:

```json
{
  "name": "your-theme-name",
  "vocabulary": {
    "verbs": [],
    "adjectives": [],
    "nouns": []
  },
  "patterns": [],
  "cssStyles": ""
}
```

#### Step 3: Build Your Vocabulary

Add thematically consistent words to each vocabulary category. Aim for 10-20 words per category for variety:

**Verbs** - Action words that describe what happened:
- Think about actions in your theme (e.g., for cyberpunk: "hacked", "uploaded", "compiled", "encrypted")
- Use past tense for consistency
- Include both positive and negative actions

**Adjectives** - Descriptive words that set the atmosphere:
- Choose words that evoke your theme's mood (e.g., for medieval: "noble", "ancient", "legendary", "cursed")
- Mix intensity levels (subtle to dramatic)
- Consider both visual and emotional descriptors

**Nouns** - Entities and concepts from your theme:
- Include characters, objects, and abstract concepts (e.g., for space: "astronaut", "nebula", "cosmos", "void")
- Use singular forms
- Mix concrete and abstract nouns

#### Step 4: Create Narrative Patterns

Define templates for all 5 required pattern types. Each pattern should have multiple template variations (4-8 recommended):

**Addition Pattern** - For new features:
```json
{
  "type": "addition",
  "templates": [
    "Introduced {feature} to the system",
    "Deployed {feature} into production",
    "Activated {feature} module"
  ]
}
```

**Removal Pattern** - For deleted code:
```json
{
  "type": "removal",
  "templates": [
    "Removed {feature} from the codebase",
    "Decommissioned {feature}",
    "Retired {feature} permanently"
  ]
}
```

**Modification Pattern** - For changes:
```json
{
  "type": "modification",
  "templates": [
    "Updated {feature} with improvements",
    "Refactored {feature}",
    "Enhanced {feature} capabilities"
  ]
}
```

**Fix Pattern** - For bug fixes:
```json
{
  "type": "fix",
  "templates": [
    "Fixed the {bug} in {component}",
    "Resolved {bug} affecting {component}",
    "Patched {component} to eliminate {bug}"
  ]
}
```

**Breaking Pattern** - For breaking changes:
```json
{
  "type": "breaking",
  "templates": [
    "Rebuilt {feature} from the ground up",
    "Completely redesigned {feature}",
    "Replaced {feature} with new architecture"
  ]
}
```

#### Step 5: Add CSS Styling (Optional)

Include CSS rules for HTML exports. Keep it as a single-line string:

```json
"cssStyles": "body{background:#000;color:#0f0;font-family:monospace}h1{color:#0f0;text-shadow:0 0 10px #0f0}"
```

Tips for CSS:
- Use inline styles (no line breaks)
- Define colors, fonts, and basic layout
- Add theme-appropriate effects (shadows, gradients, animations)
- Test with exported HTML to ensure readability

#### Step 6: Validate Your Theme

Ensure your theme includes:
- ✅ A unique `name` field
- ✅ `vocabulary` object with `verbs`, `adjectives`, and `nouns` arrays (at least 1 entry each)
- ✅ All 5 pattern types: `addition`, `removal`, `modification`, `fix`, `breaking`
- ✅ At least one template per pattern type
- ✅ Valid JSON syntax (use a JSON validator)

#### Step 7: Test Your Theme

1. Save your theme file in `src/themes/`
2. Restart the application (themes are loaded on startup)
3. Your theme will be automatically discovered
4. Test with real commit messages to verify output quality
5. Iterate on vocabulary and patterns based on results

### Complete Example: Cyberpunk Theme

Here's a complete example of a custom theme:

```json
{
  "name": "cyberpunk",
  "vocabulary": {
    "verbs": [
      "hacked",
      "uploaded",
      "compiled",
      "encrypted",
      "decrypted",
      "jacked-in",
      "interfaced",
      "debugged",
      "patched",
      "overclocked",
      "synced",
      "initialized",
      "terminated",
      "executed",
      "deployed"
    ],
    "adjectives": [
      "neon",
      "digital",
      "cyber",
      "virtual",
      "synthetic",
      "augmented",
      "neural",
      "quantum",
      "encrypted",
      "glitched",
      "chrome",
      "electric",
      "binary",
      "networked",
      "rogue"
    ],
    "nouns": [
      "protocol",
      "algorithm",
      "matrix",
      "network",
      "interface",
      "daemon",
      "firewall",
      "subnet",
      "kernel",
      "buffer",
      "cache",
      "pipeline",
      "thread",
      "socket",
      "packet"
    ]
  },
  "patterns": [
    {
      "type": "addition",
      "templates": [
        "Uploaded {feature} to the mainframe",
        "Compiled {feature} into the system",
        "Jacked {feature} into the network",
        "Initialized {feature} protocol"
      ]
    },
    {
      "type": "removal",
      "templates": [
        "Purged {feature} from the database",
        "Terminated {feature} process",
        "Disconnected {feature} from the grid",
        "Wiped {feature} from memory"
      ]
    },
    {
      "type": "modification",
      "templates": [
        "Overclocked {feature} performance",
        "Patched {feature} with new code",
        "Upgraded {feature} firmware",
        "Optimized {feature} algorithms"
      ]
    },
    {
      "type": "fix",
      "templates": [
        "Debugged the {bug} in {component}",
        "Patched {component} to fix {bug}",
        "Eliminated {bug} from {component}",
        "Resolved {bug} affecting {component}"
      ]
    },
    {
      "type": "breaking",
      "templates": [
        "Rewired {feature} architecture",
        "Rebooted {feature} from scratch",
        "Reformatted {feature} completely",
        "Rebuilt {feature} core systems"
      ]
    }
  ],
  "cssStyles": "body{background:linear-gradient(135deg,#0a0a0a 0%,#1a0a1a 50%,#0a1a1a 100%);color:#00ff41;font-family:'Courier New',monospace;line-height:1.6}h1,h2,h3{color:#00ff41;text-shadow:0 0 10px rgba(0,255,65,0.5);font-family:'Share Tech Mono',monospace;letter-spacing:3px;text-transform:uppercase}h1{font-size:2.5em;border-bottom:2px solid #00ff41;padding-bottom:0.5em}code{background:#1a1a1a;color:#ff00ff;padding:2px 6px;border:1px solid #00ff41}a{color:#00ffff;text-decoration:none}a:hover{color:#ff00ff;text-shadow:0 0 8px rgba(255,0,255,0.8)}"
}
```

## Example: Haunted Theme

The default haunted theme demonstrates the full capabilities:

- **20 verbs**: summoned, banished, cursed, conjured, exorcised, manifested, etc.
- **20 adjectives**: spectral, eldritch, haunted, ethereal, cursed, phantom, etc.
- **20 nouns**: phantom, specter, wraith, spirit, apparition, entity, etc.
- **5 pattern types**: Each with 4-8 template variations
- **Comprehensive CSS**: Gothic styling with animations and effects

## Theme Validation

The Theme Engine validates all themes on load:

- Required fields must be present
- Vocabulary arrays must contain at least one entry
- All 5 pattern types must be defined
- Each pattern must have at least one template
- Invalid themes will trigger a fallback to the default theme

## Tips for Theme Creation

1. **Consistency**: Keep vocabulary and patterns thematically aligned
2. **Variety**: Provide multiple templates per pattern type for diverse output
3. **Placeholders**: Use `{feature}`, `{component}`, and `{bug}` appropriately
4. **Testing**: Test with real commit messages to ensure natural output
5. **CSS**: Keep styles readable and accessible while maintaining theme atmosphere
6. **Balance**: Mix dramatic and subtle language for varied tone
7. **Readability**: Ensure themed output remains understandable
8. **Uniqueness**: Create distinctive themes that stand out from defaults

## Advanced Techniques

### Dynamic Placeholders

Templates support three placeholder types:

- `{feature}` - Extracted from commit message (e.g., "user authentication", "API endpoint")
- `{component}` - Same as feature, used for context in fix patterns
- `{bug}` - Extracted bug-related keywords (e.g., "crash", "error", "issue")

The Theme Engine automatically extracts these from commit messages by:
- Removing common prefixes (feat:, fix:, etc.)
- Identifying bug-related keywords
- Taking the first meaningful phrase

### Template Variety Strategies

**Strategy 1: Intensity Variation**
```json
"templates": [
  "Added {feature}",                    // Neutral
  "Introduced {feature}",               // Moderate
  "Unleashed {feature} upon the world"  // Dramatic
]
```

**Strategy 2: Perspective Variation**
```json
"templates": [
  "The system gained {feature}",        // System perspective
  "Developers added {feature}",         // Developer perspective
  "{feature} emerged from the code"     // Feature perspective
]
```

**Strategy 3: Context Variation**
```json
"templates": [
  "Deployed {feature} to production",   // Deployment context
  "Integrated {feature} into core",     // Integration context
  "Activated {feature} module"          // Activation context
]
```

### CSS Styling Best Practices

**Color Schemes**: Choose 3-5 core colors that represent your theme
```css
/* Example: Cyberpunk palette */
--primary: #00ff41;    /* Matrix green */
--secondary: #ff00ff;  /* Neon pink */
--accent: #00ffff;     /* Cyan */
--bg: #0a0a0a;         /* Dark background */
--text: #00ff41;       /* Primary text */
```

**Typography**: Select fonts that match your theme
- Horror: Crimson Text, Cinzel, Creepster
- Cyberpunk: Share Tech Mono, Orbitron, Courier New
- Medieval: Uncial Antiqua, MedievalSharp, Cinzel
- Space: Exo, Audiowide, Orbitron

**Effects**: Add subtle animations and shadows
```css
/* Glow effect */
text-shadow: 0 0 10px rgba(0,255,65,0.5);

/* Fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Troubleshooting

### Theme Not Loading

**Problem**: Your theme doesn't appear in the available themes list.

**Solutions**:
1. Verify the file is in `src/themes/` directory
2. Ensure the file has `.json` extension
3. Check JSON syntax with a validator (https://jsonlint.com)
4. Restart the application to reload themes
5. Check console logs for loading errors

### Validation Errors

**Problem**: Theme validation fails on load.

**Common Issues**:
- Missing required fields (`name`, `vocabulary`, `patterns`)
- Empty vocabulary arrays
- Missing pattern types (must have all 5)
- Invalid pattern type names (must be exact: addition, removal, modification, fix, breaking)
- Patterns without templates array

**Solution**: Review the validation requirements and ensure all fields are present and correctly formatted.

### Templates Not Working

**Problem**: Templates produce unexpected output.

**Debugging Steps**:
1. Check placeholder spelling: `{feature}`, `{component}`, `{bug}` (case-sensitive)
2. Verify template strings are properly escaped in JSON
3. Test with simple templates first, then add complexity
4. Review commit messages to ensure feature extraction works

### CSS Not Applying

**Problem**: HTML exports don't show your custom styling.

**Solutions**:
1. Ensure `cssStyles` is a single-line string (no line breaks in JSON)
2. Escape special characters properly
3. Test CSS separately in an HTML file first
4. Verify the CSS is valid (no syntax errors)
5. Check that selectors match the HTML structure

### Theme Falls Back to Default

**Problem**: System uses default theme instead of your custom theme.

**Causes**:
- Theme validation failed (check console logs)
- Theme file couldn't be read (check file permissions)
- Theme name doesn't match requested name
- JSON parsing error

**Solution**: Check application logs for specific error messages and fix the underlying issue.

## Theme Ideas

Need inspiration? Here are some theme concepts to explore:

- **Medieval Fantasy**: Knights, dragons, castles, quests
- **Space Opera**: Starships, galaxies, aliens, exploration
- **Steampunk**: Gears, steam, brass, Victorian era
- **Ocean/Nautical**: Ships, waves, depths, creatures
- **Western**: Cowboys, outlaws, frontier, saloons
- **Film Noir**: Detectives, shadows, mystery, crime
- **Garden/Nature**: Plants, seasons, growth, ecosystems
- **Alchemy**: Elements, transmutation, mysticism, experiments
- **Time Travel**: Paradoxes, eras, chronology, causality
- **Cooking**: Recipes, ingredients, flavors, techniques

## Contributing Themes

If you create an interesting theme, consider sharing it with the community! Themes can be:
- Added to the default theme collection
- Shared in a theme repository
- Published as separate packages
- Included in documentation as examples

Good themes are:
- Well-documented with clear inspiration
- Thoroughly tested with various commit types
- Balanced between creativity and readability
- Accessible and inclusive in language
