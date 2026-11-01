/**
 * PROJECT DATA - the single place where every project is defined.
 *
 * To add a project:
 *   1. Make a folder  assets/images/projects/<id>/  and put in:
 *        logo.webp                     (square image shown on the card)
 *        shot-1.webp, shot-2.webp ...  (screenshots, 16:9)
 *        thumb-1.webp, thumb-2.webp .. (small versions, optional but faster)
 *   2. Copy one of the blocks below, change the values, and paste it in the list.
 *
 * The home page card and the project page (project.html?id=<id>) are both built from this data.
 */
export const projects = [
  {
    id: "aura",
    title: "AURA (Udemy)",
    gameType: "Top-Down Action RPG",
    cardTech: "Unreal Engine / C++ / GAS", // short line shown under the logo on the card
    tech: ["Unreal Engine", "C++", "Gameplay Ability System (GAS)"],
    features: [
      "Character Leveling",
      "Attribute Progression System",
      "Ability Unlocking and Upgrading",
      "Cooldowns and Costs",
      "Skill and Attribute Menus",
      "Enemy AI with Behavior Trees",
      "Enemy loot drops",
    ],
    description: "AURA is a top-down action RPG built in Unreal Engine 5 using C++ and the Gameplay Ability System (GAS). The game features a progression system where players gain experience by defeating enemies and level up to earn attribute points and spell points. Players can improve their character through an attribute system. Abilities are unlocked and upgraded through a skill menu using spell points, with each ability having its own cooldowns and resource costs managed through Gameplay Tags. The game also features enemy AI controlled using Behavior Trees with different behaviors. Enemies can drop pickups such as health and mana potions, adding resource management to the combat experience.",
    video: "https://youtu.be/2MXesE6Dwhs", // YouTube link, or "" for none
    screenshots: 6, // how many shot-N.webp files exist
    links: {
      github: "https://github.com/81-ansh/GAS_RPG",
      itchio: "https://81-ansh.itch.io/aura",
    },
  },
  {
    id: "multiplayer-shooter",
    title: "Multiplayer Shooter",
    gameType: "Shooter",
    cardTech: "Unreal Engine / C++ / Steam Subsystem", // short line shown under the logo on the card
    tech: ["Unreal Engine", "C++", "Steam Subsystem"],
    features: [
      "Replication",
      "Lag compensation",
      "Session Management",
      "Network Optimization",
      "Variety of Weapons",
      "3 Different Mode",
      "Buffs",
    ],
    description: "A multiplayer third-person shooter built in Unreal Engine, featuring networked gameplay powered by Steam's Online Subsystem for matchmaking and session management.",
    video: "https://youtu.be/6KIs7KhfNVA", // YouTube link, or "" for none
    screenshots: 10, // how many shot-N.webp files exist
    links: {
      github: "https://github.com/81-ansh/Blaster",
      itchio: "https://81-ansh.itch.io/multiplayer-shooter",
    },
  },
  {
    id: "coinquest",
    title: "CoinQuest",
    gameType: "3D Arcade Evasion",
    cardTech: "Unreal Engine / Blueprints", // short line shown under the logo on the card
    tech: ["Unreal Engine", "Blueprints", "Behavior Tree"],
    features: [
      "Enemy AI using Behavior Tree",
      "AI detection system based on player proximity",
      "Melee attack system for enemies",
      "Coin collection objective system",
      "UI displaying level objective and coin count",
    ],
    description: "CoinQuest is a game built in Unreal Engine 5 where the player must collect a set number of coins to complete the level while avoiding enemies. Enemies are controlled using Behavior Trees that allow them to detect the player within a certain range, chase the player, and perform melee attacks when close enough. Since the player cannot attack, the gameplay focuses on movement, evasion, and strategic pathing to survive while collecting all required coins. A UI system displays the objective and tracks how many coins remain to complete the level.",
    video: "https://youtu.be/9q_O77ZZS58", // YouTube link, or "" for none
    screenshots: 6, // how many shot-N.webp files exist
    links: {
      github: "https://github.com/81-ansh/CoinQuest",
      itchio: "https://81-ansh.itch.io/coinquest",
    },
  },
  {
    id: "pong",
    title: "Pong",
    gameType: "Arcade Game",
    cardTech: "Unreal Engine / Blueprints", // short line shown under the logo on the card
    tech: ["Unreal Engine", "Blueprints"],
    features: [
      "Player paddle control",
      "Ball physics",
      "Collision detection",
      "Score tracking",
      "AI opponent",
    ],
    description: "A classic Pong game implemented in Unreal Engine with Blueprints.",
    video: "https://youtu.be/S22afv7ydLw", // YouTube link, or "" for none
    screenshots: 4, // how many shot-N.webp files exist
    links: {
      github: "https://github.com/81-ansh/Pong",
      itchio: "https://81-ansh.itch.io/pong",
    },
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    gameType: "Arcade Game",
    cardTech: "Unreal Engine / C++ / Blueprints", // short line shown under the logo on the card
    tech: ["Unreal Engine", "C++", "Blueprints"],
    features: [
      "Physics-based bird movement",
      "Endless procedurally spawned pipe obstacles",
      "Automatic obstacle cleanup",
      "Persistent high score saved to local storage",
    ],
    description: "A recreation of the classic Flappy Bird, built in Unreal Engine 5 using C++. The player controls a bird navigating through an endless series of pipes, with physics-driven movement and a persistent high score system.",
    video: "https://youtu.be/6YP6v9QqzN0", // YouTube link, or "" for none
    screenshots: 3, // how many shot-N.webp files exist
    links: {
      github: "https://github.com/81-ansh/FlappyBird",
      itchio: "https://81-ansh.itch.io/flappy-bird",
    },
  },
];
