# Changelog

All notable GeoBait updates and patches are listed here.

## 2026-06-12

- Made jump pad and jump orb hitboxes invisible while keeping the larger collision areas active.

## 2026-06-11

- Added eight more preset maps.
  - `Practice Trail`
  - `Cloud Steps`
  - `Medium Maze`
  - `Jet Homework`
  - `Hard Orbit`
  - `Hard Jet Factory`
  - `Ultra Hard Overclock`
  - `Final Boss Rush`

## 2026-06-10

- Added a special win screen for the hardest maps.
  - Clearing a Merciless map now opens a dedicated completion overlay.
- Added background music.
  - Added `unity-remake.mp3` as the game music.
  - Added a Music/Mute control.
  - Added a thanks credit to TheFatRat and npph5412.
- Finished independent CPU crash behavior.
  - Bots now respawn on their own after crashes.
  - Bot crash chances are 80%, 50%, and 10%.
  - Player deaths no longer reset bot state unless the level is restarted.
- Improved CPU racers so they behave more like real players.
  - Bots now use gravity, velocity, collisions, jumping, and jet thrust.
  - Bots can use portals, jump pads, and jump orbs.
  - Bots now react to hazards and gaps instead of sliding in a straight line.
- Added local multiplayer-style bot racing.
  - Added a `Bot race` selector with Off, 1 bot, and 3 bots.
  - Added translucent ghost racers with names.
  - Added bot progress to the HUD.
- Added more player customization features.
  - Added a player name tag.
  - Added visual size options.
  - Added spin style options.
  - Added an optional player glow.

## 2026-06-09

- Added an easier-to-navigate sidebar.
  - Grouped controls into Run, Maps, Build, Modes, Character, and Help sections.
  - Added sticky section links at the top of the control panel.
  - Moved custom-level controls into a dedicated Build section.
- Fixed floating double-jump orbs.
  - Jump orbs now activate in both Graphing calculator and Regular Geometry Dash play styles.
  - Updated the orb achievement label so successful orb hits are easier to confirm.
- Added ten new preset maps across the difficulty ladder.
  - Easy: `Easy Picnic`, `Easy Stair Jam`
  - Medium: `Medium Bounce Class`, `Medium Jet Quiz`
  - Hard: `Hard Spike Lab`, `Hard Portal Drill`
  - Ultra Hard: `Ultra Hard Needle Run`, `Ultra Hard Jet Razor`
  - Kys: `kys`, `kill ur self`
- Added more gameplay and cosmetic extras.
  - Added a `Random` map button.
  - Added HUD stats for attempts, deaths, and best progress.
  - Added an optional character trail effect that saves in the browser.
- Added a make-your-own-character feature.
  - Added a character image uploader for custom PNG/JPG/WebP/GIF characters.
  - Added body, eye, and accent color controls for drawing a custom cube without an uploaded image.
  - Custom character settings save in the browser and can be reset.
- Added Practice mode with checkpoints.
  - Added a `Practice` toggle next to the cheat controls.
  - Practice starts with a saved start checkpoint and saves later checkpoint markers as you pass them.
  - Death in Practice mode respawns at the latest checkpoint instead of ending the run.
  - Practice respawns keep the current player mode, touched portals, touched jump orbs, and cheat state.
  - Reached checkpoints turn green so the active practice route is visible.
- Added six medium-difficulty maps between the beginner and hard sets.
  - `Midnight Blocks`
  - `Pad Alley`
  - `Orb Bridge`
  - `Starter Gauntlet`
  - `Mini Jet Mix`
  - `Rising Rhythm`
- Added CSS polish.
  - Added custom scrollbars for long editor panels.
  - Improved Regular Geometry Dash mode HUD and panel contrast.
  - Restyled Regular Geometry Dash mode buttons and form fields so they feel less like the calculator skin.
  - Added stronger keyboard focus outlines.
  - Improved mobile layout for controls, cheat input, and editor rows.
- Fixed floating jump pads and orbs by adding larger interaction hitboxes.
  - Bounce pads now use a wider/taller hitbox than their orange visual shape.
  - Jump orbs now use a larger circular-area hitbox so midair Space presses are easier to catch.
  - Graphing-calculator mode shows subtle hitbox outlines for pads and orbs while Regular Geometry Dash mode keeps the visuals clean.
- Fixed a regression where bounce pads only worked in Regular Geometry Dash mode.
- Fixed double jump by adding an explicit one-use midair jump in Regular Geometry Dash mode.
  - Landing resets the extra jump.
  - Bounce pads and jump orbs refresh the extra jump.

## 2026-06-06

- Added six beginner maps easier than `Stereo-Style Full Course`.
  - `First Steps`
  - `Tiny Hops`
  - `Soft Slope`
  - `Pad Practice`
  - `Orb Intro`
  - `Easy Flight`
- Added Regular Geometry Dash style jump pads.
  - Added a `Jump pads` editor field.
  - Orange bounce pads now launch the player automatically on contact.
  - Added `down,x,y` jump pads for upside-down pad placement.
- Added Regular Geometry Dash style jump orbs.
  - Added a `Jump orbs` editor field.
  - Floating ring/orb objects only launch the player when Space is pressed while touching them.
  - Added `down,x,y` jump orbs for downward orb boosts.
- Fixed bounce pad collision ordering so ground and aerial pads do not get treated like lethal platform hits.
- Added keyboard repeat protection so holding Space does not repeatedly trigger starts, jumps, or jump orbs.
- Stopped jet thrust automatically when the game is paused, won, reset, or the player dies.
- Added upside-down spike support with `down,x,y` spike notation.
- Added normal and upside-down pads/spikes to several presets.
- Confirmed floating platforms work in Regular Geometry Dash mode because raised platform paths and preset air blocks remain solid.
- Added four harder preset maps.
  - `Orb Gauntlet`
  - `Ceiling Grinder`
  - `Jet Knife`
  - `Impossible Homework`
  - These use tighter spike spacing, more jump orbs, auto pads, upside-down hazards, floating platforms, and faster speeds.

## 2026-06-05

- Added this changelog to track updates, patches, and the date each change was added.
- Added a `Play style` option.
  - `Graphing calculator` keeps the calculator skin, graph grid, physics options, and level builder.
  - `Regular Geometry Dash` hides physics controls and level-building tools, locks gameplay to arcade physics, and switches to a simpler arcade visual style.
- Added a custom cube character texture from `cube-texture.png`.
  - Copied the texture into `public/cube-texture.png`.
  - Updated the cube renderer to draw the texture and added a small bounce/pulse animation while running.
- Added a transparent resized copy of the cube texture.
  - Created `public/cube-texture-transparent.png`.
  - Removed the white background from the copy.
  - Resized the cube art so it fills the PNG bounds more closely.
  - Updated the character renderer to use the transparent copy.
  - Kept the original `public/cube-texture.png` available as an unchanged source copy.
- Reworked the preset levels so they play noticeably differently.
  - Replaced repeated stair-step style maps with distinct layouts: flat spike sprint, mountain climb, jet tunnel, portal lab, drop recovery, tiny platforms, wave ridge, switchback run, and a longer mixed final.
- Tuned jet controls to be easier to use.
  - Reduced arcade jet thrust so tapping/holding is less twitchy.
  - Added light jet drag for smoother vertical movement.
  - Lowered jet max vertical speed.
  - Opened up the `Jet Tunnel` hazard spacing and slightly reduced its speed.
- Made levels more distinct again and upgraded `Final Exam`.
  - Added per-level visual themes for Classic mode and themed platform/hazard colors.
  - Rebuilt `Final Exam` as a much longer demon-style course with tighter spikes, higher speed, and multiple jet sections.
- Renamed the app from GeoDash to GeoBait.
  - Updated the browser title, visible app heading, calculator model label, package metadata, and server startup message.
- Stopped the local development server on request.
- Removed gravity manipulation.
  - Removed flip portals from presets and custom portal parsing.
  - Simplified collisions and rendering so gravity always points downward.
  - Updated portal help text to only show `jet` and `cube` portals.
- Added the `soap` cheat.
  - When cheats are enabled, entering `soap` turns on low gravity and low jump for the current run.
  - Tuned `soap` to set gravity to `10` and jump to `80`.

## 2026-06-03

- Started the local GeoBait server with `npm start`, serving the game at `http://localhost:3000`.
- Patched the Stereo-Style Full Course preset so the jump height is possible.
  - Raised the preset jump value from `760` to `900`.
  - Updated arcade physics so Regular Geometry Dash mode uses each level's configured `gravity` and `jump` values.
- Restyled the game to look like a graphing calculator.
  - Added a calculator model label.
  - Updated the side panel to resemble a calculator case and keypad.
  - Changed inputs and text areas to use a green LCD-style display.
  - Updated the playfield with graph-paper colors, x/y axes, coordinate tick labels, plotted point labels, and calculator-screen geometry colors.
- Added cheats.
  - Added a `Cheats` toggle.
  - Added a cheat code input.
  - Added the `fundamental` cheat code, which automatically completes the current level when cheats are enabled.
- Added five new preset levels.
  - `Parabola Practice`
  - `Slope Intercept`
  - `Function Flight`
  - `Quadrant Climb`
  - `Final Exam`
