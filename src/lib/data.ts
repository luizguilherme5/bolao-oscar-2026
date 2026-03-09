export interface Category {
  id: string;
  name: string;
  group: "BIG_SIX" | "MAJOR" | "TECHNICAL";
  order: number;
  emoji: string;
}

export interface Nominee {
  id: string;
  name: string;
  details: string;
}

export const categories: Category[] = [
  { id: "best_picture", name: "Melhor Filme", group: "BIG_SIX", order: 1, emoji: "🎬" },
  { id: "directing", name: "Direção", group: "BIG_SIX", order: 2, emoji: "🎥" },
  { id: "actor_leading", name: "Ator em Papel Principal", group: "BIG_SIX", order: 3, emoji: "🎭" },
  { id: "actress_leading", name: "Atriz em Papel Principal", group: "BIG_SIX", order: 4, emoji: "👸" },
  { id: "actor_supporting", name: "Ator Coadjuvante", group: "BIG_SIX", order: 5, emoji: "🌟" },
  { id: "actress_supporting", name: "Atriz Coadjuvante", group: "BIG_SIX", order: 6, emoji: "💫" },
  { id: "original_screenplay", name: "Roteiro Original", group: "MAJOR", order: 7, emoji: "✍️" },
  { id: "adapted_screenplay", name: "Roteiro Adaptado", group: "MAJOR", order: 8, emoji: "📖" },
  { id: "animated_feature", name: "Animação", group: "MAJOR", order: 9, emoji: "🧸" },
  { id: "international_feature", name: "Filme Internacional", group: "MAJOR", order: 10, emoji: "🌍" },
  { id: "documentary_feature", name: "Documentário", group: "MAJOR", order: 11, emoji: "📹" },
  { id: "original_score", name: "Trilha Sonora", group: "TECHNICAL", order: 12, emoji: "🎵" },
  { id: "original_song", name: "Canção Original", group: "TECHNICAL", order: 13, emoji: "🎤" },
  { id: "cinematography", name: "Fotografia", group: "TECHNICAL", order: 14, emoji: "📸" },
  { id: "film_editing", name: "Montagem", group: "TECHNICAL", order: 15, emoji: "✂️" },
  { id: "production_design", name: "Design de Produção", group: "TECHNICAL", order: 16, emoji: "🏗️" },
  { id: "costume_design", name: "Figurino", group: "TECHNICAL", order: 17, emoji: "👗" },
  { id: "makeup_hairstyling", name: "Maquiagem e Penteados", group: "TECHNICAL", order: 18, emoji: "💄" },
  { id: "sound", name: "Som", group: "TECHNICAL", order: 19, emoji: "🔊" },
  { id: "visual_effects", name: "Efeitos Visuais", group: "TECHNICAL", order: 20, emoji: "✨" },
  { id: "casting", name: "Direção de Elenco", group: "TECHNICAL", order: 21, emoji: "🎪" },
  { id: "documentary_short", name: "Curta Documentário", group: "TECHNICAL", order: 22, emoji: "🎞️" },
  { id: "live_action_short", name: "Curta Live Action", group: "TECHNICAL", order: 23, emoji: "🎬" },
  { id: "animated_short", name: "Curta Animação", group: "TECHNICAL", order: 24, emoji: "🦋" },
];

export const nominees: Record<string, Nominee[]> = {
  best_picture: [
    { id: "bugonia", name: "Bugonia", details: "Ed Guiney, Andrew Lowe, Yorgos Lanthimos, Emma Stone" },
    { id: "f1", name: "F1", details: "Chad Oman, Brad Pitt, Joseph Kosinski, Jerry Bruckheimer" },
    { id: "frankenstein", name: "Frankenstein", details: "Guillermo del Toro, J. Miles Dale, Scott Stuber" },
    { id: "hamnet", name: "Hamnet", details: "Liza Marshall, Pippa Harris, Steven Spielberg, Sam Mendes" },
    { id: "marty_supreme", name: "Marty Supreme", details: "Eli Bush, Josh Safdie, Timothée Chalamet" },
    { id: "one_battle_after_another", name: "One Battle after Another", details: "Adam Somner, Sara Murphy, Paul Thomas Anderson" },
    { id: "the_secret_agent", name: "The Secret Agent", details: "Emilie Lesclaux" },
    { id: "sentimental_value", name: "Sentimental Value", details: "Maria Ekerhovd, Andrea Berentsen Ottmar" },
    { id: "sinners", name: "Sinners", details: "Zinzi Coogler, Sev Ohanian, Ryan Coogler" },
    { id: "train_dreams", name: "Train Dreams", details: "Marissa McMahon, Teddy Schwarzman" },
  ],
  directing: [
    { id: "chloe_zhao_hamnet", name: "Chloé Zhao", details: "Hamnet" },
    { id: "josh_safdie_marty", name: "Josh Safdie", details: "Marty Supreme" },
    { id: "pta_one_battle", name: "Paul Thomas Anderson", details: "One Battle after Another" },
    { id: "joachim_trier_sentimental", name: "Joachim Trier", details: "Sentimental Value" },
    { id: "ryan_coogler_sinners", name: "Ryan Coogler", details: "Sinners" },
  ],
  actor_leading: [
    { id: "timothee_chalamet_marty", name: "Timothée Chalamet", details: "Marty Supreme" },
    { id: "leonardo_dicaprio_one_battle", name: "Leonardo DiCaprio", details: "One Battle after Another" },
    { id: "ethan_hawke_blue_moon", name: "Ethan Hawke", details: "Blue Moon" },
    { id: "michael_b_jordan_sinners", name: "Michael B. Jordan", details: "Sinners" },
    { id: "wagner_moura_secret_agent", name: "Wagner Moura", details: "The Secret Agent" },
  ],
  actress_leading: [
    { id: "jessie_buckley_hamnet", name: "Jessie Buckley", details: "Hamnet" },
    { id: "rose_byrne_if_i_had_legs", name: "Rose Byrne", details: "If I Had Legs I'd Kick You" },
    { id: "kate_hudson_song_sung_blue", name: "Kate Hudson", details: "Song Sung Blue" },
    { id: "renate_reinsve_sentimental", name: "Renate Reinsve", details: "Sentimental Value" },
    { id: "emma_stone_bugonia", name: "Emma Stone", details: "Bugonia" },
  ],
  actor_supporting: [
    { id: "benicio_del_toro_one_battle", name: "Benicio Del Toro", details: "One Battle after Another" },
    { id: "jacob_elordi_frankenstein", name: "Jacob Elordi", details: "Frankenstein" },
    { id: "delroy_lindo_sinners", name: "Delroy Lindo", details: "Sinners" },
    { id: "sean_penn_one_battle", name: "Sean Penn", details: "One Battle after Another" },
    { id: "stellan_skarsgard_sentimental", name: "Stellan Skarsgård", details: "Sentimental Value" },
  ],
  actress_supporting: [
    { id: "elle_fanning_sentimental", name: "Elle Fanning", details: "Sentimental Value" },
    { id: "inga_lilleaas_sentimental", name: "Inga Ibsdotter Lilleaas", details: "Sentimental Value" },
    { id: "amy_madigan_weapons", name: "Amy Madigan", details: "Weapons" },
    { id: "wunmi_mosaku_sinners", name: "Wunmi Mosaku", details: "Sinners" },
    { id: "teyana_taylor_one_battle", name: "Teyana Taylor", details: "One Battle after Another" },
  ],
  original_screenplay: [
    { id: "blue_moon_screenplay", name: "Blue Moon", details: "Robert Kaplow" },
    { id: "it_was_just_accident_screenplay", name: "It Was Just an Accident", details: "Jafar Panahi, Nader Saïvar" },
    { id: "marty_supreme_screenplay", name: "Marty Supreme", details: "Ronald Bronstein, Josh Safdie" },
    { id: "sentimental_value_screenplay", name: "Sentimental Value", details: "Eskil Vogt, Joachim Trier" },
    { id: "sinners_screenplay", name: "Sinners", details: "Ryan Coogler" },
  ],
  adapted_screenplay: [
    { id: "bugonia_screenplay", name: "Bugonia", details: "Will Tracy" },
    { id: "frankenstein_screenplay", name: "Frankenstein", details: "Guillermo del Toro" },
    { id: "hamnet_screenplay", name: "Hamnet", details: "Chloé Zhao, Maggie O'Farrell" },
    { id: "one_battle_screenplay", name: "One Battle after Another", details: "Paul Thomas Anderson" },
    { id: "train_dreams_screenplay", name: "Train Dreams", details: "Clint Bentley, Greg Kwedar" },
  ],
  animated_feature: [
    { id: "arco", name: "Arco", details: "Ugo Bienvenu, Félix de Givry, Natalie Portman" },
    { id: "elio", name: "Elio", details: "Madeline Sharafian, Domee Shi, Adrian Molina" },
    { id: "kpop_demon_hunters", name: "KPop Demon Hunters", details: "Maggie Kang, Chris Appelhans" },
    { id: "little_amelie", name: "Little Amélie", details: "Maïlys Vallade, Liane-Cho Han" },
    { id: "zootopia_2", name: "Zootopia 2", details: "Jared Bush, Byron Howard" },
  ],
  international_feature: [
    { id: "secret_agent_brazil", name: "The Secret Agent", details: "Brasil 🇧🇷" },
    { id: "it_was_just_accident_france", name: "It Was Just an Accident", details: "França 🇫🇷" },
    { id: "sentimental_value_norway", name: "Sentimental Value", details: "Noruega 🇳🇴" },
    { id: "sirat_spain", name: "Sirāt", details: "Espanha 🇪🇸" },
    { id: "voice_hind_rajab_tunisia", name: "The Voice of Hind Rajab", details: "Tunísia 🇹🇳" },
  ],
  documentary_feature: [
    { id: "alabama_solution", name: "The Alabama Solution", details: "Andrew Jarecki, Charlotte Kaufman" },
    { id: "come_see_me_good_light", name: "Come See Me in the Good Light", details: "Ryan White, Tig Notaro" },
    { id: "cutting_through_rocks", name: "Cutting through Rocks", details: "Sara Khaki, Mohammadreza Eyni" },
    { id: "mr_nobody_against_putin", name: "Mr. Nobody against Putin", details: "A ser determinado" },
    { id: "perfect_neighbor", name: "The Perfect Neighbor", details: "Geeta Gandbhir, Alisa Payne" },
  ],
  original_score: [
    { id: "bugonia_score", name: "Bugonia", details: "Jerskin Fendrix" },
    { id: "frankenstein_score", name: "Frankenstein", details: "Alexandre Desplat" },
    { id: "hamnet_score", name: "Hamnet", details: "Max Richter" },
    { id: "one_battle_score", name: "One Battle after Another", details: "Jonny Greenwood" },
    { id: "sinners_score", name: "Sinners", details: "Ludwig Goransson" },
  ],
  original_song: [
    { id: "dear_me_song", name: "Dear Me", details: "Diane Warren (Relentless)" },
    { id: "golden_song", name: "Golden", details: "EJAE, Mark Sonnenblick (KPop Demon Hunters)" },
    { id: "i_lied_to_you_song", name: "I Lied To You", details: "Raphael Saadiq, Ludwig Goransson (Sinners)" },
    { id: "sweet_dreams_joy_song", name: "Sweet Dreams Of Joy", details: "Nicholas Pike (Viva Verdi!)" },
    { id: "train_dreams_song", name: "Train Dreams", details: "Nick Cave, Bryce Dessner (Train Dreams)" },
  ],
  cinematography: [
    { id: "frankenstein_cinematography", name: "Frankenstein", details: "Dan Laustsen" },
    { id: "marty_supreme_cinematography", name: "Marty Supreme", details: "Darius Khondji" },
    { id: "one_battle_cinematography", name: "One Battle after Another", details: "Michael Bauman" },
    { id: "sinners_cinematography", name: "Sinners", details: "Autumn Durald Arkapaw" },
    { id: "train_dreams_cinematography", name: "Train Dreams", details: "Adolpho Veloso" },
  ],
  film_editing: [
    { id: "f1_editing", name: "F1", details: "Stephen Mirrione" },
    { id: "marty_supreme_editing", name: "Marty Supreme", details: "Ronald Bronstein, Josh Safdie" },
    { id: "one_battle_editing", name: "One Battle after Another", details: "Andy Jurgensen" },
    { id: "sentimental_value_editing", name: "Sentimental Value", details: "Olivier Bugge Coutté" },
    { id: "sinners_editing", name: "Sinners", details: "Michael P. Shawver" },
  ],
  production_design: [
    { id: "frankenstein_production", name: "Frankenstein", details: "Tamara Deverell / Shane Vieau" },
    { id: "hamnet_production", name: "Hamnet", details: "Fiona Crombie / Alice Felton" },
    { id: "marty_supreme_production", name: "Marty Supreme", details: "Jack Fisk / Adam Willis" },
    { id: "one_battle_production", name: "One Battle after Another", details: "Florencia Martin / Anthony Carlino" },
    { id: "sinners_production", name: "Sinners", details: "Hannah Beachler / Monique Champagne" },
  ],
  costume_design: [
    { id: "avatar_costume", name: "Avatar: Fire and Ash", details: "Deborah L. Scott" },
    { id: "frankenstein_costume", name: "Frankenstein", details: "Kate Hawley" },
    { id: "hamnet_costume", name: "Hamnet", details: "Malgosia Turzanska" },
    { id: "marty_supreme_costume", name: "Marty Supreme", details: "Miyako Bellizzi" },
    { id: "sinners_costume", name: "Sinners", details: "Ruth E. Carter" },
  ],
  makeup_hairstyling: [
    { id: "frankenstein_makeup", name: "Frankenstein", details: "Mike Hill, Jordan Samuel, Cliona Furey" },
    { id: "kokuho_makeup", name: "Kokuho", details: "Kyoko Toyokawa, Naomi Hibino" },
    { id: "sinners_makeup", name: "Sinners", details: "Ken Diaz, Mike Fontaine, Shunika Terry" },
    { id: "smashing_machine_makeup", name: "The Smashing Machine", details: "Kazu Hiro, Glen Griffin" },
    { id: "ugly_stepsister_makeup", name: "The Ugly Stepsister", details: "Thomas Foldberg, Anne Cathrine Sauerberg" },
  ],
  sound: [
    { id: "f1_sound", name: "F1", details: "Gareth John, Al Nelson, Gary A. Rizzo" },
    { id: "frankenstein_sound", name: "Frankenstein", details: "Greg Chapman, Nathan Robitaille, Brad Zoern" },
    { id: "one_battle_sound", name: "One Battle after Another", details: "José Antonio García, Christopher Scarabosio" },
    { id: "sinners_sound", name: "Sinners", details: "Chris Welcker, Benjamin A. Burtt, Brandon Proctor" },
    { id: "sirat_sound", name: "Sirāt", details: "Amanda Villavieja, Laia Casanovas" },
  ],
  visual_effects: [
    { id: "avatar_vfx", name: "Avatar: Fire and Ash", details: "Joe Letteri, Richard Baneham, Eric Saindon" },
    { id: "f1_vfx", name: "F1", details: "Ryan Tudhope, Nicolas Chevallier, Robert Harrington" },
    { id: "jurassic_world_rebirth_vfx", name: "Jurassic World Rebirth", details: "David Vickery, Stephen Aplin" },
    { id: "lost_bus_vfx", name: "The Lost Bus", details: "Charlie Noble, David Zaretti, Russell Bowen" },
    { id: "sinners_vfx", name: "Sinners", details: "Michael Ralla, Espen Nordahl, Guido Wolter" },
  ],
  casting: [
    { id: "hamnet_casting", name: "Hamnet", details: "Nina Gold" },
    { id: "marty_supreme_casting", name: "Marty Supreme", details: "Jennifer Venditti" },
    { id: "one_battle_casting", name: "One Battle after Another", details: "Cassandra Kulukundis" },
    { id: "secret_agent_casting", name: "The Secret Agent", details: "Gabriel Domingues" },
    { id: "sinners_casting", name: "Sinners", details: "Francine Maisler" },
  ],
  documentary_short: [
    { id: "all_empty_rooms", name: "All the Empty Rooms", details: "Joshua Seftel, Conall Jones" },
    { id: "armed_only_camera", name: "Armed Only with a Camera", details: "Craig Renaud, Juan Arredondo" },
    { id: "children_no_more", name: "Children No More", details: "Hilla Medalia, Sheila Nevins" },
    { id: "devil_is_busy", name: "The Devil Is Busy", details: "Christalyn Hampton, Geeta Gandbhir" },
    { id: "perfectly_strangeness", name: "Perfectly a Strangeness", details: "Alison McAlpine" },
  ],
  live_action_short: [
    { id: "butchers_stain", name: "Butcher's Stain", details: "Meyer Levinson-Blount, Oron Caspi" },
    { id: "friend_of_dorothy", name: "A Friend of Dorothy", details: "Lee Knight, James Dean" },
    { id: "jane_austen_period_drama", name: "Jane Austen's Period Drama", details: "Julia Aks, Steve Pinder" },
    { id: "the_singers", name: "The Singers", details: "Sam A. Davis, Jack Piatt" },
    { id: "two_people_exchanging_saliva", name: "Two People Exchanging Saliva", details: "Alexandre Singh" },
  ],
  animated_short: [
    { id: "butterfly_short", name: "Butterfly", details: "Florence Miailhe, Ron Dyens" },
    { id: "forevergreen", name: "Forevergreen", details: "Nathan Engelhardt, Jeremy Spears" },
    { id: "girl_who_cried_pearls", name: "The Girl Who Cried Pearls", details: "Chris Lavis, Maciek Szczerbowski" },
    { id: "retirement_plan", name: "Retirement Plan", details: "John Kelly, Andrew Freedman" },
    { id: "three_sisters", name: "The Three Sisters", details: "Konstantin Bronzit" },
  ],
};

export const categoryGroups = [
  { id: "BIG_SIX", name: "As Grandes", emoji: "🏆", description: "As categorias que todo mundo briga" },
  { id: "MAJOR", name: "Principais", emoji: "🎭", description: "Pra quem entende de cinema de verdade" },
  { id: "TECHNICAL", name: "Técnicas", emoji: "🎥", description: "Aqui separa os cinéfilos dos mortais" },
] as const;

export const funPhrases = [
  "Quem será o rei da pipoca? 🍿",
  "Seu palpite vale ouro... dourado, tipo a estatueta! 🏆",
  "Apostou, não pode chorar depois! 😭",
  "Wagner Moura vai trazer o Oscar pra casa? 🇧🇷",
  "Melhor que acertar na Mega-Sena! 🎰",
  "O envelope, por favor... 💌",
  "E o Oscar vai para... seu palpite! 🎬",
  "Prepara a pipoca que o bolão tá quente! 🔥",
  "Amigos da Rua domina o Oscar! 🏠",
  "Mais emocionante que final de novela! 📺",
];
