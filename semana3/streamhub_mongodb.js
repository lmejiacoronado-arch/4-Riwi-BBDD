// =============================================================
//   STREAMHUB - Content and User Management in MongoDB
//   Complete Script: CRUD, Indexes, and Aggregations
// =============================================================

// ─────────────────────────────────────────────────────────────
//  INITIAL SETUP
// ─────────────────────────────────────────────────────────────
use("streamhub");

// =============================================================
// TASK 1 - DOCUMENT ANALYSIS AND DESIGN
// =============================================================
//
//  Collections defined for StreamHub:
//
//  1. users          → Subscriber information and viewing history
//  2. contents       → Movies and series (audiovisual content)
//  3. ratings        → Reviews and scores per user
//  4. lists          → Custom lists (favorites, etc.)
//
//  Relationships:
//  • ratings.userId      → users._id
//  • ratings.contentId   → contents._id
//  • lists.userId        → users._id
//  • lists.contents[]    → contents._id
//
// =============================================================


// =============================================================
// TASK 2 - DATA INSERTION
// =============================================================

// ── Collection: users ─────────────────────────────────────────
db.users.insertMany([
  {
    _id: ObjectId("64a1000000000000000001aa"),
    name: "Ana García",
    email: "ana.garcia@email.com",
    plan: "premium",
    country: "Colombia",
    registrationDate: new Date("2022-03-15"),
    active: true,
    profile: {
      language: "es",
      avatarUrl: "https://cdn.streamhub.com/avatars/ana.jpg",
      maturityAge: 18
    },
    history: [
      { contentId: ObjectId("64a2000000000000000001aa"), watchedDate: new Date("2024-01-10"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000002aa"), watchedDate: new Date("2024-02-05"), progress: 75 },
      { contentId: ObjectId("64a2000000000000000003aa"), watchedDate: new Date("2024-02-20"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000004aa"), watchedDate: new Date("2024-03-01"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000005aa"), watchedDate: new Date("2024-03-15"), progress: 50 },
      { contentId: ObjectId("64a2000000000000000006aa"), watchedDate: new Date("2024-04-01"), progress: 100 }
    ],
    totalWatched: 6
  },
  {
    _id: ObjectId("64a1000000000000000002aa"),
    name: "Carlos Martínez",
    email: "carlos.m@email.com",
    plan: "basic",
    country: "Mexico",
    registrationDate: new Date("2023-07-01"),
    active: true,
    profile: {
      language: "es",
      avatarUrl: "https://cdn.streamhub.com/avatars/carlos.jpg",
      maturityAge: 16
    },
    history: [
      { contentId: ObjectId("64a2000000000000000001aa"), watchedDate: new Date("2024-01-20"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000007aa"), watchedDate: new Date("2024-02-10"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000008aa"), watchedDate: new Date("2024-03-05"), progress: 60 }
    ],
    totalWatched: 3
  },
  {
    _id: ObjectId("64a1000000000000000003aa"),
    name: "Lucía Fernández",
    email: "lucia.f@email.com",
    plan: "premium",
    country: "Argentina",
    registrationDate: new Date("2021-11-20"),
    active: true,
    profile: {
      language: "es",
      avatarUrl: "https://cdn.streamhub.com/avatars/lucia.jpg",
      maturityAge: 18
    },
    history: [
      { contentId: ObjectId("64a2000000000000000003aa"), watchedDate: new Date("2024-01-05"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000005aa"), watchedDate: new Date("2024-01-25"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000009aa"), watchedDate: new Date("2024-02-14"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000010aa"), watchedDate: new Date("2024-02-28"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000006aa"), watchedDate: new Date("2024-03-10"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000011aa"), watchedDate: new Date("2024-03-22"), progress: 80 },
      { contentId: ObjectId("64a2000000000000000012aa"), watchedDate: new Date("2024-04-05"), progress: 100 }
    ],
    totalWatched: 7
  },
  {
    _id: ObjectId("64a1000000000000000004aa"),
    name: "Pedro Ruiz",
    email: "pedro.ruiz@email.com",
    plan: "family",
    country: "Spain",
    registrationDate: new Date("2020-05-10"),
    active: false,
    profile: {
      language: "es",
      avatarUrl: "https://cdn.streamhub.com/avatars/pedro.jpg",
      maturityAge: 18
    },
    history: [
      { contentId: ObjectId("64a2000000000000000002aa"), watchedDate: new Date("2023-12-01"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000004aa"), watchedDate: new Date("2023-12-20"), progress: 100 }
    ],
    totalWatched: 2
  },
  {
    _id: ObjectId("64a1000000000000000005aa"),
    name: "Sofía López",
    email: "sofia.lopez@email.com",
    plan: "premium",
    country: "Chile",
    registrationDate: new Date("2022-09-30"),
    active: true,
    profile: {
      language: "es",
      avatarUrl: "https://cdn.streamhub.com/avatars/sofia.jpg",
      maturityAge: 13
    },
    history: [
      { contentId: ObjectId("64a2000000000000000008aa"), watchedDate: new Date("2024-01-15"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000009aa"), watchedDate: new Date("2024-02-01"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000010aa"), watchedDate: new Date("2024-02-18"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000011aa"), watchedDate: new Date("2024-03-05"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000012aa"), watchedDate: new Date("2024-03-20"), progress: 100 },
      { contentId: ObjectId("64a2000000000000000001aa"), watchedDate: new Date("2024-04-02"), progress: 100 }
    ],
    totalWatched: 6
  }
]);

// ── Collection: contents ──────────────────────────────────────
db.contents.insertMany([
  {
    _id: ObjectId("64a2000000000000000001aa"),
    title: "The Origin of Fire",
    type: "movie",
    genres: ["action", "adventure", "science fiction"],
    year: 2021,
    durationMin: 148,
    rating: "PG-13",
    score: 8.2,
    totalRatings: 15420,
    synopsis: "A group of scientists discovers the origin of fire in the universe.",
    director: "James Cameron",
    cast: ["Tom Hardy", "Scarlett Johansson", "Idris Elba"],
    languages: ["Spanish", "English", "French"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["epic", "special effects", "blockbuster"]
  },
  {
    _id: ObjectId("64a2000000000000000002aa"),
    title: "Shadows of the Past",
    type: "movie",
    genres: ["drama", "thriller"],
    year: 2019,
    durationMin: 112,
    rating: "R",
    score: 7.6,
    totalRatings: 8930,
    synopsis: "A detective investigates crimes that connect him to his dark past.",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Ana de Armas"],
    languages: ["English", "Spanish"],
    availableIn: ["CO", "MX", "ES", "CL"],
    tags: ["neo-noir", "psychological", "suspense"]
  },
  {
    _id: ObjectId("64a2000000000000000003aa"),
    title: "The House of Secrets",
    type: "series",
    genres: ["mystery", "drama"],
    year: 2022,
    seasons: 3,
    episodesPerSeason: [10, 8, 12],
    episodeDurationMin: 45,
    rating: "TV-MA",
    score: 9.0,
    totalRatings: 32100,
    synopsis: "A family uncovers dark secrets inside their ancestral mansion.",
    creator: "Ryan Murphy",
    cast: ["Sandra Oh", "Lupita Nyong'o", "Pedro Pascal"],
    languages: ["Spanish", "English"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["suspense", "family", "psychological horror"]
  },
  {
    _id: ObjectId("64a2000000000000000004aa"),
    title: "Maximum Speed",
    type: "movie",
    genres: ["action", "comedy"],
    year: 2023,
    durationMin: 98,
    rating: "PG-13",
    score: 6.8,
    totalRatings: 5670,
    synopsis: "A race car driver accidentally becomes a spy.",
    director: "Michael Bay",
    cast: ["Dwayne Johnson", "Kevin Hart"],
    languages: ["English", "Spanish"],
    availableIn: ["CO", "MX", "AR"],
    tags: ["entertainment", "humor", "action"]
  },
  {
    _id: ObjectId("64a2000000000000000005aa"),
    title: "Parallel Worlds",
    type: "series",
    genres: ["science fiction", "drama"],
    year: 2020,
    seasons: 2,
    episodesPerSeason: [8, 10],
    episodeDurationMin: 55,
    rating: "TV-14",
    score: 8.7,
    totalRatings: 21500,
    synopsis: "Scientists travel between alternate dimensions to save humanity.",
    creator: "J.J. Abrams",
    cast: ["Cate Blanchett", "Mahershala Ali"],
    languages: ["English", "Spanish", "Portuguese"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["multiverse", "philosophical", "dystopia"]
  },
  {
    _id: ObjectId("64a2000000000000000006aa"),
    title: "Cooking with Fire",
    type: "movie",
    genres: ["comedy", "romance"],
    year: 2022,
    durationMin: 105,
    rating: "PG",
    score: 7.1,
    totalRatings: 9800,
    synopsis: "A star chef and a journalist form an unexpected romance.",
    director: "Nora Ephron",
    cast: ["Emma Stone", "Ryan Reynolds"],
    languages: ["English", "Spanish"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["feel-good", "gastronomy", "romantic comedy"]
  },
  {
    _id: ObjectId("64a2000000000000000007aa"),
    title: "The Last Warrior",
    type: "movie",
    genres: ["action", "fantasy"],
    year: 2021,
    durationMin: 135,
    rating: "PG-13",
    score: 7.9,
    totalRatings: 12300,
    synopsis: "The last descendant of a warrior race must save his world.",
    director: "Zack Snyder",
    cast: ["John Boyega", "Lupita Nyong'o"],
    languages: ["English"],
    availableIn: ["CO", "MX", "AR"],
    tags: ["epic", "epic fantasy", "mythology"]
  },
  {
    _id: ObjectId("64a2000000000000000008aa"),
    title: "Small Big Dreams",
    type: "series",
    genres: ["animation", "family"],
    year: 2023,
    seasons: 1,
    episodesPerSeason: [13],
    episodeDurationMin: 22,
    rating: "TV-G",
    score: 8.5,
    totalRatings: 18700,
    synopsis: "Adventures of kids who discover their passion for science.",
    creator: "Pixar Studios",
    cast: ["Voice: Gal Gadot", "Voice: Will Smith"],
    languages: ["Spanish", "English", "Portuguese", "French"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["educational", "kids", "motivational"]
  },
  {
    _id: ObjectId("64a2000000000000000009aa"),
    title: "Crime Borders",
    type: "series",
    genres: ["crime", "drama", "thriller"],
    year: 2021,
    seasons: 4,
    episodesPerSeason: [10, 10, 8, 12],
    episodeDurationMin: 50,
    rating: "TV-MA",
    score: 9.3,
    totalRatings: 45600,
    synopsis: "An incorruptible prosecutor confronts transnational organized crime.",
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Giancarlo Esposito"],
    languages: ["Spanish", "English"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["cartel", "power", "morality"]
  },
  {
    _id: ObjectId("64a2000000000000000010aa"),
    title: "Love in Tokyo",
    type: "movie",
    genres: ["romance", "drama"],
    year: 2022,
    durationMin: 118,
    rating: "PG-13",
    score: 7.4,
    totalRatings: 7200,
    synopsis: "Two strangers meet in Tokyo and share an intense, fleeting love.",
    director: "Sofia Coppola",
    cast: ["Timothée Chalamet", "Zendaya"],
    languages: ["English", "Japanese"],
    availableIn: ["CO", "AR", "ES", "CL"],
    tags: ["travel", "melancholy", "love"]
  },
  {
    _id: ObjectId("64a2000000000000000011aa"),
    title: "Red Code",
    type: "movie",
    genres: ["action", "thriller", "espionage"],
    year: 2023,
    durationMin: 127,
    rating: "R",
    score: 7.8,
    totalRatings: 11000,
    synopsis: "An intelligence agent must dismantle a global conspiracy.",
    director: "Christopher Nolan",
    cast: ["Charlize Theron", "Michael B. Jordan"],
    languages: ["English", "Russian", "Arabic"],
    availableIn: ["CO", "MX", "AR", "ES", "CL"],
    tags: ["espionage", "fast-paced action", "conspiracy"]
  },
  {
    _id: ObjectId("64a2000000000000000012aa"),
    title: "One Night's Story",
    type: "movie",
    genres: ["drama", "comedy"],
    year: 2020,
    durationMin: 95,
    rating: "R",
    score: 8.0,
    totalRatings: 13400,
    synopsis: "The lives of five strangers intertwine over one night in Madrid.",
    director: "Pedro Almodóvar",
    cast: ["Antonio Banderas", "Penélope Cruz", "Javier Bardem"],
    languages: ["Spanish"],
    availableIn: ["CO", "MX", "AR", "ES"],
    tags: ["Spanish cinema", "ensemble", "everyday life"]
  }
]);

// ── Collection: ratings ───────────────────────────────────────
db.ratings.insertMany([
  {
    _id: ObjectId("64a3000000000000000001aa"),
    userId: ObjectId("64a1000000000000000001aa"),
    contentId: ObjectId("64a2000000000000000001aa"),
    score: 9,
    review: "Impressive movie, the visual effects are spectacular.",
    date: new Date("2024-01-12"),
    likes: 45,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000002aa"),
    userId: ObjectId("64a1000000000000000001aa"),
    contentId: ObjectId("64a2000000000000000003aa"),
    score: 10,
    review: "The best series I've seen in years. The final twist is incredible.",
    date: new Date("2024-02-22"),
    likes: 120,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000003aa"),
    userId: ObjectId("64a1000000000000000002aa"),
    contentId: ObjectId("64a2000000000000000001aa"),
    score: 7,
    review: "Good action movie, although somewhat predictable.",
    date: new Date("2024-01-22"),
    likes: 18,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000004aa"),
    userId: ObjectId("64a1000000000000000003aa"),
    contentId: ObjectId("64a2000000000000000009aa"),
    score: 10,
    review: "Masterpiece of the crime genre. Flawless performances.",
    date: new Date("2024-02-16"),
    likes: 230,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000005aa"),
    userId: ObjectId("64a1000000000000000003aa"),
    contentId: ObjectId("64a2000000000000000005aa"),
    score: 8,
    review: "Fascinating concept, though some seasons slow the pace down.",
    date: new Date("2024-01-27"),
    likes: 67,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000006aa"),
    userId: ObjectId("64a1000000000000000005aa"),
    contentId: ObjectId("64a2000000000000000008aa"),
    score: 9,
    review: "Perfect for watching with kids. Fun and educational.",
    date: new Date("2024-01-17"),
    likes: 88,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000007aa"),
    userId: ObjectId("64a1000000000000000001aa"),
    contentId: ObjectId("64a2000000000000000006aa"),
    score: 7,
    review: "Entertaining with great chemistry between the leads.",
    date: new Date("2024-04-03"),
    likes: 32,
    replied: false
  },
  {
    _id: ObjectId("64a3000000000000000008aa"),
    userId: ObjectId("64a1000000000000000004aa"),
    contentId: ObjectId("64a2000000000000000002aa"),
    score: 8,
    review: "Intense thriller, kept me on edge until the very end.",
    date: new Date("2023-12-03"),
    likes: 55,
    replied: false
  }
]);

// ── Collection: lists ─────────────────────────────────────────
db.lists.insertMany([
  {
    _id: ObjectId("64a4000000000000000001aa"),
    userId: ObjectId("64a1000000000000000001aa"),
    name: "My Favorites",
    description: "The movies I've enjoyed the most",
    public: true,
    contents: [
      ObjectId("64a2000000000000000001aa"),
      ObjectId("64a2000000000000000003aa"),
      ObjectId("64a2000000000000000009aa")
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-04-01")
  },
  {
    _id: ObjectId("64a4000000000000000002aa"),
    userId: ObjectId("64a1000000000000000003aa"),
    name: "Watch This Weekend",
    description: "Things to watch this weekend",
    public: false,
    contents: [
      ObjectId("64a2000000000000000011aa"),
      ObjectId("64a2000000000000000012aa")
    ],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01")
  },
  {
    _id: ObjectId("64a4000000000000000003aa"),
    userId: ObjectId("64a1000000000000000005aa"),
    name: "Family",
    description: "Content suitable for the whole family",
    public: true,
    contents: [
      ObjectId("64a2000000000000000008aa"),
      ObjectId("64a2000000000000000006aa"),
      ObjectId("64a2000000000000000004aa")
    ],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-03-25")
  }
]);


// =============================================================
// TASK 3 - QUERIES (READ) WITH OPERATORS
// =============================================================

// ── 3.1 Movies longer than 120 min ($gt) ──────────────────────
db.contents.find(
  { type: "movie", durationMin: { $gt: 120 } },
  { title: 1, durationMin: 1, genres: 1, _id: 0 }
);

// ── 3.2 Users who watched more than 5 contents ($gt) ──────────
db.users.find(
  { totalWatched: { $gt: 5 } },
  { name: 1, email: 1, totalWatched: 1, plan: 1, _id: 0 }
);

// ── 3.3 Content with score between 8.0 and 9.5 ($gt/$lt) ──────
db.contents.find(
  { score: { $gt: 8.0, $lt: 9.5 } },
  { title: 1, score: 1, type: 1, _id: 0 }
);

// ── 3.4 Users on the premium plan ($eq) ───────────────────────
db.users.find(
  { plan: { $eq: "premium" } },
  { name: 1, country: 1, plan: 1, active: 1, _id: 0 }
);

// ── 3.5 Contents of specific genres ($in) ─────────────────────
db.contents.find(
  { genres: { $in: ["action", "thriller"] } },
  { title: 1, genres: 1, score: 1, _id: 0 }
);

// ── 3.6 Action movies shorter than 130 min ($and) ─────────────
db.contents.find({
  $and: [
    { type: "movie" },
    { genres: "action" },
    { durationMin: { $lt: 130 } }
  ]
}, { title: 1, durationMin: 1, genres: 1, _id: 0 });

// ── 3.7 Top-rated series or movies ($or) ──────────────────────
db.contents.find({
  $or: [
    { type: "series", score: { $gt: 9.0 } },
    { type: "movie", score: { $gt: 8.5 } }
  ]
}, { title: 1, type: 1, score: 1, _id: 0 });

// ── 3.8 Titles containing "fire" or "code" ($regex) ───────────
db.contents.find(
  { title: { $regex: /fire|code/i } },
  { title: 1, type: 1, _id: 0 }
);

// ── 3.9 Users from Latin American countries ($in + $regex) ────
db.users.find({
  $or: [
    { country: { $in: ["Colombia", "Mexico", "Argentina", "Chile"] } },
    { email: { $regex: /@email\.com$/ } }
  ]
}, { name: 1, country: 1, email: 1, _id: 0 });

// ── 3.10 Series with 3 or more seasons ($gte) ─────────────────
db.contents.find(
  { type: "series", seasons: { $gte: 3 } },
  { title: 1, seasons: 1, score: 1, _id: 0 }
);

// ── 3.11 Perfect score ratings ($eq) ──────────────────────────
db.ratings.find(
  { score: { $eq: 10 } },
  { userId: 1, contentId: 1, review: 1, score: 1, _id: 0 }
);

// ── 3.12 Contents available in Colombia and Spain ($and/$in) ───
db.contents.find({
  $and: [
    { availableIn: { $in: ["CO"] } },
    { availableIn: { $in: ["ES"] } }
  ]
}, { title: 1, availableIn: 1, _id: 0 });


// =============================================================
// TASK 4 - UPDATES AND DELETIONS
// =============================================================

// ── 4.1 updateOne: Update a content's score ───────────────────
db.contents.updateOne(
  { _id: ObjectId("64a2000000000000000001aa") },
  {
    $set: { score: 8.4 },
    $inc: { totalRatings: 1 }
  }
);

// ── 4.2 updateOne: Mark a user as inactive ────────────────────
db.users.updateOne(
  { email: "pedro.ruiz@email.com" },
  { $set: { active: false, deactivationDate: new Date() } }
);

// ── 4.3 updateMany: Add tag to all thrillers ──────────────────
db.contents.updateMany(
  { genres: { $in: ["thriller"] } },
  { $addToSet: { tags: "expert-recommended" } }
);

// ── 4.4 updateMany: Upgrade basic plan to standard ────────────
db.users.updateMany(
  { plan: "basic" },
  { $set: { plan: "standard", updatedAt: new Date() } }
);

// ── 4.5 updateOne: Add new item to user's watch history ───────
db.users.updateOne(
  { _id: ObjectId("64a1000000000000000002aa") },
  {
    $push: {
      history: {
        contentId: ObjectId("64a2000000000000000003aa"),
        watchedDate: new Date(),
        progress: 30
      }
    },
    $inc: { totalWatched: 1 }
  }
);

// ── 4.6 updateOne: Add content to a list ──────────────────────
db.lists.updateOne(
  { _id: ObjectId("64a4000000000000000001aa") },
  {
    $addToSet: { contents: ObjectId("64a2000000000000000011aa") },
    $set: { updatedAt: new Date() }
  }
);

// ── 4.7 deleteOne: Delete a specific rating ───────────────────
db.ratings.deleteOne(
  { userId: ObjectId("64a1000000000000000004aa"),
    contentId: ObjectId("64a2000000000000000002aa") }
);

// ── 4.8 deleteMany: Delete ratings with few likes ─────────────
db.ratings.deleteMany(
  { likes: { $lt: 5 } }
);


// =============================================================
// TASK 5 - INDEXES FOR PERFORMANCE
// =============================================================

// ── 5.1 Indexes on: contents ──────────────────────────────────
// Justification: "title" is queried with $regex and direct search.
db.contents.createIndex(
  { title: 1 },
  { name: "idx_contents_title" }
);

// Justification: "genres" appears in almost all filtering queries.
db.contents.createIndex(
  { genres: 1 },
  { name: "idx_contents_genres" }
);

// Justification: combined type+score filters are very frequent.
db.contents.createIndex(
  { type: 1, score: -1 },
  { name: "idx_contents_type_score" }
);

// Justification: supports regional availability queries.
db.contents.createIndex(
  { availableIn: 1 },
  { name: "idx_contents_availableIn" }
);

// ── 5.2 Indexes on: users ─────────────────────────────────────
// Justification: email is unique and used for authentication/lookup.
db.users.createIndex(
  { email: 1 },
  { unique: true, name: "idx_users_email_unique" }
);

// Justification: queries for users by plan and total watched count.
db.users.createIndex(
  { plan: 1, totalWatched: -1 },
  { name: "idx_users_plan_watched" }
);

// ── 5.3 Indexes on: ratings ───────────────────────────────────
// Justification: frequent searches for ratings by content.
db.ratings.createIndex(
  { contentId: 1, score: -1 },
  { name: "idx_ratings_content_score" }
);

// Justification: to retrieve a user's rating history.
db.ratings.createIndex(
  { userId: 1, date: -1 },
  { name: "idx_ratings_user_date" }
);

// ── 5.4 Verify created indexes ────────────────────────────────
db.contents.getIndexes();
db.users.getIndexes();
db.ratings.getIndexes();


// =============================================================
// TASK 5 (BONUS) - AGGREGATION PIPELINES
// =============================================================

// ─────────────────────────────────────────────────────────────
//  AGGREGATION 1:
//  Average score and total ratings per genre
// ─────────────────────────────────────────────────────────────
db.contents.aggregate([
  // Step 1: Only contents with enough ratings
  { $match: { totalRatings: { $gt: 5000 } } },

  // Step 2: Deconstruct the genres array
  { $unwind: "$genres" },

  // Step 3: Group by genre and calculate metrics
  {
    $group: {
      _id: "$genres",
      averageScore: { $avg: "$score" },
      totalRatings: { $sum: "$totalRatings" },
      titleCount: { $sum: 1 },
      titles: { $push: "$title" }
    }
  },

  // Step 4: Project readable fields
  {
    $project: {
      _id: 0,
      genre: "$_id",
      averageScore: { $round: ["$averageScore", 2] },
      totalRatings: 1,
      titleCount: 1,
      titles: 1
    }
  },

  // Step 5: Sort by average score descending
  { $sort: { averageScore: -1 } }
]);


// ─────────────────────────────────────────────────────────────
//  AGGREGATION 2:
//  Top 5 most-rated contents with their review info
// ─────────────────────────────────────────────────────────────
db.ratings.aggregate([
  // Step 1: Group ratings by content
  {
    $group: {
      _id: "$contentId",
      userAverage: { $avg: "$score" },
      totalReviews: { $sum: 1 },
      totalLikes: { $sum: "$likes" },
      maxScore: { $max: "$score" },
      minScore: { $min: "$score" }
    }
  },

  // Step 2: Join with the contents collection
  {
    $lookup: {
      from: "contents",
      localField: "_id",
      foreignField: "_id",
      as: "contentInfo"
    }
  },

  // Step 3: Deconstruct the join result
  { $unwind: "$contentInfo" },

  // Step 4: Project only relevant fields
  {
    $project: {
      _id: 0,
      title: "$contentInfo.title",
      type: "$contentInfo.type",
      genres: "$contentInfo.genres",
      officialScore: "$contentInfo.score",
      userAverage: { $round: ["$userAverage", 1] },
      totalReviews: 1,
      totalLikes: 1,
      maxScore: 1,
      minScore: 1
    }
  },

  // Step 5: Sort by total likes descending
  { $sort: { totalLikes: -1 } },

  // Step 6: Limit to top 5
  { $limit: 5 }
]);


// ─────────────────────────────────────────────────────────────
//  AGGREGATION 3:
//  Activity metrics by country and subscription plan
// ─────────────────────────────────────────────────────────────
db.users.aggregate([
  // Step 1: Active users only
  { $match: { active: true } },

  // Step 2: Group by country and plan
  {
    $group: {
      _id: { country: "$country", plan: "$plan" },
      totalUsers: { $sum: 1 },
      avgContentsWatched: { $avg: "$totalWatched" },
      maxContentsWatched: { $max: "$totalWatched" },
      userNames: { $push: "$name" }
    }
  },

  // Step 3: Project
  {
    $project: {
      _id: 0,
      country: "$_id.country",
      plan: "$_id.plan",
      totalUsers: 1,
      avgContentsWatched: { $round: ["$avgContentsWatched", 1] },
      maxContentsWatched: 1,
      userNames: 1
    }
  },

  // Step 4: Sort by country and total users
  { $sort: { country: 1, totalUsers: -1 } }
]);


// ─────────────────────────────────────────────────────────────
//  AGGREGATION 4:
//  Monthly report of watched content (user history)
// ─────────────────────────────────────────────────────────────
db.users.aggregate([
  // Step 1: Deconstruct the history array
  { $unwind: "$history" },

  // Step 2: Filter only completed views
  { $match: { "history.progress": { $eq: 100 } } },

  // Step 3: Group by year and month
  {
    $group: {
      _id: {
        year: { $year: "$history.watchedDate" },
        month: { $month: "$history.watchedDate" }
      },
      totalViews: { $sum: 1 },
      uniqueUsers: { $addToSet: "$_id" },
      uniqueContents: { $addToSet: "$history.contentId" }
    }
  },

  // Step 4: Project with calculated counts
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      totalViews: 1,
      uniqueUsers: { $size: "$uniqueUsers" },
      uniqueContents: { $size: "$uniqueContents" }
    }
  },

  // Step 5: Sort chronologically
  { $sort: { year: 1, month: 1 } }
]);

// =============================================================
//  END OF SCRIPT - StreamHub MongoDB
// =============================================================
