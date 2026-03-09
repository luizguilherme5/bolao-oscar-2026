export interface Category {
  id: string;
  name: string;
  group: "BIG_SIX" | "MAJOR" | "TECHNICAL";
  order: number;
  icon: string; // lucide icon name
  points: number;
}

export interface Nominee {
  id: string;
  name: string;
  namePtBr: string;
  details: string;
}

export const groupInfo = {
  BIG_SIX: { name: "As Grandes", points: 3, icon: "trophy" },
  MAJOR: { name: "Principais", points: 2, icon: "star" },
  TECHNICAL: { name: "Técnicas", points: 1, icon: "wrench" },
} as const;

export const categories: Category[] = [
  { id: "best_picture", name: "Melhor Filme", group: "BIG_SIX", order: 1, icon: "clapperboard", points: 5 },
  { id: "directing", name: "Direção", group: "BIG_SIX", order: 2, icon: "megaphone", points: 3 },
  { id: "actor_leading", name: "Ator em Papel Principal", group: "BIG_SIX", order: 3, icon: "user", points: 3 },
  { id: "actress_leading", name: "Atriz em Papel Principal", group: "BIG_SIX", order: 4, icon: "user", points: 3 },
  { id: "actor_supporting", name: "Ator Coadjuvante", group: "BIG_SIX", order: 5, icon: "users", points: 3 },
  { id: "actress_supporting", name: "Atriz Coadjuvante", group: "BIG_SIX", order: 6, icon: "users", points: 3 },
  { id: "original_screenplay", name: "Roteiro Original", group: "MAJOR", order: 7, icon: "pen-tool", points: 2 },
  { id: "adapted_screenplay", name: "Roteiro Adaptado", group: "MAJOR", order: 8, icon: "book-open", points: 2 },
  { id: "animated_feature", name: "Animação", group: "MAJOR", order: 9, icon: "palette", points: 2 },
  { id: "international_feature", name: "Filme Internacional", group: "MAJOR", order: 10, icon: "globe", points: 2 },
  { id: "documentary_feature", name: "Documentário", group: "MAJOR", order: 11, icon: "video", points: 2 },
  { id: "original_score", name: "Trilha Sonora", group: "TECHNICAL", order: 12, icon: "music", points: 1 },
  { id: "original_song", name: "Canção Original", group: "TECHNICAL", order: 13, icon: "mic", points: 1 },
  { id: "cinematography", name: "Fotografia", group: "TECHNICAL", order: 14, icon: "camera", points: 1 },
  { id: "film_editing", name: "Montagem", group: "TECHNICAL", order: 15, icon: "scissors", points: 1 },
  { id: "production_design", name: "Design de Produção", group: "TECHNICAL", order: 16, icon: "layout", points: 1 },
  { id: "costume_design", name: "Figurino", group: "TECHNICAL", order: 17, icon: "shirt", points: 1 },
  { id: "makeup_hairstyling", name: "Maquiagem e Penteados", group: "TECHNICAL", order: 18, icon: "sparkles", points: 1 },
  { id: "sound", name: "Som", group: "TECHNICAL", order: 19, icon: "volume-2", points: 1 },
  { id: "visual_effects", name: "Efeitos Visuais", group: "TECHNICAL", order: 20, icon: "zap", points: 1 },
  { id: "casting", name: "Direção de Elenco", group: "TECHNICAL", order: 21, icon: "contact", points: 1 },
  { id: "documentary_short", name: "Curta Documentário", group: "TECHNICAL", order: 22, icon: "film", points: 1 },
  { id: "live_action_short", name: "Curta Live Action", group: "TECHNICAL", order: 23, icon: "film", points: 1 },
  { id: "animated_short", name: "Curta Animação", group: "TECHNICAL", order: 24, icon: "image", points: 1 },
];

export const categoryGroups = [
  { id: "BIG_SIX" as const, name: "As Grandes", description: "3 pts (Melhor Filme = 5)", points: 3 },
  { id: "MAJOR" as const, name: "Principais", description: "2 pontos por acerto", points: 2 },
  { id: "TECHNICAL" as const, name: "Técnicas", description: "1 ponto por acerto", points: 1 },
];

export const nominees: Record<string, Nominee[]> = {
  best_picture: [
    { id: "bugonia", name: "Bugonia", namePtBr: "Bugônia", details: "Ed Guiney, Andrew Lowe, Yorgos Lanthimos, Emma Stone" },
    { id: "f1", name: "F1", namePtBr: "F1", details: "Chad Oman, Brad Pitt, Joseph Kosinski, Jerry Bruckheimer" },
    { id: "frankenstein", name: "Frankenstein", namePtBr: "Frankenstein", details: "Guillermo del Toro, J. Miles Dale, Scott Stuber" },
    { id: "hamnet", name: "Hamnet", namePtBr: "Hamnet", details: "Liza Marshall, Pippa Harris, Steven Spielberg, Sam Mendes" },
    { id: "marty_supreme", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Eli Bush, Josh Safdie, Timothée Chalamet" },
    { id: "one_battle_after_another", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Adam Somner, Sara Murphy, Paul Thomas Anderson" },
    { id: "the_secret_agent", name: "The Secret Agent", namePtBr: "O Agente Secreto", details: "Emilie Lesclaux" },
    { id: "sentimental_value", name: "Sentimental Value", namePtBr: "Valor Sentimental", details: "Maria Ekerhovd, Andrea Berentsen Ottmar" },
    { id: "sinners", name: "Sinners", namePtBr: "Pecadores", details: "Zinzi Coogler, Sev Ohanian, Ryan Coogler" },
    { id: "train_dreams", name: "Train Dreams", namePtBr: "Sonhos de Trem", details: "Marissa McMahon, Teddy Schwarzman" },
  ],
  directing: [
    { id: "chloe_zhao_hamnet", name: "Chloé Zhao", namePtBr: "Chloé Zhao", details: "Hamnet" },
    { id: "josh_safdie_marty", name: "Josh Safdie", namePtBr: "Josh Safdie", details: "Marty Supreme" },
    { id: "pta_one_battle", name: "Paul Thomas Anderson", namePtBr: "Paul Thomas Anderson", details: "Uma Batalha Após a Outra" },
    { id: "joachim_trier_sentimental", name: "Joachim Trier", namePtBr: "Joachim Trier", details: "Valor Sentimental" },
    { id: "ryan_coogler_sinners", name: "Ryan Coogler", namePtBr: "Ryan Coogler", details: "Pecadores" },
  ],
  actor_leading: [
    { id: "timothee_chalamet_marty", name: "Timothée Chalamet", namePtBr: "Timothée Chalamet", details: "Marty Supreme" },
    { id: "leonardo_dicaprio_one_battle", name: "Leonardo DiCaprio", namePtBr: "Leonardo DiCaprio", details: "Uma Batalha Após a Outra" },
    { id: "ethan_hawke_blue_moon", name: "Ethan Hawke", namePtBr: "Ethan Hawke", details: "Lua Azul" },
    { id: "michael_b_jordan_sinners", name: "Michael B. Jordan", namePtBr: "Michael B. Jordan", details: "Pecadores" },
    { id: "wagner_moura_secret_agent", name: "Wagner Moura", namePtBr: "Wagner Moura", details: "O Agente Secreto" },
  ],
  actress_leading: [
    { id: "jessie_buckley_hamnet", name: "Jessie Buckley", namePtBr: "Jessie Buckley", details: "Hamnet" },
    { id: "rose_byrne_if_i_had_legs", name: "Rose Byrne", namePtBr: "Rose Byrne", details: "Se Eu Tivesse Pernas, Te Chutava" },
    { id: "kate_hudson_song_sung_blue", name: "Kate Hudson", namePtBr: "Kate Hudson", details: "Canção Triste em Azul" },
    { id: "renate_reinsve_sentimental", name: "Renate Reinsve", namePtBr: "Renate Reinsve", details: "Valor Sentimental" },
    { id: "emma_stone_bugonia", name: "Emma Stone", namePtBr: "Emma Stone", details: "Bugônia" },
  ],
  actor_supporting: [
    { id: "benicio_del_toro_one_battle", name: "Benicio Del Toro", namePtBr: "Benicio Del Toro", details: "Uma Batalha Após a Outra" },
    { id: "jacob_elordi_frankenstein", name: "Jacob Elordi", namePtBr: "Jacob Elordi", details: "Frankenstein" },
    { id: "delroy_lindo_sinners", name: "Delroy Lindo", namePtBr: "Delroy Lindo", details: "Pecadores" },
    { id: "sean_penn_one_battle", name: "Sean Penn", namePtBr: "Sean Penn", details: "Uma Batalha Após a Outra" },
    { id: "stellan_skarsgard_sentimental", name: "Stellan Skarsgård", namePtBr: "Stellan Skarsgård", details: "Valor Sentimental" },
  ],
  actress_supporting: [
    { id: "elle_fanning_sentimental", name: "Elle Fanning", namePtBr: "Elle Fanning", details: "Valor Sentimental" },
    { id: "inga_lilleaas_sentimental", name: "Inga Ibsdotter Lilleaas", namePtBr: "Inga Ibsdotter Lilleaas", details: "Valor Sentimental" },
    { id: "amy_madigan_weapons", name: "Amy Madigan", namePtBr: "Amy Madigan", details: "Armas" },
    { id: "wunmi_mosaku_sinners", name: "Wunmi Mosaku", namePtBr: "Wunmi Mosaku", details: "Pecadores" },
    { id: "teyana_taylor_one_battle", name: "Teyana Taylor", namePtBr: "Teyana Taylor", details: "Uma Batalha Após a Outra" },
  ],
  original_screenplay: [
    { id: "blue_moon_screenplay", name: "Blue Moon", namePtBr: "Lua Azul", details: "Robert Kaplow" },
    { id: "it_was_just_accident_screenplay", name: "It Was Just an Accident", namePtBr: "Foi Só um Acidente", details: "Jafar Panahi, Nader Saïvar" },
    { id: "marty_supreme_screenplay", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Ronald Bronstein, Josh Safdie" },
    { id: "sentimental_value_screenplay", name: "Sentimental Value", namePtBr: "Valor Sentimental", details: "Eskil Vogt, Joachim Trier" },
    { id: "sinners_screenplay", name: "Sinners", namePtBr: "Pecadores", details: "Ryan Coogler" },
  ],
  adapted_screenplay: [
    { id: "bugonia_screenplay", name: "Bugonia", namePtBr: "Bugônia", details: "Will Tracy" },
    { id: "frankenstein_screenplay", name: "Frankenstein", namePtBr: "Frankenstein", details: "Guillermo del Toro" },
    { id: "hamnet_screenplay", name: "Hamnet", namePtBr: "Hamnet", details: "Chloé Zhao, Maggie O'Farrell" },
    { id: "one_battle_screenplay", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Paul Thomas Anderson" },
    { id: "train_dreams_screenplay", name: "Train Dreams", namePtBr: "Sonhos de Trem", details: "Clint Bentley, Greg Kwedar" },
  ],
  animated_feature: [
    { id: "arco", name: "Arco", namePtBr: "Arco", details: "Ugo Bienvenu, Félix de Givry, Natalie Portman" },
    { id: "elio", name: "Elio", namePtBr: "Elio", details: "Madeline Sharafian, Domee Shi, Adrian Molina" },
    { id: "kpop_demon_hunters", name: "KPop Demon Hunters", namePtBr: "KPop: Caçadores de Demônios", details: "Maggie Kang, Chris Appelhans" },
    { id: "little_amelie", name: "Little Amélie", namePtBr: "A Pequena Amélie", details: "Maïlys Vallade, Liane-Cho Han" },
    { id: "zootopia_2", name: "Zootopia 2", namePtBr: "Zootopia 2", details: "Jared Bush, Byron Howard" },
  ],
  international_feature: [
    { id: "secret_agent_brazil", name: "The Secret Agent", namePtBr: "O Agente Secreto", details: "Brasil" },
    { id: "it_was_just_accident_france", name: "It Was Just an Accident", namePtBr: "Foi Só um Acidente", details: "França" },
    { id: "sentimental_value_norway", name: "Sentimental Value", namePtBr: "Valor Sentimental", details: "Noruega" },
    { id: "sirat_spain", name: "Sirāt", namePtBr: "Sirāt", details: "Espanha" },
    { id: "voice_hind_rajab_tunisia", name: "The Voice of Hind Rajab", namePtBr: "A Voz de Hind Rajab", details: "Tunísia" },
  ],
  documentary_feature: [
    { id: "alabama_solution", name: "The Alabama Solution", namePtBr: "A Solução do Alabama", details: "Andrew Jarecki, Charlotte Kaufman" },
    { id: "come_see_me_good_light", name: "Come See Me in the Good Light", namePtBr: "Venha Me Ver na Boa Luz", details: "Ryan White, Tig Notaro" },
    { id: "cutting_through_rocks", name: "Cutting through Rocks", namePtBr: "Cortando Pedras", details: "Sara Khaki, Mohammadreza Eyni" },
    { id: "mr_nobody_against_putin", name: "Mr. Nobody against Putin", namePtBr: "Sr. Ninguém contra Putin", details: "A ser determinado" },
    { id: "perfect_neighbor", name: "The Perfect Neighbor", namePtBr: "O Vizinho Perfeito", details: "Geeta Gandbhir, Alisa Payne" },
  ],
  original_score: [
    { id: "bugonia_score", name: "Bugonia", namePtBr: "Bugônia", details: "Jerskin Fendrix" },
    { id: "frankenstein_score", name: "Frankenstein", namePtBr: "Frankenstein", details: "Alexandre Desplat" },
    { id: "hamnet_score", name: "Hamnet", namePtBr: "Hamnet", details: "Max Richter" },
    { id: "one_battle_score", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Jonny Greenwood" },
    { id: "sinners_score", name: "Sinners", namePtBr: "Pecadores", details: "Ludwig Goransson" },
  ],
  original_song: [
    { id: "dear_me_song", name: "Dear Me", namePtBr: "Dear Me", details: "Diane Warren (Relentless)" },
    { id: "golden_song", name: "Golden", namePtBr: "Golden", details: "EJAE, Mark Sonnenblick (KPop Demon Hunters)" },
    { id: "i_lied_to_you_song", name: "I Lied To You", namePtBr: "Eu Menti Pra Você", details: "Raphael Saadiq, Ludwig Goransson (Pecadores)" },
    { id: "sweet_dreams_joy_song", name: "Sweet Dreams Of Joy", namePtBr: "Doces Sonhos de Alegria", details: "Nicholas Pike (Viva Verdi!)" },
    { id: "train_dreams_song", name: "Train Dreams", namePtBr: "Sonhos de Trem", details: "Nick Cave, Bryce Dessner (Sonhos de Trem)" },
  ],
  cinematography: [
    { id: "frankenstein_cinematography", name: "Frankenstein", namePtBr: "Frankenstein", details: "Dan Laustsen" },
    { id: "marty_supreme_cinematography", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Darius Khondji" },
    { id: "one_battle_cinematography", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Michael Bauman" },
    { id: "sinners_cinematography", name: "Sinners", namePtBr: "Pecadores", details: "Autumn Durald Arkapaw" },
    { id: "train_dreams_cinematography", name: "Train Dreams", namePtBr: "Sonhos de Trem", details: "Adolpho Veloso" },
  ],
  film_editing: [
    { id: "f1_editing", name: "F1", namePtBr: "F1", details: "Stephen Mirrione" },
    { id: "marty_supreme_editing", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Ronald Bronstein, Josh Safdie" },
    { id: "one_battle_editing", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Andy Jurgensen" },
    { id: "sentimental_value_editing", name: "Sentimental Value", namePtBr: "Valor Sentimental", details: "Olivier Bugge Coutté" },
    { id: "sinners_editing", name: "Sinners", namePtBr: "Pecadores", details: "Michael P. Shawver" },
  ],
  production_design: [
    { id: "frankenstein_production", name: "Frankenstein", namePtBr: "Frankenstein", details: "Tamara Deverell / Shane Vieau" },
    { id: "hamnet_production", name: "Hamnet", namePtBr: "Hamnet", details: "Fiona Crombie / Alice Felton" },
    { id: "marty_supreme_production", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Jack Fisk / Adam Willis" },
    { id: "one_battle_production", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Florencia Martin / Anthony Carlino" },
    { id: "sinners_production", name: "Sinners", namePtBr: "Pecadores", details: "Hannah Beachler / Monique Champagne" },
  ],
  costume_design: [
    { id: "avatar_costume", name: "Avatar: Fire and Ash", namePtBr: "Avatar: Fogo e Cinzas", details: "Deborah L. Scott" },
    { id: "frankenstein_costume", name: "Frankenstein", namePtBr: "Frankenstein", details: "Kate Hawley" },
    { id: "hamnet_costume", name: "Hamnet", namePtBr: "Hamnet", details: "Malgosia Turzanska" },
    { id: "marty_supreme_costume", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Miyako Bellizzi" },
    { id: "sinners_costume", name: "Sinners", namePtBr: "Pecadores", details: "Ruth E. Carter" },
  ],
  makeup_hairstyling: [
    { id: "frankenstein_makeup", name: "Frankenstein", namePtBr: "Frankenstein", details: "Mike Hill, Jordan Samuel, Cliona Furey" },
    { id: "kokuho_makeup", name: "Kokuho", namePtBr: "Kokuho", details: "Kyoko Toyokawa, Naomi Hibino" },
    { id: "sinners_makeup", name: "Sinners", namePtBr: "Pecadores", details: "Ken Diaz, Mike Fontaine, Shunika Terry" },
    { id: "smashing_machine_makeup", name: "The Smashing Machine", namePtBr: "A Máquina de Lutar", details: "Kazu Hiro, Glen Griffin" },
    { id: "ugly_stepsister_makeup", name: "The Ugly Stepsister", namePtBr: "A Meia-Irmã Feia", details: "Thomas Foldberg, Anne Cathrine Sauerberg" },
  ],
  sound: [
    { id: "f1_sound", name: "F1", namePtBr: "F1", details: "Gareth John, Al Nelson, Gary A. Rizzo" },
    { id: "frankenstein_sound", name: "Frankenstein", namePtBr: "Frankenstein", details: "Greg Chapman, Nathan Robitaille, Brad Zoern" },
    { id: "one_battle_sound", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "José Antonio García, Christopher Scarabosio" },
    { id: "sinners_sound", name: "Sinners", namePtBr: "Pecadores", details: "Chris Welcker, Benjamin A. Burtt, Brandon Proctor" },
    { id: "sirat_sound", name: "Sirāt", namePtBr: "Sirāt", details: "Amanda Villavieja, Laia Casanovas" },
  ],
  visual_effects: [
    { id: "avatar_vfx", name: "Avatar: Fire and Ash", namePtBr: "Avatar: Fogo e Cinzas", details: "Joe Letteri, Richard Baneham, Eric Saindon" },
    { id: "f1_vfx", name: "F1", namePtBr: "F1", details: "Ryan Tudhope, Nicolas Chevallier, Robert Harrington" },
    { id: "jurassic_world_rebirth_vfx", name: "Jurassic World Rebirth", namePtBr: "Jurassic World: Renascimento", details: "David Vickery, Stephen Aplin" },
    { id: "lost_bus_vfx", name: "The Lost Bus", namePtBr: "O Ônibus Perdido", details: "Charlie Noble, David Zaretti, Russell Bowen" },
    { id: "sinners_vfx", name: "Sinners", namePtBr: "Pecadores", details: "Michael Ralla, Espen Nordahl, Guido Wolter" },
  ],
  casting: [
    { id: "hamnet_casting", name: "Hamnet", namePtBr: "Hamnet", details: "Nina Gold" },
    { id: "marty_supreme_casting", name: "Marty Supreme", namePtBr: "Marty Supreme", details: "Jennifer Venditti" },
    { id: "one_battle_casting", name: "One Battle after Another", namePtBr: "Uma Batalha Após a Outra", details: "Cassandra Kulukundis" },
    { id: "secret_agent_casting", name: "The Secret Agent", namePtBr: "O Agente Secreto", details: "Gabriel Domingues" },
    { id: "sinners_casting", name: "Sinners", namePtBr: "Pecadores", details: "Francine Maisler" },
  ],
  documentary_short: [
    { id: "all_empty_rooms", name: "All the Empty Rooms", namePtBr: "Todos os Quartos Vazios", details: "Joshua Seftel, Conall Jones" },
    { id: "armed_only_camera", name: "Armed Only with a Camera", namePtBr: "Armado Apenas com uma Câmera", details: "Craig Renaud, Juan Arredondo" },
    { id: "children_no_more", name: "Children No More", namePtBr: "Crianças Nunca Mais", details: "Hilla Medalia, Sheila Nevins" },
    { id: "devil_is_busy", name: "The Devil Is Busy", namePtBr: "O Diabo Está Ocupado", details: "Christalyn Hampton, Geeta Gandbhir" },
    { id: "perfectly_strangeness", name: "Perfectly a Strangeness", namePtBr: "Perfeitamente Estranho", details: "Alison McAlpine" },
  ],
  live_action_short: [
    { id: "butchers_stain", name: "Butcher's Stain", namePtBr: "A Mancha do Açougueiro", details: "Meyer Levinson-Blount, Oron Caspi" },
    { id: "friend_of_dorothy", name: "A Friend of Dorothy", namePtBr: "Um Amigo de Dorothy", details: "Lee Knight, James Dean" },
    { id: "jane_austen_period_drama", name: "Jane Austen's Period Drama", namePtBr: "O Drama de Época de Jane Austen", details: "Julia Aks, Steve Pinder" },
    { id: "the_singers", name: "The Singers", namePtBr: "Os Cantores", details: "Sam A. Davis, Jack Piatt" },
    { id: "two_people_exchanging_saliva", name: "Two People Exchanging Saliva", namePtBr: "Duas Pessoas Trocando Saliva", details: "Alexandre Singh" },
  ],
  animated_short: [
    { id: "butterfly_short", name: "Butterfly", namePtBr: "Borboleta", details: "Florence Miailhe, Ron Dyens" },
    { id: "forevergreen", name: "Forevergreen", namePtBr: "Sempre Verde", details: "Nathan Engelhardt, Jeremy Spears" },
    { id: "girl_who_cried_pearls", name: "The Girl Who Cried Pearls", namePtBr: "A Garota que Chorava Pérolas", details: "Chris Lavis, Maciek Szczerbowski" },
    { id: "retirement_plan", name: "Retirement Plan", namePtBr: "Plano de Aposentadoria", details: "John Kelly, Andrew Freedman" },
    { id: "three_sisters", name: "The Three Sisters", namePtBr: "As Três Irmãs", details: "Konstantin Bronzit" },
  ],
};

// Map nominee to their associated film (for "most awarded" calculation)
// For acting/directing categories, this maps to the film they're in
// Complete nominee-to-film mapping. Built explicitly to avoid fragile suffix-stripping
// that breaks on films like "one_battle_after_another" (stripped to "one_battle").
const nomineeToFilm: Record<string, string> = {
  // best_picture — nominee IS the film
  bugonia: "bugonia", f1: "f1", frankenstein: "frankenstein", hamnet: "hamnet",
  marty_supreme: "marty_supreme", one_battle_after_another: "one_battle_after_another",
  the_secret_agent: "the_secret_agent", sentimental_value: "sentimental_value",
  sinners: "sinners", train_dreams: "train_dreams",
  // directing
  chloe_zhao_hamnet: "hamnet", josh_safdie_marty: "marty_supreme",
  pta_one_battle: "one_battle_after_another", joachim_trier_sentimental: "sentimental_value",
  ryan_coogler_sinners: "sinners",
  // actor leading
  timothee_chalamet_marty: "marty_supreme", leonardo_dicaprio_one_battle: "one_battle_after_another",
  ethan_hawke_blue_moon: "blue_moon", michael_b_jordan_sinners: "sinners",
  wagner_moura_secret_agent: "the_secret_agent",
  // actress leading
  jessie_buckley_hamnet: "hamnet", rose_byrne_if_i_had_legs: "if_i_had_legs",
  kate_hudson_song_sung_blue: "song_sung_blue", renate_reinsve_sentimental: "sentimental_value",
  emma_stone_bugonia: "bugonia",
  // actor supporting
  benicio_del_toro_one_battle: "one_battle_after_another", jacob_elordi_frankenstein: "frankenstein",
  delroy_lindo_sinners: "sinners", sean_penn_one_battle: "one_battle_after_another",
  stellan_skarsgard_sentimental: "sentimental_value",
  // actress supporting
  elle_fanning_sentimental: "sentimental_value", inga_lilleaas_sentimental: "sentimental_value",
  amy_madigan_weapons: "weapons", wunmi_mosaku_sinners: "sinners",
  teyana_taylor_one_battle: "one_battle_after_another",
  // original_screenplay
  blue_moon_screenplay: "blue_moon", it_was_just_accident_screenplay: "it_was_just_accident",
  marty_supreme_screenplay: "marty_supreme", sentimental_value_screenplay: "sentimental_value",
  sinners_screenplay: "sinners",
  // adapted_screenplay
  bugonia_screenplay: "bugonia", frankenstein_screenplay: "frankenstein",
  hamnet_screenplay: "hamnet", one_battle_screenplay: "one_battle_after_another",
  train_dreams_screenplay: "train_dreams",
  // animated_feature
  arco: "arco", elio: "elio", kpop_demon_hunters: "kpop_demon_hunters",
  little_amelie: "little_amelie", zootopia_2: "zootopia_2",
  // international_feature
  secret_agent_brazil: "the_secret_agent", it_was_just_accident_france: "it_was_just_accident",
  sentimental_value_norway: "sentimental_value", sirat_spain: "sirat",
  voice_hind_rajab_tunisia: "voice_hind_rajab",
  // documentary_feature
  alabama_solution: "alabama_solution", come_see_me_good_light: "come_see_me_good_light",
  cutting_through_rocks: "cutting_through_rocks", mr_nobody_against_putin: "mr_nobody_against_putin",
  perfect_neighbor: "perfect_neighbor",
  // original_score
  bugonia_score: "bugonia", frankenstein_score: "frankenstein", hamnet_score: "hamnet",
  one_battle_score: "one_battle_after_another", sinners_score: "sinners",
  // original_song
  dear_me_song: "dear_me", golden_song: "kpop_demon_hunters",
  i_lied_to_you_song: "sinners", sweet_dreams_joy_song: "viva_verdi",
  train_dreams_song: "train_dreams",
  // cinematography
  frankenstein_cinematography: "frankenstein", marty_supreme_cinematography: "marty_supreme",
  one_battle_cinematography: "one_battle_after_another", sinners_cinematography: "sinners",
  train_dreams_cinematography: "train_dreams",
  // film_editing
  f1_editing: "f1", marty_supreme_editing: "marty_supreme",
  one_battle_editing: "one_battle_after_another", sentimental_value_editing: "sentimental_value",
  sinners_editing: "sinners",
  // production_design
  frankenstein_production: "frankenstein", hamnet_production: "hamnet",
  marty_supreme_production: "marty_supreme", one_battle_production: "one_battle_after_another",
  sinners_production: "sinners",
  // costume_design
  avatar_costume: "avatar_fire_and_ash", frankenstein_costume: "frankenstein",
  hamnet_costume: "hamnet", marty_supreme_costume: "marty_supreme", sinners_costume: "sinners",
  // makeup_hairstyling
  frankenstein_makeup: "frankenstein", kokuho_makeup: "kokuho",
  sinners_makeup: "sinners", smashing_machine_makeup: "smashing_machine",
  ugly_stepsister_makeup: "ugly_stepsister",
  // sound
  f1_sound: "f1", frankenstein_sound: "frankenstein",
  one_battle_sound: "one_battle_after_another", sinners_sound: "sinners", sirat_sound: "sirat",
  // visual_effects
  avatar_vfx: "avatar_fire_and_ash", f1_vfx: "f1",
  jurassic_world_rebirth_vfx: "jurassic_world_rebirth", lost_bus_vfx: "lost_bus",
  sinners_vfx: "sinners",
  // casting
  hamnet_casting: "hamnet", marty_supreme_casting: "marty_supreme",
  one_battle_casting: "one_battle_after_another", secret_agent_casting: "the_secret_agent",
  sinners_casting: "sinners",
  // documentary_short
  all_empty_rooms: "all_empty_rooms", armed_only_camera: "armed_only_camera",
  children_no_more: "children_no_more", devil_is_busy: "devil_is_busy",
  perfectly_strangeness: "perfectly_strangeness",
  // live_action_short
  butchers_stain: "butchers_stain", friend_of_dorothy: "friend_of_dorothy",
  jane_austen_period_drama: "jane_austen_period_drama", the_singers: "the_singers",
  two_people_exchanging_saliva: "two_people_exchanging_saliva",
  // animated_short
  butterfly_short: "butterfly", forevergreen: "forevergreen",
  girl_who_cried_pearls: "girl_who_cried_pearls", retirement_plan: "retirement_plan",
  three_sisters: "three_sisters",
};

export function getNomineeFilmId(categoryId: string, nomineeId: string): string | null {
  return nomineeToFilm[nomineeId] || null;
}

// Film names in PT-BR for the "most awarded" display
export const filmNamesPtBr: Record<string, string> = {
  // Main films (best_picture + acting/directing)
  bugonia: "Bugônia",
  f1: "F1",
  frankenstein: "Frankenstein",
  hamnet: "Hamnet",
  marty_supreme: "Marty Supreme",
  one_battle_after_another: "Uma Batalha Após a Outra",
  the_secret_agent: "O Agente Secreto",
  sentimental_value: "Valor Sentimental",
  sinners: "Pecadores",
  train_dreams: "Sonhos de Trem",
  blue_moon: "Lua Azul",
  if_i_had_legs: "Se Eu Tivesse Pernas",
  song_sung_blue: "Canção Triste em Azul",
  weapons: "Armas",
  // Animated feature
  arco: "Arco",
  elio: "Elio",
  kpop_demon_hunters: "KPop: Caçadores de Demônios",
  little_amelie: "A Pequena Amélie",
  zootopia_2: "Zootopia 2",
  // International feature
  it_was_just_accident: "Foi Só um Acidente",
  sirat: "Sirāt",
  voice_hind_rajab: "A Voz de Hind Rajab",
  // Documentary feature
  alabama_solution: "A Solução do Alabama",
  come_see_me_good_light: "Venha Me Ver na Boa Luz",
  cutting_through_rocks: "Cortando Pedras",
  mr_nobody_against_putin: "Sr. Ninguém contra Putin",
  perfect_neighbor: "O Vizinho Perfeito",
  // Original song films
  dear_me: "Relentless",
  viva_verdi: "Viva Verdi!",
  // Technical films
  avatar_fire_and_ash: "Avatar: Fogo e Cinzas",
  jurassic_world_rebirth: "Jurassic World: Renascimento",
  lost_bus: "O Ônibus Perdido",
  kokuho: "Kokuho",
  smashing_machine: "A Máquina de Lutar",
  ugly_stepsister: "A Meia-Irmã Feia",
  // Documentary shorts
  all_empty_rooms: "Todos os Quartos Vazios",
  armed_only_camera: "Armado Apenas com uma Câmera",
  children_no_more: "Crianças Nunca Mais",
  devil_is_busy: "O Diabo Está Ocupado",
  perfectly_strangeness: "Perfeitamente Estranho",
  // Live action shorts
  butchers_stain: "A Mancha do Açougueiro",
  friend_of_dorothy: "Um Amigo de Dorothy",
  jane_austen_period_drama: "O Drama de Época de Jane Austen",
  the_singers: "Os Cantores",
  two_people_exchanging_saliva: "Duas Pessoas Trocando Saliva",
  // Animated shorts
  butterfly: "Borboleta",
  forevergreen: "Sempre Verde",
  girl_who_cried_pearls: "A Garota que Chorava Pérolas",
  retirement_plan: "Plano de Aposentadoria",
  three_sisters: "As Três Irmãs",
};
