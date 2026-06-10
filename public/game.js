"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const cubeTexture = new Image();
cubeTexture.src = "/cube-texture-transparent.png";
const characterImage = new Image();

const ui = {
  levelName: document.getElementById("levelName"),
  formulaLabel: document.getElementById("formulaLabel"),
  speedLabel: document.getElementById("speedLabel"),
  progressLabel: document.getElementById("progressLabel"),
  botProgressLabel: document.getElementById("botProgressLabel"),
  status: document.getElementById("status"),
  achievement: document.getElementById("achievement"),
  achievementName: document.getElementById("achievementName"),
  achievementDescription: document.getElementById("achievementDescription"),
  playPause: document.getElementById("playPause"),
  jumpButton: document.getElementById("jumpButton"),
  restart: document.getElementById("restart"),
  nextLevel: document.getElementById("nextLevel"),
  randomLevel: document.getElementById("randomLevel"),
  botCountSelect: document.getElementById("botCountSelect"),
  levelSelect: document.getElementById("levelSelect"),
  playStyle: document.getElementById("playStyle"),
  physicsMode: document.getElementById("physicsMode"),
  platformInput: document.getElementById("platformInput"),
  hazardInput: document.getElementById("hazardInput"),
  portalInput: document.getElementById("portalInput"),
  jumpPadInput: document.getElementById("jumpPadInput"),
  jumpOrbInput: document.getElementById("jumpOrbInput"),
  gravityInput: document.getElementById("gravityInput"),
  jumpInput: document.getElementById("jumpInput"),
  applyLevel: document.getElementById("applyLevel"),
  addPointMode: document.getElementById("addPointMode"),
  undoPoint: document.getElementById("undoPoint"),
  practiceMode: document.getElementById("practiceMode"),
  cheatsEnabled: document.getElementById("cheatsEnabled"),
  cheatCodeInput: document.getElementById("cheatCodeInput"),
  attemptLabel: document.getElementById("attemptLabel"),
  deathLabel: document.getElementById("deathLabel"),
  bestLabel: document.getElementById("bestLabel"),
  trailEnabled: document.getElementById("trailEnabled"),
  characterUpload: document.getElementById("characterUpload"),
  playerNameInput: document.getElementById("playerNameInput"),
  playerSizeSelect: document.getElementById("playerSizeSelect"),
  playerSpinSelect: document.getElementById("playerSpinSelect"),
  playerGlowEnabled: document.getElementById("playerGlowEnabled"),
  characterBodyColor: document.getElementById("characterBodyColor"),
  characterEyeColor: document.getElementById("characterEyeColor"),
  characterAccentColor: document.getElementById("characterAccentColor"),
  resetCharacter: document.getElementById("resetCharacter")
};

const TILE = 54;
const WORLD_HEIGHT = 720;
const PLAYER_SIZE = 36;
const FLOOR_Y = 610;
const BLOCK_H = 30;
const POINT_SCALE = TILE;
const START_X = 120;
const JUMP_BUFFER = 0.14;
const COYOTE_TIME = 0.09;
const CEILING_Y = 74;
const JET_THRUST = 2800;
const ARCADE_GRAVITY = 1850;
const ARCADE_JUMP = 800;
const ARCADE_JET_THRUST = 2050;
const ARCADE_SPEED = 430;
const JET_DRAG = 0.9;
const SOAP_GRAVITY = 10;
const SOAP_JUMP = 80;
const JUMP_PAD_SIZE = 34;
const JUMP_PAD_POWER = 880;
const JUMP_PAD_HITBOX_W = 58;
const JUMP_PAD_HITBOX_H = 42;
const JUMP_ORB_SIZE = 34;
const JUMP_ORB_POWER = 820;
const JUMP_ORB_HITBOX = 58;
const CHARACTER_STORAGE_KEY = "geobait-character-v1";
const TRAIL_STORAGE_KEY = "geobait-trail-enabled";
const TRAIL_MAX_POINTS = 24;
const BOT_COLORS = ["#ff6b8a", "#7dff9a", "#ffd166"];
const BOT_NAMES = ["Byte", "Delta", "Nova"];
const defaultCharacter = {
  image: "",
  body: "#28d8ff",
  eyes: "#101115",
  accent: "#ffd166",
  name: "",
  size: "1",
  spin: "normal",
  glow: false
};
let character = { ...defaultCharacter };
const runStats = {
  attempts: 0,
  deaths: 0,
  wins: 0,
  bestProgress: 0
};

const examples = [
  {
    name: "Stereo-Style Full Course",
    points: "0,0\n10,0\n14,1\n18,1\n22,0\n30,0\n35,1\n40,1\n45,0\n52,0\n56,2\n62,2\n67,1\n73,1\n79,0\n88,0\n94,1\n101,1\n108,0\n116,0\n122,2\n128,2\n134,3\n142,3\n150,2\n158,2\n166,1\n174,1\n182,0\n192,0",
    spikes: "6,0\n12,0\n20,0\n27,0\n33,0\n43,1\n50,0\n55,1\n64,2\n71,1\n77,0\n84,0\n91,0\n99,1\n106,0\n114,0\n120,1\n131,2\n139,3\n147,2\n155,2\n163,1\n171,1\n180,0\n188,0",
    portals: "jet,82,1\ncube,112,1",
    jumpPads: "38,1\ndown,140,5",
    jumpOrbs: "58,3\n126,4",
    speed: 430,
    gravity: 1900,
    jump: 900
  },
  {
    name: "First Steps",
    points: "0,0\n32,0",
    spikes: "14,0\n25,0",
    portals: "",
    speed: 360,
    gravity: 1750,
    jump: 760
  },
  {
    name: "Tiny Hops",
    points: "0,0\n8,0\n13,1\n19,1\n25,0\n34,0",
    spikes: "10,0\n29,0",
    portals: "",
    speed: 370,
    gravity: 1750,
    jump: 780
  },
  {
    name: "Soft Slope",
    points: "0,0\n8,0\n15,1\n24,1\n32,0\n42,0",
    spikes: "12,0\n27,1\n37,0",
    portals: "",
    speed: 380,
    gravity: 1800,
    jump: 800
  },
  {
    name: "Pad Practice",
    points: "0,0\n10,0\n16,1\n24,1\n32,0\n42,0",
    spikes: "12,0\n28,1\n38,0",
    portals: "",
    jumpPads: "15,0",
    speed: 385,
    gravity: 1800,
    jump: 800
  },
  {
    name: "Orb Intro",
    points: "0,0\n9,0\n15,1\n22,1\n30,0\n42,0",
    spikes: "11,0\n25,1\n36,0",
    portals: "",
    jumpOrbs: "18,3",
    speed: 390,
    gravity: 1800,
    jump: 810
  },
  {
    name: "Easy Flight",
    points: "0,0\n10,0\n18,1\n30,1\n40,0\n52,0",
    spikes: "8,0\n34,1\n47,0",
    portals: "jet,16,1\ncube,32,1",
    speed: 370,
    gravity: 1750,
    jump: 780
  },
  {
    name: "Midnight Blocks",
    points: "0,0\n8,0\n13,1\n19,1\n25,0\n32,0\n38,2\n45,2\n52,1\n60,1\n68,0",
    spikes: "9,0\n21,1\n29,0\n41,2\n55,1\n64,0",
    portals: "",
    jumpPads: "36,0",
    jumpOrbs: "16,3\n48,4",
    speed: 410,
    gravity: 1850,
    jump: 850
  },
  {
    name: "Pad Alley",
    points: "0,0\n8,0\n14,1\n22,1\n28,0\n36,0\n42,2\n50,2\n58,0\n68,0",
    spikes: "10,0\n18,1\n31,0\n46,2\n54,0\n63,0",
    portals: "",
    jumpPads: "13,0\n40,0",
    jumpOrbs: "24,3\n52,4",
    speed: 420,
    gravity: 1900,
    jump: 860
  },
  {
    name: "Orb Bridge",
    points: "0,0\n7,0\n12,2\n18,2\n24,0\n31,0\n37,3\n44,3\n51,1\n59,1\n68,0",
    spikes: "8,0\n15,2\n22,2\n29,0\n40,3\n48,1\n63,0",
    portals: "",
    jumpPads: "35,0",
    jumpOrbs: "13,4\n26,3\n42,5\n55,3",
    speed: 425,
    gravity: 1900,
    jump: 870
  },
  {
    name: "Starter Gauntlet",
    points: "0,0\n8,0\n12,1\n18,1\n23,0\n30,0\n36,2\n43,2\n49,0\n56,0\n62,1\n70,1\n80,0",
    spikes: "7,0\n14,1\n21,0\n28,0\n39,2\n47,0\n54,0\n65,1\n75,0",
    portals: "",
    jumpPads: "34,0\n60,0",
    jumpOrbs: "16,3\n45,4\n67,3",
    speed: 430,
    gravity: 1950,
    jump: 880
  },
  {
    name: "Mini Jet Mix",
    points: "0,0\n8,0\n14,1\n24,1\n32,2\n44,2\n52,1\n62,1\n72,0",
    spikes: "7,0\n18,1\n28,1\n36,2\n48,2\n58,1\n67,0",
    portals: "jet,22,1\ncube,50,1",
    jumpOrbs: "15,3\n56,3",
    speed: 415,
    gravity: 1850,
    jump: 840
  },
  {
    name: "Rising Rhythm",
    points: "0,0\n6,0\n11,1\n16,2\n23,2\n29,1\n36,1\n42,3\n50,3\n58,1\n66,1\n76,0",
    spikes: "8,0\n18,2\n26,2\n34,1\n45,3\n54,1\n62,1\n71,0",
    portals: "",
    jumpPads: "40,1",
    jumpOrbs: "13,3\n31,3\n52,5\n68,3",
    speed: 425,
    gravity: 1900,
    jump: 880
  },
  {
    name: "Spike Sprint",
    points: "0,0\n52,0",
    spikes: "5,0\n9,0\n14,0\n20,0\n25,0\n31,0\n37,0\n43,0\n48,0",
    portals: "",
    speed: 455,
    gravity: 1900,
    jump: 860
  },
  {
    name: "Mountain Pass",
    points: "0,0\n6,0\n10,1\n14,2\n18,3\n24,4\n31,4\n36,3\n42,2\n48,1\n56,0\n66,0",
    spikes: "8,0\n16,2\n22,3\n33,4\n40,2\n52,0\n61,0",
    portals: "",
    jumpPads: "28,4",
    jumpOrbs: "18,4",
    speed: 420,
    gravity: 1850,
    jump: 900
  },
  {
    name: "Jet Tunnel",
    points: "0,0\n10,0\n18,1\n30,1\n38,2\n50,2\n58,1\n68,1\n76,0\n88,0",
    spikes: "7,0\n24,1\n45,2\n64,1\n82,0",
    portals: "jet,12,1\ncube,70,1",
    speed: 420,
    gravity: 1900,
    jump: 820
  },
  {
    name: "Portal Lab",
    points: "0,0\n7,0\n13,1\n19,1\n25,2\n34,2\n41,1\n49,1\n57,0\n68,0",
    spikes: "9,0\n17,1\n28,2\ndown,33,3\n36,2\n46,1\n61,0",
    portals: "jet,51,1\ncube,62,0",
    jumpPads: "22,2\ndown,39,4",
    jumpOrbs: "31,3",
    speed: 450,
    gravity: 2000,
    jump: 860
  },
  {
    name: "Drop Recovery",
    points: "0,0\n8,0\n14,3\n22,3\n30,1\n38,1\n45,4\n54,4\n63,2\n73,2\n84,0",
    spikes: "10,0\n18,3\n27,1\n34,1\n49,4\n59,2\n69,2\n79,0",
    portals: "jet,32,1\ncube,60,2",
    speed: 430,
    gravity: 1850,
    jump: 920
  },
  {
    name: "Tiny Platforms",
    points: "0,0\n6,0\n10,1\n13,1\n17,0\n23,0\n27,2\n30,2\n34,0\n40,0\n44,3\n48,3\n54,1\n60,1\n68,0",
    spikes: "8,0\n15,1\n21,0\n32,2\n38,0\ndown,46,5\n50,3\n57,1\n64,0",
    portals: "",
    jumpPads: "25,1\n42,2",
    jumpOrbs: "28,3\ndown,46,5",
    speed: 440,
    gravity: 1950,
    jump: 900
  },
  {
    name: "Wave Ridge",
    points: "0,0\n8,0\n13,2\n18,0\n25,0\n31,3\n37,1\n44,1\n50,4\n58,2\n66,2\n74,0",
    spikes: "9,0\n15,2\n22,0\n34,3\n41,1\n53,4\n62,2\n70,0",
    portals: "jet,28,2\ncube,56,2",
    speed: 460,
    gravity: 2000,
    jump: 930
  },
  {
    name: "Switchback Run",
    points: "0,0\n9,0\n15,2\n23,2\n29,0\n37,0\n43,3\n51,3\n57,1\n66,1\n74,0",
    spikes: "11,0\n19,2\n31,0\n40,0\ndown,45,5\n47,3\n54,1\n70,0",
    portals: "jet,43,3\ncube,63,1",
    jumpPads: "36,0\ndown,52,4",
    jumpOrbs: "49,5",
    speed: 455,
    gravity: 2050,
    jump: 900
  },
  {
    name: "Final Exam",
    points: "0,0\n6,0\n10,1\n14,0\n18,2\n23,2\n27,0\n33,0\n37,3\n43,3\n47,1\n52,1\n56,4\n62,4\n67,2\n72,2\n77,0\n84,0\n88,2\n94,2\n98,0\n104,0\n109,3\n115,3\n120,1\n126,1\n132,4\n139,4\n145,2\n151,2\n158,0\n168,0",
    spikes: "5,0\n8,0\n12,1\n16,0\n21,2\n25,2\n30,0\n35,0\n40,3\n45,3\n50,1\n54,1\ndown,57,6\n59,4\n64,4\n70,2\n75,2\n80,0\n86,0\n91,2\n96,2\n101,0\n106,0\n112,3\n118,3\n123,1\n129,1\ndown,133,6\n136,4\n142,4\n148,2\n154,2\n162,0",
    portals: "jet,35,2\ncube,52,1\njet,106,2\ncube,124,1",
    jumpPads: "19,1\n31,0\n83,0\ndown,121,4\n156,2",
    jumpOrbs: "39,5\n69,4\n113,5\ndown,137,6",
    speed: 505,
    gravity: 2150,
    jump: 960
  },
  {
    name: "Orb Gauntlet",
    points: "0,0\n5,0\n9,1\n13,0\n18,2\n23,0\n29,3\n35,1\n41,4\n47,2\n54,0\n62,0\n67,2\n73,2\n79,0\n88,0",
    spikes: "6,0\n11,1\n15,0\n21,2\n26,0\n32,3\n38,1\ndown,44,6\n50,2\n57,0\n65,0\n71,2\n82,0",
    portals: "",
    jumpPads: "17,0\n53,0",
    jumpOrbs: "10,3\n20,4\n31,5\n42,6\n68,4\ndown,76,5",
    speed: 510,
    gravity: 2150,
    jump: 950
  },
  {
    name: "Ceiling Grinder",
    points: "0,0\n7,0\n12,3\n18,3\n24,1\n31,1\n37,4\n44,4\n50,2\n57,2\n64,0\n72,0\n78,3\n86,3\n94,1\n104,1",
    spikes: "8,0\n15,3\ndown,20,5\n27,1\n34,1\ndown,42,6\n47,4\n54,2\n61,2\n70,0\ndown,82,5\n90,1\n99,1",
    portals: "jet,30,1\ncube,55,2",
    jumpPads: "12,3\ndown,40,5\n76,0",
    jumpOrbs: "23,5\ndown,48,6\n68,3\n88,5",
    speed: 515,
    gravity: 2200,
    jump: 970
  },
  {
    name: "Jet Knife",
    points: "0,0\n8,0\n14,1\n26,1\n34,2\n46,2\n54,3\n66,3\n74,1\n86,1\n94,0\n106,0",
    spikes: "6,0\n16,1\n22,1\ndown,30,3\n38,2\n44,2\ndown,52,5\n60,3\n64,3\n78,1\n84,1\n98,0",
    portals: "jet,12,1\ncube,88,1",
    jumpPads: "",
    jumpOrbs: "28,3\n50,5\ndown,70,5\n92,3",
    speed: 525,
    gravity: 2100,
    jump: 940
  },
  {
    name: "Impossible Homework",
    points: "0,0\n5,0\n9,2\n13,0\n17,3\n22,1\n27,4\n33,2\n39,0\n45,3\n51,1\n57,4\n64,2\n71,0\n79,0\n85,3\n92,1\n100,4\n109,0\n120,0",
    spikes: "4,0\n7,0\n11,2\n15,0\n20,3\n24,1\n30,4\ndown,35,6\n37,2\n42,0\n48,3\n54,1\n60,4\n67,2\n74,0\n82,0\ndown,89,5\n96,1\n104,4\n113,0",
    portals: "jet,43,2\ncube,63,2\njet,84,2\ncube,103,2",
    jumpPads: "18,1\n32,2\ndown,58,5\n78,0\n111,0",
    jumpOrbs: "10,4\n26,5\n46,5\ndown,56,6\n72,3\n87,5\n99,6\ndown,106,5",
    speed: 540,
    gravity: 2250,
    jump: 980
  },
  {
    name: "Easy Picnic",
    points: "0,0\n12,0\n20,1\n30,1\n40,0\n54,0",
    spikes: "16,0\n35,1\n48,0",
    portals: "",
    jumpPads: "28,1",
    jumpOrbs: "",
    speed: 365,
    gravity: 1750,
    jump: 780
  },
  {
    name: "Easy Stair Jam",
    points: "0,0\n9,0\n15,1\n24,1\n31,2\n40,2\n48,1\n58,1\n70,0",
    spikes: "12,0\n27,1\n43,2\n64,0",
    portals: "",
    jumpPads: "46,1",
    jumpOrbs: "33,4",
    speed: 385,
    gravity: 1800,
    jump: 820
  },
  {
    name: "Medium Bounce Class",
    points: "0,0\n8,0\n13,1\n20,1\n27,0\n35,0\n41,2\n49,2\n57,1\n66,1\n78,0",
    spikes: "10,0\n17,1\n30,0\n45,2\n54,1\n71,0",
    portals: "",
    jumpPads: "12,0\n39,0",
    jumpOrbs: "24,3\n51,4",
    speed: 430,
    gravity: 1900,
    jump: 870
  },
  {
    name: "Medium Jet Quiz",
    points: "0,0\n10,0\n18,1\n30,1\n38,2\n50,2\n58,1\n70,1\n82,0",
    spikes: "8,0\n22,1\n34,1\n43,2\n62,1\n76,0",
    portals: "jet,20,1\ncube,56,1",
    jumpPads: "16,0",
    jumpOrbs: "64,3",
    speed: 425,
    gravity: 1900,
    jump: 850
  },
  {
    name: "Hard Spike Lab",
    points: "0,0\n6,0\n11,1\n17,0\n23,2\n30,2\n36,0\n43,0\n49,3\n56,3\n63,1\n72,1\n84,0",
    spikes: "7,0\n13,1\n19,0\n26,2\n33,2\n39,0\n46,0\n52,3\ndown,58,5\n66,1\n78,0",
    portals: "",
    jumpPads: "22,1\n47,0",
    jumpOrbs: "15,3\n55,5\n69,3",
    speed: 470,
    gravity: 2050,
    jump: 920
  },
  {
    name: "Hard Portal Drill",
    points: "0,0\n7,0\n13,2\n20,2\n27,0\n35,0\n42,3\n50,3\n58,1\n67,1\n76,2\n86,2\n98,0",
    spikes: "9,0\n16,2\n24,2\n31,0\n39,0\n45,3\n54,1\n63,1\ndown,80,5\n91,0",
    portals: "jet,33,1\ncube,60,1",
    jumpPads: "12,1\ndown,49,5\n74,1",
    jumpOrbs: "29,3\n52,5\n84,4",
    speed: 480,
    gravity: 2100,
    jump: 930
  },
  {
    name: "Ultra Hard Needle Run",
    points: "0,0\n5,0\n9,1\n14,0\n19,2\n25,2\n31,0\n37,0\n43,3\n50,3\n56,1\n62,1\n68,4\n75,4\n82,2\n90,2\n100,0",
    spikes: "4,0\n7,0\n11,1\n16,0\n22,2\n28,2\n34,0\n40,0\n46,3\ndown,52,5\n59,1\n65,1\n71,4\n78,4\n86,2\n94,0",
    portals: "",
    jumpPads: "18,1\n42,0\n67,2",
    jumpOrbs: "10,3\n32,3\n54,5\n80,5",
    speed: 525,
    gravity: 2200,
    jump: 970
  },
  {
    name: "Ultra Hard Jet Razor",
    points: "0,0\n8,0\n14,1\n24,1\n30,3\n40,3\n46,1\n56,1\n63,4\n74,4\n82,2\n94,2\n106,0",
    spikes: "6,0\n17,1\ndown,27,3\n34,3\n43,3\n50,1\ndown,60,5\n68,4\n78,4\n88,2\n100,0",
    portals: "jet,12,1\ncube,52,1\njet,70,3\ncube,96,2",
    jumpPads: "62,1",
    jumpOrbs: "28,4\n58,3\n84,5",
    speed: 535,
    gravity: 2200,
    jump: 960
  },
  {
    name: "Kill urself",
    points: "0,0\n5,0\n9,2\n13,0\n18,3\n23,1\n28,4\n34,2\n40,0\n46,3\n52,1\n58,4\n65,2\n72,0\n79,3\n86,1\n94,4\n103,2\n112,0\n123,0",
    spikes: "4,0\n7,0\n11,2\n15,0\n20,3\n25,1\n31,4\ndown,36,6\n38,2\n43,0\n49,3\n55,1\n61,4\n68,2\n75,0\n82,3\n90,1\n98,4\n107,2\n117,0",
    portals: "jet,41,2\ncube,64,2\njet,80,2\ncube,104,2",
    jumpPads: "17,1\n33,2\ndown,57,5\n73,0\n110,0",
    jumpOrbs: "10,4\n27,6\n47,5\ndown,59,6\n70,4\n88,5\n101,6\ndown,108,5",
    speed: 555,
    gravity: 2300,
    jump: 990
  },
  {
    name: "kys",
    points: "0,0\n4,0\n8,1\n12,0\n16,2\n21,2\n26,0\n31,0\n36,3\n42,3\n47,1\n53,1\n58,4\n64,4\n70,2\n76,2\n82,0\n89,0\n95,3\n102,1\n110,4\n120,0\n132,0",
    spikes: "3,0\n6,0\n10,1\n14,0\n18,2\n24,2\n28,0\n33,0\n39,3\n44,3\n50,1\n55,1\ndown,60,6\n62,4\n67,4\n73,2\n79,2\n85,0\n92,0\n98,3\n106,1\n114,4\n125,0",
    portals: "jet,30,1\ncube,50,1\njet,83,1\ncube,108,2",
    jumpPads: "15,1\n35,0\n57,2\ndown,72,5\n94,0\n118,0",
    jumpOrbs: "9,3\n23,4\n41,5\n63,6\ndown,76,5\n90,3\n103,5\n116,6",
    speed: 565,
    gravity: 2350,
    jump: 1000
  }
];

const DEFAULT_THEME = {
  skyTop: "#182452",
  skyMid: "#10141f",
  skyBottom: "#090b10",
  grid: "rgba(255, 255, 255, 0.06)",
  platform: "#303746",
  platformStroke: "#101115",
  accent: "#28d8ff",
  hazard: "#ff5368",
  checkpoint: "rgba(255, 209, 102, 0.82)",
  goal: "#7dff9a",
  portalJet: "#28d8ff",
  portalCube: "#7dff9a",
  graphPlatform: "#26361d",
  graphAccent: "#4d693a",
  graphHazard: "#6f241f",
  graphGoal: "#1f4f2d"
};

const LEVEL_THEMES = {
  "Stereo-Style Full Course": { skyTop: "#1b2456", skyMid: "#10182f", accent: "#32d7ff" },
  "First Steps": { skyTop: "#163b2e", skyMid: "#0c1f19", accent: "#7dff9a", hazard: "#ff8a75" },
  "Tiny Hops": { skyTop: "#1d3657", skyMid: "#0c1828", accent: "#8fd0ff", hazard: "#ff8aa1" },
  "Soft Slope": { skyTop: "#283f19", skyMid: "#111e0b", accent: "#b9ff77", hazard: "#ffb36b" },
  "Pad Practice": { skyTop: "#3f3115", skyMid: "#191309", accent: "#ffd166", hazard: "#ff7a5c" },
  "Orb Intro": { skyTop: "#2d2457", skyMid: "#120f25", accent: "#c7a7ff", hazard: "#ff7bd1" },
  "Easy Flight": { skyTop: "#12364f", skyMid: "#071724", accent: "#5bdcff", hazard: "#ff8a75", portalJet: "#8fe8ff" },
  "Midnight Blocks": { skyTop: "#1b1d4f", skyMid: "#0b0c1f", accent: "#8ea1ff", hazard: "#ff6f91" },
  "Pad Alley": { skyTop: "#4a2f12", skyMid: "#1f1408", accent: "#ffd166", hazard: "#ff8a4a" },
  "Orb Bridge": { skyTop: "#281f58", skyMid: "#100d25", accent: "#caa8ff", hazard: "#ff70c4" },
  "Starter Gauntlet": { skyTop: "#173f3c", skyMid: "#0b1d1c", accent: "#62e0ce", hazard: "#ff6b6b" },
  "Mini Jet Mix": { skyTop: "#0d3354", skyMid: "#061725", accent: "#52d6ff", hazard: "#ff7d7d", portalJet: "#8deaff" },
  "Rising Rhythm": { skyTop: "#283b17", skyMid: "#101b09", accent: "#b7ff68", hazard: "#ff9966" },
  "Spike Sprint": { skyTop: "#3b1017", skyMid: "#1c1115", accent: "#ff5368", hazard: "#ff2f4f" },
  "Mountain Pass": { skyTop: "#24451f", skyMid: "#102315", accent: "#91d36b", goal: "#b9ff77" },
  "Jet Tunnel": { skyTop: "#102e4d", skyMid: "#0b182a", accent: "#46c7ff", portalJet: "#63ddff" },
  "Portal Lab": { skyTop: "#351c57", skyMid: "#181026", accent: "#c77dff", portalJet: "#c77dff" },
  "Drop Recovery": { skyTop: "#4d2f12", skyMid: "#211608", accent: "#ffb545", hazard: "#ff6b35" },
  "Tiny Platforms": { skyTop: "#2d3347", skyMid: "#151822", accent: "#e6ecff", platform: "#222834" },
  "Wave Ridge": { skyTop: "#123d44", skyMid: "#0b2026", accent: "#3ee4cb", portalJet: "#6fffea" },
  "Switchback Run": { skyTop: "#352247", skyMid: "#15101f", accent: "#ffd166", portalJet: "#ffdf7d" },
  "Final Exam": {
    skyTop: "#4b0711",
    skyMid: "#1d0509",
    skyBottom: "#050203",
    grid: "rgba(255, 83, 104, 0.11)",
    platform: "#1d1218",
    platformStroke: "#ff5368",
    accent: "#ff2f4f",
    hazard: "#ff002f",
    checkpoint: "rgba(255, 209, 102, 0.92)",
    goal: "#ffd166",
    portalJet: "#28d8ff",
    portalCube: "#7dff9a",
    graphPlatform: "#36141a",
    graphAccent: "#9b1c31",
    graphHazard: "#d00027",
    graphGoal: "#80551f"
  },
  "Orb Gauntlet": {
    skyTop: "#3b1658",
    skyMid: "#190b27",
    accent: "#d26bff",
    hazard: "#ff4fd8",
    portalJet: "#d26bff",
    graphPlatform: "#33193f",
    graphAccent: "#6c2a88",
    graphHazard: "#9b1b7b"
  },
  "Ceiling Grinder": {
    skyTop: "#40240a",
    skyMid: "#181006",
    accent: "#ffb000",
    hazard: "#ff6b00",
    platformStroke: "#ffb000",
    graphPlatform: "#3a2711",
    graphAccent: "#8a5b16",
    graphHazard: "#a63f00"
  },
  "Jet Knife": {
    skyTop: "#071f3b",
    skyMid: "#050d18",
    accent: "#35d8ff",
    hazard: "#ff365f",
    portalJet: "#7cecff",
    graphPlatform: "#102f42",
    graphAccent: "#1b7b9d",
    graphHazard: "#b82142"
  },
  "Impossible Homework": {
    skyTop: "#080808",
    skyMid: "#200308",
    skyBottom: "#000000",
    grid: "rgba(255, 0, 47, 0.14)",
    platform: "#16080b",
    platformStroke: "#ff0033",
    accent: "#ffffff",
    hazard: "#ff0033",
    checkpoint: "rgba(255, 255, 255, 0.85)",
    goal: "#ffdf5d",
    portalJet: "#44ddff",
    portalCube: "#89ff64",
    graphPlatform: "#2f080d",
    graphAccent: "#d9d9d9",
    graphHazard: "#ff0033",
    graphGoal: "#8a6812"
  }
};

let currentLevelIndex = 0;
let level = null;
let state = null;
let lastTime = performance.now();
let viewWidth = 1280;
let viewHeight = 720;
let editingPoints = false;
let animationTime = 0;

function isClassicMode() {
  return ui.playStyle.value === "classic";
}

function getTheme() {
  return {
    ...DEFAULT_THEME,
    ...(LEVEL_THEMES[level?.name] || {})
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function snap(value) {
  return Math.round(value);
}

function gridToWorld(point) {
  return {
    x: START_X + point.x * POINT_SCALE,
    y: FLOOR_Y - point.y * POINT_SCALE
  };
}

function parsePointList(source) {
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);

  if (lines.length < 2) {
    throw new Error("Add at least two platform points.");
  }

  return lines.map((line, index) => {
    const match = line.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) {
      throw new Error(`Point ${index + 1} must look like x,y.`);
    }

    return {
      x: clamp(snap(Number(match[1])), 0, 260),
      y: clamp(snap(Number(match[2])), 0, 9)
    };
  });
}

function parseSpikeList(source) {
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line, index) => {
    const match = line.match(/^(?:(up|down)\s*,\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/i);
    if (!match) {
      throw new Error(`Spike ${index + 1} must look like x,y or down,x,y.`);
    }

    return {
      orientation: (match[1] || "up").toLowerCase(),
      x: clamp(snap(Number(match[2])), 0, 260),
      y: clamp(snap(Number(match[3])), 0, 9)
    };
  });
}

function parsePortalList(source) {
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line, index) => {
    const match = line.match(/^(jet|cube)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/i);
    if (!match) {
      throw new Error(`Portal ${index + 1} must look like jet,x,y or cube,x,y.`);
    }

    return {
      type: match[1].toLowerCase(),
      x: clamp(snap(Number(match[2])), 0, 260),
      y: clamp(snap(Number(match[3])), 0, 9)
    };
  });
}

function parseJumpPadList(source) {
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line, index) => {
    const match = line.match(/^(?:(up|down)\s*,\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/i);
    if (!match) {
      throw new Error(`Jump pad ${index + 1} must look like x,y or down,x,y.`);
    }

    return {
      orientation: (match[1] || "up").toLowerCase(),
      x: clamp(snap(Number(match[2])), 0, 260),
      y: clamp(snap(Number(match[3])), 0, 9)
    };
  });
}

function parseJumpOrbList(source) {
  const lines = source.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  return lines.map((line, index) => {
    const match = line.match(/^(?:(up|down)\s*,\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/i);
    if (!match) {
      throw new Error(`Jump orb ${index + 1} must look like x,y or down,x,y.`);
    }

    return {
      orientation: (match[1] || "up").toLowerCase(),
      x: clamp(snap(Number(match[2])), 0, 260),
      y: clamp(snap(Number(match[3])), 0, 9)
    };
  });
}

function makeLevel(definition) {
  const points = parsePointList(definition.points);
  const spikePoints = parseSpikeList(definition.spikes);
  const portalPoints = parsePortalList(definition.portals || "");
  const jumpPadPoints = parseJumpPadList(definition.jumpPads || "");
  const jumpOrbPoints = parseJumpOrbList(definition.jumpOrbs || "");
  const platforms = [];
  const hazards = [];
  const portals = [];
  const jumpPads = [];
  const jumpOrbs = [];
  const checkpoints = [];
  const occupied = new Set();

  addPlatformBlock(platforms, occupied, -5, 0, 10, "#303746");

  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];

    if (to.x < from.x) {
      throw new Error("Platform points must move left to right.");
    }

    addLineBlocks(platforms, occupied, from, to);
  }

  for (const point of spikePoints) {
    const world = gridToWorld(point);
    const spike = point.orientation === "down"
      ? makeSpike(world.x + 10, world.y, 34, 40, "down")
      : makeSpike(world.x + 10, world.y - 40, 34, 40, "up");
    if (point.orientation === "down" || !platforms.some((platform) => rectsOverlap({ x: spike.x, y: spike.y, w: spike.w, h: spike.h }, platform))) {
      hazards.push(spike);
    }
  }

  for (const point of portalPoints) {
    const world = gridToWorld(point);
    portals.push({
      type: point.type,
      x: world.x + 7,
      y: world.y - 70,
      w: 40,
      h: 82
    });
  }

  for (const point of jumpPadPoints) {
    const world = gridToWorld(point);
    const x = world.x + 10;
    const y = point.orientation === "down" ? world.y : world.y - 20;
    jumpPads.push({
      orientation: point.orientation,
      x,
      y,
      w: JUMP_PAD_SIZE,
      h: 20,
      hitbox: {
        x: x + JUMP_PAD_SIZE / 2 - JUMP_PAD_HITBOX_W / 2,
        y: y + 10 - JUMP_PAD_HITBOX_H / 2,
        w: JUMP_PAD_HITBOX_W,
        h: JUMP_PAD_HITBOX_H
      }
    });
  }

  for (const point of jumpOrbPoints) {
    const world = gridToWorld(point);
    const x = world.x + 10;
    const y = world.y - 74;
    jumpOrbs.push({
      orientation: point.orientation,
      x,
      y,
      w: JUMP_ORB_SIZE,
      h: JUMP_ORB_SIZE,
      hitbox: {
        x: x + JUMP_ORB_SIZE / 2 - JUMP_ORB_HITBOX / 2,
        y: y + JUMP_ORB_SIZE / 2 - JUMP_ORB_HITBOX / 2,
        w: JUMP_ORB_HITBOX,
        h: JUMP_ORB_HITBOX
      }
    });
  }

  for (let i = 2; i < points.length; i += 3) {
    const world = gridToWorld(points[i]);
    checkpoints.push({ x: world.x + 18, y: world.y - 86 });
  }

  const last = gridToWorld(points[points.length - 1]);
  addPlatformBlock(platforms, occupied, points[points.length - 1].x + 1, points[points.length - 1].y, 7, "#304338");

  return {
    ...definition,
    physicsMode: definition.physicsMode || "arcade",
    points,
    spikePoints,
    portalPoints,
    jumpPadPoints,
    jumpOrbPoints,
    platforms,
    hazards,
    portals,
    jumpPads,
    jumpOrbs,
    checkpoints,
    length: Math.max(last.x + 760, 2600),
    goal: { x: last.x + 420, y: last.y - 160, w: 24, h: 180 }
  };
}

function addLineBlocks(platforms, occupied, from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0) {
    addPlatformBlock(platforms, occupied, from.x, Math.max(from.y, to.y), 1, "#273140");
    return;
  }

  const slope = dy / dx;
  const allowedSlope = Math.abs(slope) <= 1;

  if (!allowedSlope) {
    throw new Error("A line is too steep. Add more points so the path follows physics.");
  }

  for (let x = from.x; x <= to.x; x += 1) {
    const progress = dx === 0 ? 0 : (x - from.x) / dx;
    const y = snap(from.y + dy * progress);
    addPlatformBlock(platforms, occupied, x, y, 1, "#273140");
  }
}

function addPlatformBlock(platforms, occupied, gridX, gridY, gridW, color) {
  for (let i = 0; i < gridW; i += 1) {
    const key = `${gridX + i},${gridY}`;
    if (occupied.has(key)) continue;
    occupied.add(key);

    const world = gridToWorld({ x: gridX + i, y: gridY });
    platforms.push({
      x: world.x,
      y: world.y,
      w: TILE,
      h: BLOCK_H,
      color
    });
  }
}

function makeSpike(x, y, w, h, orientation = "up") {
  return {
    type: "spike",
    orientation,
    x,
    y,
    w,
    h,
    points: orientation === "down"
      ? [
        { x, y },
        { x: x + w / 2, y: y + h },
        { x: x + w, y }
      ]
      : [
        { x, y: y + h },
        { x: x + w / 2, y },
        { x: x + w, y: y + h }
      ]
  };
}

function reset(levelIndex = currentLevelIndex, customDefinition = null) {
  stopJump();
  currentLevelIndex = levelIndex;
  const definition = {
    ...(customDefinition || examples[currentLevelIndex]),
    physicsMode: isClassicMode() ? "arcade" : customDefinition?.physicsMode || ui.physicsMode.value
  };
  level = makeLevel(definition);
  state = {
    running: false,
    won: false,
    dead: false,
    achievementUnlocked: false,
    soapMode: false,
    thrusting: false,
    jumpPadCooldown: 0,
    jumpOrbCooldown: 0,
    doubleJumpAvailable: true,
    practiceCheckpoint: null,
    practiceCheckpointIndex: -1,
    runStarted: false,
    trail: [],
    bots: makeBots(),
    cameraX: 0,
    distance: 0,
    jumpBuffer: 0,
    coyoteTime: COYOTE_TIME,
    player: {
      x: START_X + 12,
      y: FLOOR_Y - PLAYER_SIZE,
      prevX: START_X + 12,
      prevY: FLOOR_Y - PLAYER_SIZE,
      vx: getRunSpeed(),
      vy: 0,
      rotation: 0,
      grounded: true,
      mode: "cube",
      portalsTouched: new Set(),
      jumpOrbsTouched: new Set()
    }
  };
  state.practiceCheckpoint = makePracticeCheckpoint(-1, state.player.x, state.player.y);

  ui.levelName.textContent = level.name;
  ui.formulaLabel.textContent = isClassicMode() ? "classic preset run" : `${level.points.length} points -> ${level.platforms.length} clean blocks`;
  ui.speedLabel.textContent = `${level.physicsMode === "arcade" ? "GD" : "real"} speed ${getRunSpeed()}`;
  ui.progressLabel.textContent = "0%";
  updateRunStats(0);
  updateBotHud();
  ui.playPause.textContent = "Start";
  ui.status.textContent = editingPoints ? "Click the grid to add points" : "Press Start to begin";
  ui.status.classList.toggle("hidden", !editingPoints);
  ui.achievement.classList.add("hidden");
}

function jump() {
  if (!state.running || state.dead || state.won) return;

  if (state.player.mode === "jet") {
    state.thrusting = true;
    return;
  }

  if (triggerJumpOrb()) return;

  state.jumpBuffer = JUMP_BUFFER;

  if (state.player.grounded || state.coyoteTime > 0) {
    applyJump();
  } else if (triggerDoubleJump()) {
    state.jumpBuffer = 0;
  }
}

function applyJump() {
  state.player.vy = -getJumpPower();
  state.player.grounded = false;
  state.doubleJumpAvailable = true;
  state.jumpBuffer = 0;
}

function stopJump() {
  if (!state) return;

  state.thrusting = false;
}

function toggleRun() {
  if (state.dead || state.won) {
    reset(currentLevelIndex);
    return;
  }

  const shouldStart = !state.running;
  state.running = shouldStart;
  if (shouldStart && !state.runStarted) {
    state.runStarted = true;
    runStats.attempts += 1;
    updateRunStats();
  }
  if (!state.running) {
    stopJump();
  }
  ui.playPause.textContent = state.running ? "Pause" : "Start";
  ui.status.textContent = state.running ? "" : "Paused";
  ui.status.classList.toggle("hidden", state.running);
}

function update(dt) {
  if (!state.running || state.dead || state.won) return;

  animationTime += dt;
  updateBots(dt);
  state.jumpBuffer = Math.max(0, state.jumpBuffer - dt);
  state.coyoteTime = Math.max(0, state.coyoteTime - dt);
  state.jumpPadCooldown = Math.max(0, state.jumpPadCooldown - dt);
  state.jumpOrbCooldown = Math.max(0, state.jumpOrbCooldown - dt);

  const player = state.player;
  player.prevX = player.x;
  player.prevY = player.y;
  player.vx = getRunSpeed();
  const thrustPower = level.physicsMode === "arcade" ? ARCADE_JET_THRUST : JET_THRUST;
  const thrust = state.thrusting && player.mode === "jet" ? -thrustPower : 0;
  player.vy += (getGravity() + thrust) * dt;
  if (player.mode === "jet") {
    player.vy *= Math.max(0, 1 - JET_DRAG * dt);
  }
  player.vy = clamp(player.vy, -getMaxFallSpeed(), getMaxFallSpeed());
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.rotation += (player.grounded ? 1.8 : 7.5) * dt;
  player.grounded = false;
  pushTrailPoint(player);

  resolvePlatformCollisions(player);
  resolveBounds(player);
  handlePortals(player);
  handleJumpPads(player);
  handleCheckpoints(player);

  if (!state.running || state.dead || state.won) return;

  if (player.grounded) {
    state.coyoteTime = COYOTE_TIME;
    state.doubleJumpAvailable = true;
  }

  if (player.mode === "cube" && player.grounded && state.jumpBuffer > 0) {
    applyJump();
  }

  if (player.y > WORLD_HEIGHT + 200 || hitsHazard(player)) {
    die();
  }

  if (jumpedOverGoal(player)) {
    unlockAchievement("Angler", "No way you jumped it");
    win();
  } else if (rectsOverlap(playerRect(player), level.goal)) {
    win();
  }

  state.cameraX = clamp(player.x - 260, 0, Math.max(0, level.length - viewWidth));
  state.distance = player.x;
  updateRunStats(clamp(Math.floor((player.x / level.length) * 100), 0, 100));
  updateBotHud();
}

function playerRect(player) {
  return { x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
}

function getRunSpeed() {
  return level.physicsMode === "arcade" ? ARCADE_SPEED : level.speed;
}

function getGravity() {
  return level.physicsMode === "arcade" ? Number(level.gravity || ARCADE_GRAVITY) : level.gravity;
}

function getJumpPower() {
  return level.physicsMode === "arcade" ? Number(level.jump || ARCADE_JUMP) : level.jump;
}

function getMaxFallSpeed() {
  if (state.player.mode === "jet") {
    return level.physicsMode === "arcade" ? 520 : 600;
  }

  return level.physicsMode === "arcade" ? 940 : 980;
}

function updateRunStats(progress = null) {
  if (progress !== null) {
    runStats.bestProgress = Math.max(runStats.bestProgress, progress);
    ui.progressLabel.textContent = `${progress}%`;
  }

  ui.attemptLabel.textContent = `attempts ${runStats.attempts}`;
  ui.deathLabel.textContent = `deaths ${runStats.deaths}`;
  ui.bestLabel.textContent = `best ${runStats.bestProgress}%`;
}

function makeBots() {
  const count = Number(ui.botCountSelect?.value || 0);
  return Array.from({ length: count }, (_, index) => ({
    name: BOT_NAMES[index],
    color: BOT_COLORS[index],
    x: START_X - 34 - index * 26,
    y: FLOOR_Y - PLAYER_SIZE,
    speedScale: 0.93 + index * 0.055,
    bobOffset: index * 1.8,
    finished: false
  }));
}

function updateBots(dt) {
  for (const bot of state.bots) {
    if (bot.finished) continue;

    bot.x += getRunSpeed() * bot.speedScale * dt;
    bot.y = getBotY(bot.x, bot.bobOffset);
    if (bot.x >= level.goal.x) {
      bot.finished = true;
      bot.x = level.goal.x;
    }
  }
}

function getBotY(x, offset) {
  const platform = level.platforms
    .filter((item) => x + PLAYER_SIZE / 2 >= item.x - 8 && x + PLAYER_SIZE / 2 <= item.x + item.w + 8)
    .sort((a, b) => a.y - b.y)[0];
  const groundY = platform ? platform.y : FLOOR_Y;
  const hop = Math.abs(Math.sin(animationTime * 7 + offset)) * 18;
  return groundY - PLAYER_SIZE - hop;
}

function updateBotHud() {
  if (!state.bots.length) {
    ui.botProgressLabel.textContent = "bots off";
    return;
  }

  ui.botProgressLabel.textContent = state.bots
    .map((bot) => `${bot.name} ${clamp(Math.floor((bot.x / level.length) * 100), 0, 100)}%`)
    .join(" / ");
}

function pushTrailPoint(player) {
  if (!ui.trailEnabled.checked) {
    state.trail.length = 0;
    return;
  }

  state.trail.push({
    x: player.x + PLAYER_SIZE / 2,
    y: player.y + PLAYER_SIZE / 2,
    mode: player.mode
  });

  if (state.trail.length > TRAIL_MAX_POINTS) {
    state.trail.shift();
  }
}

function resolvePlatformCollisions(player) {
  const rect = playerRect(player);

  for (const platform of level.platforms) {
    if (!rectsOverlap(rect, platform)) continue;

    const prevBottom = player.prevY + PLAYER_SIZE;
    const prevTop = player.prevY;
    const normalLanding = prevBottom <= platform.y + 10 && player.vy >= 0;

    if (normalLanding) {
      player.y = platform.y - PLAYER_SIZE;
      player.vy = 0;
      player.grounded = true;
      rect.y = player.y;
    } else {
      die();
      return;
    }
  }
}

function resolveBounds(player) {
  if (player.y < CEILING_Y) {
    player.y = CEILING_Y;
    player.vy = Math.max(0, player.vy);
  }

  if (player.y + PLAYER_SIZE > FLOOR_Y) {
    player.y = FLOOR_Y - PLAYER_SIZE;
    player.vy = Math.min(0, player.vy);
    player.grounded = true;
  }
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function jumpedOverGoal(player) {
  const prevRight = player.prevX + PLAYER_SIZE;
  const currentRight = player.x + PLAYER_SIZE;
  const bottom = player.y + PLAYER_SIZE;
  const crossedGoal = prevRight <= level.goal.x + level.goal.w && currentRight > level.goal.x + level.goal.w;
  return crossedGoal && bottom < level.goal.y && player.vy >= 0;
}

function hitsHazard(player) {
  const rect = playerRect(player);
  return level.hazards.some((hazard) => rectTriangleOverlap(rect, hazard.points));
}

function handlePortals(player) {
  const rect = playerRect(player);

  for (let i = 0; i < level.portals.length; i += 1) {
    const portal = level.portals[i];
    if (!rectsOverlap(rect, portal) || player.portalsTouched.has(i)) continue;

    player.portalsTouched.add(i);
    if (portal.type === "jet") {
      player.mode = "jet";
      player.grounded = false;
      state.jumpBuffer = 0;
    } else if (portal.type === "cube") {
      player.mode = "cube";
      state.thrusting = false;
    }
  }
}

function handleJumpPads(player) {
  if (state.jumpPadCooldown > 0) return;

  const rect = playerRect(player);
  const pad = level.jumpPads.find((item) => rectsOverlap(rect, item.hitbox));
  if (!pad) return;

  player.vy = pad.orientation === "down" ? JUMP_PAD_POWER : -JUMP_PAD_POWER;
  player.grounded = false;
  state.doubleJumpAvailable = true;
  state.jumpBuffer = 0;
  state.jumpPadCooldown = 0.18;
  unlockAchievement("Bounce", pad.orientation === "down" ? "Upside-down bounce pad hit" : "Bounce pad hit");
}

function triggerJumpOrb() {
  if (state.jumpOrbCooldown > 0) return false;

  const rect = playerRect(state.player);
  for (let i = 0; i < level.jumpOrbs.length; i += 1) {
    const orb = level.jumpOrbs[i];
    if (!rectsOverlap(rect, orb.hitbox) || state.player.jumpOrbsTouched.has(i)) continue;

    state.player.jumpOrbsTouched.add(i);
    state.player.vy = orb.orientation === "down" ? JUMP_ORB_POWER : -JUMP_ORB_POWER;
    state.player.grounded = false;
    state.doubleJumpAvailable = true;
    state.jumpBuffer = 0;
    state.jumpOrbCooldown = 0.18;
    unlockAchievement("Double Jump Orb", orb.orientation === "down" ? "Upside-down jump orb hit" : "Jump orb hit");
    return true;
  }

  return false;
}

function triggerDoubleJump() {
  if (!isClassicMode()) return false;
  if (!state.doubleJumpAvailable || state.player.mode !== "cube") return false;

  state.player.vy = -getJumpPower();
  state.player.grounded = false;
  state.doubleJumpAvailable = false;
  unlockAchievement("Double Jump", "Extra midair jump used");
  return true;
}

function makePracticeCheckpoint(index, x, y) {
  return {
    index,
    x,
    y,
    mode: state.player.mode,
    portalsTouched: new Set(state.player.portalsTouched),
    jumpOrbsTouched: new Set(state.player.jumpOrbsTouched),
    soapMode: state.soapMode
  };
}

function handleCheckpoints(player) {
  if (!ui.practiceMode.checked) return;

  for (let i = 0; i < level.checkpoints.length; i += 1) {
    const marker = level.checkpoints[i];
    if (i <= state.practiceCheckpointIndex || player.x + PLAYER_SIZE < marker.x) continue;

    state.practiceCheckpointIndex = i;
    state.practiceCheckpoint = makePracticeCheckpoint(i, marker.x, marker.y + 86 - PLAYER_SIZE);
    ui.status.textContent = `Checkpoint ${i + 1} saved`;
    ui.status.classList.remove("hidden");
  }
}

function respawnPractice() {
  if (!ui.practiceMode.checked || !state.practiceCheckpoint) return false;

  const checkpoint = state.practiceCheckpoint;
  const player = state.player;
  stopJump();
  player.x = checkpoint.x;
  player.y = checkpoint.y;
  player.prevX = checkpoint.x;
  player.prevY = checkpoint.y;
  player.vx = getRunSpeed();
  player.vy = 0;
  player.rotation = 0;
  player.grounded = true;
  player.mode = checkpoint.mode;
  player.portalsTouched = new Set(checkpoint.portalsTouched);
  player.jumpOrbsTouched = new Set(checkpoint.jumpOrbsTouched);
  state.soapMode = checkpoint.soapMode;
  state.dead = false;
  state.won = false;
  state.running = false;
  state.jumpBuffer = 0;
  state.coyoteTime = COYOTE_TIME;
  state.jumpPadCooldown = 0;
  state.jumpOrbCooldown = 0;
  state.doubleJumpAvailable = true;
  state.cameraX = clamp(player.x - 260, 0, Math.max(0, level.length - viewWidth));
  state.distance = player.x;
  ui.progressLabel.textContent = `${clamp(Math.floor((player.x / level.length) * 100), 0, 100)}%`;
  ui.playPause.textContent = "Start";
  ui.status.textContent = checkpoint.index >= 0 ? `Practice restart at checkpoint ${checkpoint.index + 1}` : "Practice restart at start";
  ui.status.classList.remove("hidden");
  return true;
}

function rectTriangleOverlap(rect, triangle) {
  if (triangle.some((point) => point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h)) {
    return true;
  }

  const rectPoints = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h }
  ];

  return rectPoints.some((point) => pointInTriangle(point, triangle[0], triangle[1], triangle[2]));
}

function pointInTriangle(p, a, b, c) {
  const area = Math.abs((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y));
  const a1 = Math.abs((a.x - p.x) * (b.y - p.y) - (b.x - p.x) * (a.y - p.y));
  const a2 = Math.abs((b.x - p.x) * (c.y - p.y) - (c.x - p.x) * (b.y - p.y));
  const a3 = Math.abs((c.x - p.x) * (a.y - p.y) - (a.x - p.x) * (c.y - p.y));
  return Math.abs(area - (a1 + a2 + a3)) < 0.5;
}

function die() {
  runStats.deaths += 1;
  updateRunStats();
  if (respawnPractice()) return;

  state.dead = true;
  state.running = false;
  stopJump();
  ui.playPause.textContent = "Restart";
  ui.status.textContent = "Physics failed. Press R to rebuild.";
  ui.status.classList.remove("hidden");
}

function win() {
  runStats.wins += 1;
  runStats.bestProgress = 100;
  updateRunStats(100);
  state.won = true;
  state.running = false;
  stopJump();
  ui.playPause.textContent = "Restart";
  ui.status.textContent = "Level complete";
  ui.status.classList.remove("hidden");
}

function unlockAchievement(name, description) {
  if (state.achievementUnlocked) return;

  state.achievementUnlocked = true;
  ui.achievementName.textContent = name;
  ui.achievementDescription.textContent = description;
  ui.achievement.classList.remove("hidden");
}

function submitCheatCode() {
  if (!ui.cheatsEnabled.checked) return;
  const code = ui.cheatCodeInput.value.trim().toLowerCase();
  if (state.dead || state.won) return;

  if (code === "fundamental") {
    state.running = false;
    state.player.x = level.goal.x;
    state.cameraX = clamp(state.player.x - 260, 0, Math.max(0, level.length - viewWidth));
    ui.cheatCodeInput.value = "";
    unlockAchievement("Fundamental", "Cheat code accepted");
    win();
  } else if (code === "soap") {
    applySoapCheat();
    ui.cheatCodeInput.value = "";
  }
}

function applySoapCheat() {
  state.soapMode = true;
  level.gravity = SOAP_GRAVITY;
  level.jump = SOAP_JUMP;
  state.player.vy = Math.min(state.player.vy, 0);
  ui.gravityInput.value = SOAP_GRAVITY;
  ui.jumpInput.value = SOAP_JUMP;
  ui.speedLabel.textContent = `soap gravity ${SOAP_GRAVITY} jump ${SOAP_JUMP}`;
  unlockAchievement("Soap", "Low gravity and low jump enabled");
}

function draw() {
  resizeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  ctx.save();
  ctx.translate(-state.cameraX, 0);
  drawWorld();
  drawTrail();
  drawBots();
  drawPlayer();
  ctx.restore();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  viewWidth = Math.max(320, rect.width);
  viewHeight = Math.max(320, rect.height);
  const width = Math.floor(viewWidth * ratio);
  const height = Math.floor(viewHeight * ratio);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawBackground() {
  if (isClassicMode()) {
    drawClassicBackground();
    return;
  }

  ctx.fillStyle = "#a9c98c";
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  ctx.strokeStyle = "rgba(38, 54, 29, 0.16)";
  ctx.lineWidth = 1;
  const offset = -state.cameraX % TILE;
  for (let x = offset; x < viewWidth; x += TILE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewHeight);
    ctx.stroke();
  }
  for (let y = FLOOR_Y % TILE; y < viewHeight; y += TILE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth, y);
    ctx.stroke();
  }

  const axisY = FLOOR_Y;
  ctx.strokeStyle = "rgba(38, 54, 29, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, axisY);
  ctx.lineTo(viewWidth, axisY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(START_X - state.cameraX, 0);
  ctx.lineTo(START_X - state.cameraX, viewHeight);
  ctx.stroke();

  ctx.fillStyle = "rgba(38, 54, 29, 0.78)";
  ctx.font = "700 12px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const firstTick = Math.max(0, Math.floor((state.cameraX - START_X) / TILE) - 1);
  const lastTick = Math.ceil((state.cameraX + viewWidth - START_X) / TILE) + 1;
  for (let tick = firstTick; tick <= lastTick; tick += 2) {
    const x = START_X + tick * TILE - state.cameraX;
    if (x < -24 || x > viewWidth + 24) continue;
    ctx.fillText(String(tick), x, axisY + 8);
  }

  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let tick = 1; tick <= 9; tick += 1) {
    const y = FLOOR_Y - tick * TILE;
    ctx.fillText(String(tick), START_X - state.cameraX - 8, y);
  }
}

function drawClassicBackground() {
  const theme = getTheme();
  const sky = ctx.createLinearGradient(0, 0, 0, viewHeight);
  sky.addColorStop(0, theme.skyTop);
  sky.addColorStop(0.58, theme.skyMid);
  sky.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  ctx.strokeStyle = theme.grid;
  ctx.lineWidth = 1;
  const offset = -state.cameraX % TILE;
  for (let x = offset; x < viewWidth; x += TILE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewHeight);
    ctx.stroke();
  }
  for (let y = FLOOR_Y % TILE; y < viewHeight; y += TILE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth, y);
    ctx.stroke();
  }
}

function drawWorld() {
  const theme = getTheme();

  if (!isClassicMode()) {
    drawEditorLines();
  }

  for (const platform of level.platforms) {
    ctx.fillStyle = isClassicMode() ? theme.platform : theme.graphPlatform;
    fillRectWorld(platform.x, platform.y, platform.w, platform.h);
    ctx.strokeStyle = isClassicMode() ? theme.platformStroke : "#a9c98c";
    strokeRectWorld(platform.x + 0.5, platform.y + 0.5, platform.w - 1, platform.h - 1);
    ctx.fillStyle = isClassicMode() ? theme.accent : theme.graphAccent;
    fillRectWorld(platform.x, platform.y, platform.w, 4);
  }

  for (let i = 0; i < level.checkpoints.length; i += 1) {
    const marker = level.checkpoints[i];
    const reached = ui.practiceMode.checked && i <= state.practiceCheckpointIndex;
    const point = screenPoint(marker.x, marker.y);
    ctx.fillStyle = reached ? "#7dff9a" : isClassicMode() ? theme.checkpoint : "rgba(38, 54, 29, 0.55)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, reached ? 11 : 9, 0, Math.PI * 2);
    ctx.fill();
    if (reached) {
      ctx.strokeStyle = isClassicMode() ? "#101115" : "#26361d";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  for (const hazard of level.hazards) {
    const points = hazard.points.map((point) => screenPoint(point.x, point.y));
    ctx.fillStyle = isClassicMode() ? theme.hazard : theme.graphHazard;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fill();
  }

  for (const portal of level.portals) {
    drawPortal(portal);
  }

  for (const jumpPad of level.jumpPads) {
    drawJumpPad(jumpPad);
  }

  for (let i = 0; i < level.jumpOrbs.length; i += 1) {
    if (state.player.jumpOrbsTouched.has(i)) continue;
    drawJumpOrb(level.jumpOrbs[i]);
  }

  ctx.fillStyle = isClassicMode() ? theme.goal : theme.graphGoal;
  fillRectWorld(level.goal.x, level.goal.y, level.goal.w, level.goal.h);
}

function drawJumpPad(jumpPad) {
  const center = screenPoint(jumpPad.x + jumpPad.w / 2, jumpPad.y + jumpPad.h / 2);
  const pulse = 1 + Math.sin(animationTime * 9 + jumpPad.x * 0.01) * 0.08;

  if (!isClassicMode()) {
    ctx.strokeStyle = "rgba(38, 54, 29, 0.28)";
    ctx.lineWidth = 1;
    ctx.strokeRect(jumpPad.hitbox.x, jumpPad.hitbox.y, jumpPad.hitbox.w, jumpPad.hitbox.h);
  }

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.scale(1, jumpPad.orientation === "down" ? -1 : 1);
  ctx.fillStyle = isClassicMode() ? "#ffd166" : "#80551f";
  ctx.strokeStyle = isClassicMode() ? "#101115" : "#26361d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-jumpPad.w / 2, 7);
  ctx.lineTo(0, -10 * pulse);
  ctx.lineTo(jumpPad.w / 2, 7);
  ctx.lineTo(jumpPad.w / 2 - 5, 10);
  ctx.lineTo(-jumpPad.w / 2 + 5, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawJumpOrb(jumpOrb) {
  const center = screenPoint(jumpOrb.x + jumpOrb.w / 2, jumpOrb.y + jumpOrb.h / 2);
  const pulse = 1 + Math.sin(animationTime * 8 + jumpOrb.x * 0.01) * 0.08;

  if (!isClassicMode()) {
    ctx.strokeStyle = "rgba(38, 54, 29, 0.28)";
    ctx.lineWidth = 1;
    ctx.strokeRect(jumpOrb.hitbox.x, jumpOrb.hitbox.y, jumpOrb.hitbox.w, jumpOrb.hitbox.h);
  }

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.scale(pulse, pulse);
  ctx.strokeStyle = isClassicMode() ? "#f6f7fb" : "#26361d";
  ctx.fillStyle = isClassicMode() ? "#101115" : "#a9c98c";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, jumpOrb.w / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = jumpOrb.orientation === "down" ? "#ff5368" : "#ffd166";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, jumpOrb.w / 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawPortal(portal) {
  const theme = getTheme();
  const colors = isClassicMode()
    ? { jet: theme.portalJet, cube: theme.portalCube }
    : { jet: "#1b5475", cube: "#1f4f2d" };
  const label = portal.type === "jet" ? "JET" : "CUBE";
  const center = screenPoint(portal.x + portal.w / 2, portal.y + portal.h / 2);

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.strokeStyle = colors[portal.type];
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, portal.w / 2, portal.h / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = colors[portal.type];
  ctx.font = "700 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, 0, 4);
  ctx.restore();
}

function drawEditorLines() {
  if (!level.points) return;

  ctx.strokeStyle = "rgba(38, 54, 29, 0.92)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  level.points.forEach((point, index) => {
    const world = screenPoint(gridToWorld(point).x, gridToWorld(point).y);
    if (index === 0) ctx.moveTo(world.x + TILE / 2, world.y);
    else ctx.lineTo(world.x + TILE / 2, world.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  for (const point of level.points) {
    const world = screenPoint(gridToWorld(point).x, gridToWorld(point).y);
    ctx.fillStyle = "#26361d";
    ctx.beginPath();
    ctx.arc(world.x + TILE / 2, world.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a9c98c";
    ctx.font = "700 10px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${point.x},${point.y}`, world.x + TILE / 2, world.y - 17);
  }
}

function drawPlayer() {
  const player = state.player;
  const visualScale = Number(character.size || 1);
  ctx.save();
  ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
  ctx.scale(visualScale, visualScale);
  if (character.glow) {
    ctx.shadowColor = character.accent;
    ctx.shadowBlur = 16;
  }
  if (player.mode === "jet") {
    ctx.fillStyle = isClassicMode() ? "#28d8ff" : "#1b5475";
    ctx.beginPath();
    ctx.moveTo(PLAYER_SIZE / 2, 0);
    ctx.lineTo(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2);
    ctx.lineTo(-PLAYER_SIZE / 3, 0);
    ctx.lineTo(-PLAYER_SIZE / 2, PLAYER_SIZE / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = state.thrusting ? isClassicMode() ? "#ffd166" : "#80551f" : isClassicMode() ? "#ff5368" : "#6f241f";
    ctx.fillRect(-PLAYER_SIZE / 2 - 10, -6, 12, 12);
  } else {
    ctx.rotate(getPlayerRotation(player));
    const bounce = player.grounded ? Math.sin(animationTime * 18) * 0.035 : 0;
    const pulse = player.grounded ? 1 + Math.abs(Math.sin(animationTime * 18)) * 0.03 : 1;
    ctx.scale(pulse, 1 - bounce);

    if (character.image && characterImage.complete && characterImage.naturalWidth > 0) {
      ctx.drawImage(characterImage, -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    } else if (hasCustomCharacterColors()) {
      drawCustomCharacter();
    } else if (cubeTexture.complete && cubeTexture.naturalWidth > 0) {
      ctx.drawImage(cubeTexture, -PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    } else {
      ctx.fillStyle = isClassicMode() ? "#28d8ff" : "#26361d";
      ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
      ctx.fillStyle = isClassicMode() ? "#101115" : "#a9c98c";
      ctx.fillRect(-8, -8, 6, 6);
      ctx.fillRect(5, -8, 6, 6);
    }
  }
  ctx.restore();
  drawPlayerName(player);
}

function drawBots() {
  if (!state.bots.length) return;

  for (const bot of state.bots) {
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.translate(bot.x + PLAYER_SIZE / 2, bot.y + PLAYER_SIZE / 2);
    ctx.rotate(animationTime * 3.5 * bot.speedScale);
    ctx.fillStyle = bot.color;
    ctx.strokeStyle = isClassicMode() ? "#101115" : "#26361d";
    ctx.lineWidth = 3;
    ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.strokeRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.fillStyle = isClassicMode() ? "#101115" : "#a9c98c";
    ctx.fillRect(-9, -8, 6, 7);
    ctx.fillRect(5, -8, 6, 7);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.font = "800 11px 'Courier New', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 3;
    ctx.strokeStyle = isClassicMode() ? "#101115" : "#a9c98c";
    ctx.fillStyle = bot.color;
    ctx.strokeText(bot.name, bot.x + PLAYER_SIZE / 2, bot.y - 8);
    ctx.fillText(bot.name, bot.x + PLAYER_SIZE / 2, bot.y - 8);
    ctx.restore();
  }
}

function getPlayerRotation(player) {
  if (character.spin === "none") return 0;
  if (character.spin === "steady") return animationTime * 4;
  return player.rotation;
}

function drawPlayerName(player) {
  const name = character.name.trim();
  if (!name) return;

  ctx.save();
  ctx.font = "800 12px 'Courier New', ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 3;
  ctx.strokeStyle = isClassicMode() ? "#101115" : "#a9c98c";
  ctx.fillStyle = isClassicMode() ? "#f6f7fb" : "#26361d";
  const x = player.x + PLAYER_SIZE / 2;
  const y = player.y - 10;
  ctx.strokeText(name, x, y);
  ctx.fillText(name, x, y);
  ctx.restore();
}

function drawTrail() {
  if (!ui.trailEnabled.checked || state.trail.length < 2) return;

  for (let i = 0; i < state.trail.length; i += 1) {
    const point = state.trail[i];
    const age = (i + 1) / state.trail.length;
    const radius = point.mode === "jet" ? 5 + age * 5 : 4 + age * 4;
    ctx.globalAlpha = age * 0.42;
    ctx.fillStyle = character.accent;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function hasCustomCharacterColors() {
  return character.body !== defaultCharacter.body
    || character.eyes !== defaultCharacter.eyes
    || character.accent !== defaultCharacter.accent;
}

function drawCustomCharacter() {
  ctx.fillStyle = character.body;
  ctx.strokeStyle = character.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.rect(-PLAYER_SIZE / 2 + 2, -PLAYER_SIZE / 2 + 2, PLAYER_SIZE - 4, PLAYER_SIZE - 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = character.accent;
  ctx.fillRect(-PLAYER_SIZE / 2 + 5, -PLAYER_SIZE / 2 + 5, PLAYER_SIZE - 10, 5);
  ctx.fillRect(-PLAYER_SIZE / 2 + 5, PLAYER_SIZE / 2 - 10, PLAYER_SIZE - 10, 5);

  ctx.fillStyle = character.eyes;
  ctx.fillRect(-10, -7, 6, 7);
  ctx.fillRect(5, -7, 6, 7);
  ctx.fillRect(-7, 8, 18, 4);
}

function loadCharacter() {
  let saved = null;

  try {
    saved = window.localStorage?.getItem(CHARACTER_STORAGE_KEY);
  } catch (error) {
    saved = null;
  }

  if (saved) {
    try {
      character = { ...defaultCharacter, ...JSON.parse(saved) };
    } catch (error) {
      character = { ...defaultCharacter };
    }
  }

  syncCharacterControls();
  updateCharacterImage();
}

function loadTrailPreference() {
  try {
    ui.trailEnabled.checked = window.localStorage?.getItem(TRAIL_STORAGE_KEY) === "true";
  } catch (error) {
    ui.trailEnabled.checked = false;
  }
}

function saveTrailPreference() {
  try {
    window.localStorage?.setItem(TRAIL_STORAGE_KEY, String(ui.trailEnabled.checked));
  } catch (error) {
    // Cosmetic preference only.
  }
}

function saveCharacter() {
  try {
    window.localStorage?.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(character));
  } catch (error) {
    // Oversized uploaded images may exceed storage. The live preview still works.
  }
}

function syncCharacterControls() {
  ui.characterBodyColor.value = character.body;
  ui.characterEyeColor.value = character.eyes;
  ui.characterAccentColor.value = character.accent;
  ui.playerNameInput.value = character.name;
  ui.playerSizeSelect.value = character.size;
  ui.playerSpinSelect.value = character.spin;
  ui.playerGlowEnabled.checked = character.glow;
}

function updateCharacterImage() {
  if (character.image) {
    characterImage.src = character.image;
  } else {
    characterImage.src = "";
  }
}

function updateCharacterColor(key, value) {
  character[key] = value;
  saveCharacter();
}

function updateCharacterOption(key, value) {
  character[key] = value;
  saveCharacter();
}

function uploadCharacter(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    ui.status.textContent = "Character file must be an image.";
    ui.status.classList.remove("hidden");
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    character.image = String(reader.result || "");
    updateCharacterImage();
    saveCharacter();
    ui.status.textContent = "Custom character loaded.";
    ui.status.classList.remove("hidden");
  });
  reader.readAsDataURL(file);
}

function resetCharacter() {
  character = { ...defaultCharacter };
  ui.characterUpload.value = "";
  syncCharacterControls();
  updateCharacterImage();
  saveCharacter();
}

function loadRandomLevel() {
  if (examples.length <= 1) return;

  let next = currentLevelIndex;
  while (next === currentLevelIndex) {
    next = Math.floor(Math.random() * examples.length);
  }

  ui.levelSelect.value = String(next);
  loadUiLevel(next);
}

function screenY(y, h = 0) {
  return y;
}

function screenPoint(x, y) {
  return { x, y: screenY(y) };
}

function fillRectWorld(x, y, w, h) {
  ctx.fillRect(x, screenY(y, h), w, h);
}

function strokeRectWorld(x, y, w, h) {
  ctx.strokeRect(x, screenY(y, h), w, h);
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function loadUiLevel(index) {
  const item = examples[index];
  ui.platformInput.value = item.points;
  ui.hazardInput.value = item.spikes;
  ui.portalInput.value = item.portals || "";
  ui.jumpPadInput.value = item.jumpPads || "";
  ui.jumpOrbInput.value = item.jumpOrbs || "";
  ui.gravityInput.value = item.gravity;
  ui.jumpInput.value = item.jump;
  reset(index);
}

function applyPlayStyle() {
  document.body.classList.toggle("classic-mode", isClassicMode());

  if (isClassicMode()) {
    editingPoints = false;
    ui.addPointMode.textContent = "Add Points";
    ui.physicsMode.value = "arcade";
  }

  loadUiLevel(currentLevelIndex);
}

function buildCustomLevel() {
  try {
    reset(currentLevelIndex, {
      name: "Custom Point Map",
      points: normalizePointText(ui.platformInput.value),
      spikes: normalizeSpikeText(ui.hazardInput.value),
      portals: normalizePortalText(ui.portalInput.value),
      jumpPads: normalizeJumpPadText(ui.jumpPadInput.value),
      jumpOrbs: normalizeJumpOrbText(ui.jumpOrbInput.value),
      physicsMode: ui.physicsMode.value,
      speed: examples[currentLevelIndex].speed,
      gravity: Number(ui.gravityInput.value),
      jump: Number(ui.jumpInput.value)
    });
    ui.platformInput.value = level.points.map((point) => `${point.x},${point.y}`).join("\n");
    ui.hazardInput.value = level.spikePoints.map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
    ui.portalInput.value = level.portalPoints.map((point) => `${point.type},${point.x},${point.y}`).join("\n");
    ui.jumpPadInput.value = level.jumpPadPoints.map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
    ui.jumpOrbInput.value = level.jumpOrbPoints.map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
  } catch (error) {
    ui.status.textContent = error.message;
    ui.status.classList.remove("hidden");
  }
}

function normalizePointText(source) {
  return parsePointList(source).map((point) => `${point.x},${point.y}`).join("\n");
}

function normalizeSpikeText(source) {
  return parseSpikeList(source).map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
}

function normalizePortalText(source) {
  return parsePortalList(source).map((point) => `${point.type},${point.x},${point.y}`).join("\n");
}

function normalizeJumpPadText(source) {
  return parseJumpPadList(source).map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
}

function normalizeJumpOrbText(source) {
  return parseJumpOrbList(source).map((point) => `${point.orientation === "down" ? "down," : ""}${point.x},${point.y}`).join("\n");
}

function addCanvasPoint(event) {
  if (!editingPoints) {
    jump();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const worldX = event.clientX - rect.left + state.cameraX;
  const worldY = event.clientY - rect.top;
  const point = {
    x: clamp(snap((worldX - START_X) / POINT_SCALE), 0, 260),
    y: clamp(snap((FLOOR_Y - worldY) / POINT_SCALE), 0, 9)
  };

  const current = ui.platformInput.value.trim();
  ui.platformInput.value = current ? `${current}\n${point.x},${point.y}` : `${point.x},${point.y}`;
  buildCustomLevel();
}

examples.forEach((item, index) => {
  const option = document.createElement("option");
  option.value = String(index);
  option.textContent = item.name;
  ui.levelSelect.append(option);
});

ui.playPause.addEventListener("click", toggleRun);
ui.jumpButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  jump();
});
ui.jumpButton.addEventListener("pointerup", stopJump);
ui.jumpButton.addEventListener("pointercancel", stopJump);
ui.jumpButton.addEventListener("pointerleave", stopJump);
ui.restart.addEventListener("click", () => reset(currentLevelIndex));
ui.nextLevel.addEventListener("click", () => {
  const next = (currentLevelIndex + 1) % examples.length;
  ui.levelSelect.value = String(next);
  loadUiLevel(next);
});
ui.randomLevel.addEventListener("click", loadRandomLevel);
ui.botCountSelect.addEventListener("change", () => reset(currentLevelIndex));
ui.levelSelect.addEventListener("change", () => loadUiLevel(Number(ui.levelSelect.value)));
ui.playStyle.addEventListener("change", applyPlayStyle);
ui.physicsMode.addEventListener("change", () => buildCustomLevel());
ui.applyLevel.addEventListener("click", buildCustomLevel);
ui.cheatCodeInput.addEventListener("input", submitCheatCode);
ui.cheatCodeInput.addEventListener("keydown", (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    submitCheatCode();
  }
});
ui.cheatsEnabled.addEventListener("change", () => {
  if (!ui.cheatsEnabled.checked) {
    ui.cheatCodeInput.value = "";
  } else {
    submitCheatCode();
  }
});
ui.practiceMode.addEventListener("change", () => reset(currentLevelIndex));
ui.trailEnabled.addEventListener("change", () => {
  if (!ui.trailEnabled.checked) {
    state.trail.length = 0;
  }
  saveTrailPreference();
});
ui.characterUpload.addEventListener("change", uploadCharacter);
ui.characterBodyColor.addEventListener("input", () => updateCharacterColor("body", ui.characterBodyColor.value));
ui.characterEyeColor.addEventListener("input", () => updateCharacterColor("eyes", ui.characterEyeColor.value));
ui.characterAccentColor.addEventListener("input", () => updateCharacterColor("accent", ui.characterAccentColor.value));
ui.playerNameInput.addEventListener("input", () => updateCharacterOption("name", ui.playerNameInput.value.trim().slice(0, 14)));
ui.playerSizeSelect.addEventListener("change", () => updateCharacterOption("size", ui.playerSizeSelect.value));
ui.playerSpinSelect.addEventListener("change", () => updateCharacterOption("spin", ui.playerSpinSelect.value));
ui.playerGlowEnabled.addEventListener("change", () => updateCharacterOption("glow", ui.playerGlowEnabled.checked));
ui.resetCharacter.addEventListener("click", resetCharacter);
ui.addPointMode.addEventListener("click", () => {
  editingPoints = !editingPoints;
  ui.addPointMode.textContent = editingPoints ? "Play Mode" : "Add Points";
  ui.status.textContent = editingPoints ? "Click the grid to add points" : "Press Start to begin";
  ui.status.classList.toggle("hidden", !editingPoints);
});
ui.undoPoint.addEventListener("click", () => {
  const points = ui.platformInput.value.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  points.pop();
  ui.platformInput.value = points.join("\n");
  buildCustomLevel();
});
canvas.addEventListener("pointerdown", addCanvasPoint);
canvas.addEventListener("pointerup", stopJump);
canvas.addEventListener("pointercancel", stopJump);
canvas.addEventListener("pointerleave", stopJump);

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!editingPoints && !event.repeat) {
      if (!state.running) {
        toggleRun();
      } else {
        jump();
      }
    }
  }
  if (event.code === "KeyR") {
    reset(currentLevelIndex);
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    stopJump();
  }
});
window.addEventListener("pointerup", stopJump);
window.addEventListener("blur", stopJump);

loadCharacter();
loadTrailPreference();
applyPlayStyle();
requestAnimationFrame(loop);
