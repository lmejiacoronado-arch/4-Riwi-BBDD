# StreamHub - Content and User Management in MongoDB

## Project Description
Implementation of a NoSQL database in MongoDB for the streaming platform **StreamHub**, covering data modeling, CRUD operations, indexes, and aggregations.

---

## Collection Structure

### 1. `users`
Stores subscriber information with embedded viewing history.

| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name |
| email | String | Unique email |
| plan | String | basic / standard / premium / family |
| country | String | Country of residence |
| registrationDate | Date | Account creation date |
| active | Boolean | Account status |
| profile | Object | Language, avatar, maturity age |
| history | Array | Watched contents with progress |
| totalWatched | Number | Counter of watched contents |

### 2. `contents`
Catalog of movies and audiovisual series.

| Field | Type | Description |
|-------|------|-------------|
| title | String | Content title |
| type | String | movie / series |
| genres | Array | List of genres |
| year | Number | Release year |
| durationMin | Number | Duration in minutes (movies) |
| seasons | Number | Number of seasons (series) |
| rating | String | Age rating |
| score | Number | Score 0-10 |
| totalRatings | Number | Number of ratings |
| availableIn | Array | Countries where it is available |
| tags | Array | Descriptive tags |

### 3. `ratings`
User reviews and scores for contents.

| Field | Type | Description |
|-------|------|-------------|
| userId | ObjectId | Reference to users |
| contentId | ObjectId | Reference to contents |
| score | Number | Score 1-10 |
| review | String | Review text |
| date | Date | Rating date |
| likes | Number | Positive votes |

### 4. `lists`
Custom lists created by users.

| Field | Type | Description |
|-------|------|-------------|
| userId | ObjectId | List owner |
| name | String | List name |
| public | Boolean | Visibility |
| contents | Array | Content IDs in the list |

---

## Implemented CRUD Operations

### Insertion (Task 2)
- `insertMany()` across all 4 collections
- 5 users with varied viewing histories
- 12 contents (movies and series) with full metadata
- 8 ratings with reviews
- 3 custom lists

### Queries (Task 3)
| # | Query | Operators Used |
|---|-------|----------------|
| 1 | Movies > 120 min | `$gt` |
| 2 | Users with > 5 contents | `$gt` |
| 3 | Score between 8.0 and 9.5 | `$gt`, `$lt` |
| 4 | Premium plan users | `$eq` |
| 5 | Specific genres | `$in` |
| 6 | Action + duration < 130 min | `$and`, `$lt` |
| 7 | Top-rated series or movies | `$or` |
| 8 | Titles with keywords | `$regex` |
| 9 | LATAM users or by email | `$or`, `$in`, `$regex` |
| 10 | Series with ≥ 3 seasons | `$gte` |
| 11 | Perfect score ratings | `$eq` |
| 12 | Available in Colombia and Spain | `$and`, `$in` |

### Updates (Task 4)
- `updateOne`: content score, deactivate user, add to history, update list
- `updateMany`: add tag to thrillers, upgrade basic plan → standard

### Deletions (Task 4)
- `deleteOne`: delete a specific rating
- `deleteMany`: delete ratings with few likes

---

## Created Indexes (Task 5)

| Collection | Index | Justification |
|------------|-------|---------------|
| contents | `{ title: 1 }` | Title searches and $regex queries |
| contents | `{ genres: 1 }` | Genre filters in all queries |
| contents | `{ type: 1, score: -1 }` | Compound type + score queries |
| contents | `{ availableIn: 1 }` | Regional availability filters |
| users | `{ email: 1 }` (unique) | Authentication, lookup, uniqueness guaranteed |
| users | `{ plan: 1, totalWatched: -1 }` | Segmentation by plan and activity |
| ratings | `{ contentId: 1, score: -1 }` | Fetch sorted ratings for a content |
| ratings | `{ userId: 1, date: -1 }` | User's rating history |

---

## Aggregation Pipelines (Task 5)

### Aggregation 1: Average score per genre
Stages: `$match` → `$unwind` → `$group` → `$project` → `$sort`
Result: table with each genre, average score, and total ratings.

### Aggregation 2: Top 5 most-rated contents with reviews
Stages: `$group` → `$lookup` → `$unwind` → `$project` → `$sort` → `$limit`
Result: content ranking crossing the ratings + contents collections.

### Aggregation 3: Activity metrics by country and plan
Stages: `$match` → `$group` → `$project` → `$sort`
Result: table of active users segmented by country and plan type.

### Aggregation 4: Monthly completed views report
Stages: `$unwind` → `$match` → `$group` → `$project` → `$sort`
Result: monthly time series with total views, unique users, and unique contents.

---

## How to Run

1. Open **MongoDB Compass** or **mongosh**
2. Connect to your local instance: `mongodb://localhost:27017`
3. Run the file:
   ```bash
   mongosh < streamhub_mongodb.js
   ```
   Or copy and paste the blocks directly into Compass > MongoSH

---

## Technologies
- MongoDB 7.x
- MongoDB Compass (optional visualization)
- mongosh (shell)
