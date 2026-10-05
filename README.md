# Legends of Aetheria — Android

An Android wrapper for the supplied **Legends of Aetheria** HTML game. It runs locally in a fullscreen landscape WebView, with no network dependency during play.

## Character art

The game now uses a cohesive, hand-built pixel-art character renderer inspired by the supplied fantasy sprite reference. The controllable adventurer has directional poses, alternating walk frames, attack feedback, and visible armor/weapon changes. Named villagers and story characters have distinct outfits and props; goblins, wolves, skeletons, shades, knights, and the dragon use matching pixel silhouettes and movement animation. Sprite code and palette live in `app/src/main/assets/sprites.js`.

## Play

- Drag on the **left half** of the screen to move.
- Use the round on-screen buttons for attack, dodge, spells, interaction, inventory, and pause.
- The opening menu starts the journey.

## Build

Requirements: JDK 17 or newer and Android SDK Platform 35 with Build Tools 35.0.0.

```sh
./gradlew assembleDebug
```

The debug APK is created at `app/build/outputs/apk/debug/app-debug.apk`. A copy of the current installable APK is at [`artifacts/LegendsOfAetheria.apk`](artifacts/LegendsOfAetheria.apk).

## Project layout

- `app/src/main/assets/index.html` — game logic and UI
- `app/src/main/assets/sprites.js` — reusable pixel character renderer
- `app/src/main/java/com/aetheria/game/MainActivity.java` — native Android WebView shell
- `app/src/main/AndroidManifest.xml` — launcher and landscape app configuration
- `artifacts/LegendsOfAetheria.apk` — debug-signed build

Application ID: `com.aetheria.game` · Minimum Android version: 6.0 (API 23) · Target SDK: 35.

## Licensing

No license file was supplied with the original game, so this repository intentionally does not add a reuse license. Public visibility alone does not grant permission to reuse the game code or assets.
