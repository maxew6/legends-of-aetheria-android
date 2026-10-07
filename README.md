# Legends of Aetheria — Android

An Android wrapper for the **Legends of Aetheria** fantasy adventure. The game runs locally in a fullscreen landscape WebView and does not need a network connection while playing.

**Current Android build:** version 1.4 (`versionCode` 5).

## The adventure

Travel through five hand-built regions, each with its own palette, terrain, landmark set, and winding route:

1. **Aetheria Village** — meet Merlanth, Queen Elowen, the blacksmith, and the knight captain.
2. **The Enchanted Forest** — fight the corrupted wildlife and find the forest guardian and bound merchant.
3. **The Forgotten Ruins** — recover three moon-crystals, speak with Pip, and read the Moon-Seal mural.
4. **Dragon Valley** — survive the volcanic pass and its warning-marked attacks.
5. **The Fallen Castle** — confront Vyrmgrath, the Ancient Dragon.

The main quest advances through story conversations, enemy-clear goals, the three crystals, and the mural. Optional adventures include Brannoch’s goblin-mark hunt and five Chronicle memory stones; finding every memory earns the Moon Pendant. Pip teaches Starfall after the crystals are gathered.

Each region is now a wide, scrollable world with a camera-follow view, parallax night sky, on-screen scenery culling, persistent per-zone fog of war, and a discoverable secret. The gold-rimmed minimap and full map show explored terrain, objectives, gates, NPCs, treasure, shrines, enemies, and the dragon. The original story text, quests, enemy roster, character art, and dragon encounter are preserved.

## Gear, items, and loot

The Adventurer’s Pack presents equipment and treasure as illustrated inventory icons inspired by the supplied hand-painted fantasy-item reference. Weapons, armor, shields, jewelry, helmets, gloves, belts, a satchel, and the Moon Spellbook have distinct equipment slots and affect attack, magic, defense, health, or mana. Better gear equips automatically when found; owned equipment can also be changed from the inventory.

Enemies leave physical loot on the ground: goblins drop Moon-Iron Marks for Brannoch’s side quest, while other foes may drop potions, Ether Tonics, Ember Bombs, or rare gear. Walk up and interact to collect drops. Health and mana items are usable from the pack; the Ember Bomb deals area damage. Find the Moon Key in the forest to unlock a rare ruins chest, and collected Moon Crystals are tracked in the pack as well as the main quest.

## Controls

**Mobile (landscape):** use the floating left joystick for analog movement; hold the sword to repeat attacks. Tap a skill to auto-target, or drag/release to aim; dragging back onto its button cancels. The on-screen buttons provide dodge, Arcane Bolt, Fire, Heal, Starfall, contextual interaction, inventory, pause, settings, and the minimap. The minimap opens the full five-region map; tap the map or press `Esc` to return. Controls include cooldown, mana, lock, haptic, and safe-area feedback.

**Keyboard / desktop:**

- `WASD` or arrow keys — move
- `Space` — attack, or finish the current dialogue
- `Shift` — dodge
- `1` — Arcane Bolt · `2` — Fire · `3` — Heal · `4` — Starfall (learned during the story)
- `E` — interact / advance dialogue
- `I` — inventory and skill upgrades
- `M` — world map · `J` — Chronicle
- `Esc` — finish dialogue safely, close a panel, pause, or resume

The world map shows the five regions and which routes are open; it is a guide, not a fast-travel menu. The minimap is clickable on desktop and mobile (`M` also opens it on desktop). The Chronicle tracks discovered memories and the current chapter. The desktop keyboard bindings remain available alongside the mobile HUD.

## Build

Requirements: JDK 17 or newer and Android SDK Platform 35 with Build Tools 35.0.0.

```sh
./gradlew assembleDebug
```

The debug APK is created at `app/build/outputs/apk/debug/app-debug.apk`. A copy of the current installable build is at [`artifacts/LegendsOfAetheria.apk`](artifacts/LegendsOfAetheria.apk).

## Project layout

- `app/src/main/assets/index.html` — game logic, story, interactions, controls, camera, minimap, and UI sections
- `app/src/main/assets/world.js` — distinct biome maps, routes, parallax layers, and environment landmarks
- `app/src/main/assets/sprites.js` — animated pixel-art characters
- `app/src/main/assets/items/` — bundled 256px WebP item illustrations plus SVG fallbacks
- `app/src/main/java/com/aetheria/game/MainActivity.java` — native Android WebView shell
- `app/src/main/AndroidManifest.xml` — launcher and landscape app configuration
- `artifacts/LegendsOfAetheria.apk` — debug-signed Android build

Application ID: `com.aetheria.game` · Minimum Android version: 6.0 (API 23) · Target SDK: 35.

## Licensing

No license file was supplied with the original game, so this repository intentionally does not add a reuse license. Public visibility alone does not grant permission to reuse the original game code or assets.
