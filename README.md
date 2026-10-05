# Legends of Aetheria — Android

An Android wrapper for the supplied, self-contained **Legends of Aetheria** HTML game. The app runs the game locally in a fullscreen landscape WebView; gameplay does not require an internet connection.

## Play

- Drag on the **left half** of the screen to move.
- Use the round on-screen buttons for attack, dodge, spells, interaction, inventory, and pause.
- The opening menu starts the journey.

## Build

Requirements: JDK 17 or newer and Android SDK Platform 35 with Build Tools 35.0.0.

```sh
./gradlew assembleDebug
```

The debug APK is created at `app/build/outputs/apk/debug/app-debug.apk`. A copy of the currently built APK is included at [`artifacts/LegendsOfAetheria.apk`](artifacts/LegendsOfAetheria.apk).

## Project layout

- `app/src/main/assets/index.html` — bundled game (HTML, CSS, and JavaScript)
- `app/src/main/java/com/aetheria/game/MainActivity.java` — native Android WebView shell
- `app/src/main/AndroidManifest.xml` — launcher and landscape app configuration
- `artifacts/LegendsOfAetheria.apk` — debug-signed installable build

Application ID: `com.aetheria.game` · Minimum Android version: 6.0 (API 23) · Target SDK: 35.

## Licensing

No license file was supplied with the original game, so this repository intentionally does not add a reuse license. Public visibility alone does not grant permission to reuse the game code or assets.
