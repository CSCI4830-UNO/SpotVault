# SpotVault API Documentation

## Overview

SpotVault is a location-based social platform where users can create and share spots (locations), visit them, and interact with other users through comments, favorites, and follows.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints use **cookie-based authentication** via Supabase Auth. Sessions are automatically included in requests when using the same session object.

### Auth Endpoints

#### POST `/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

**Response:** 201 Created

```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { ... }
  }
}
```

**Notes:**

- Username must be unique
- User automatically logs in after signup
- User record created in `users` table with provided username

---

#### POST `/auth/login`

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** 200 OK

```json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "session": { ... }
  }
}
```

---

#### POST `/auth/logout`

End the current session.

**Response:** 200 OK

```json
{
  "message": "logged out"
}
```

**Auth Required:** Yes

---

## Users Endpoints

#### GET `/users/:username`

Retrieve user profile by username.

**Response:** 200 OK

```json
{
  "id": "uuid",
  "username": "username",
  "bio": "User bio",
  "created_at": "2025-12-10T..."
}
```

**Response:** 404 Not Found if user doesn't exist

**Auth Required:** No

---

## Spots Endpoints

#### GET `/spots`

Retrieve all public spots visible to the user.

**Response:** 200 OK

```json
[
  {
    "spot_id": "uuid",
    "creator_id": "uuid",
    "name": "Henry Doorly Zoo",
    "longitude": -95.9345,
    "latitude": 41.2619,
    "is_public": true,
    "created_at": "2025-12-10T..."
  }
]
```

**Auth Required:** No  
**RLS:** Returns only public spots or spots owned by authenticated user

---

#### GET `/spots/:id`

Retrieve a specific spot by ID.

**Response:** 200 OK

```json
{
  "spot_id": "uuid",
  "creator_id": "uuid",
  "name": "Henry Doorly Zoo",
  "longitude": -95.9345,
  "latitude": 41.2619,
  "is_public": true,
  "created_at": "2025-12-10T..."
}
```

**Response:** 404 Not Found if inaccessible

**Auth Required:** No  
**RLS:** User can only see public spots or their own private spots

---

#### POST `/spots`

Create a new spot.

**Request Body:**

```json
{
  "name": "Henry Doorly Zoo",
  "longitude": -95.9345,
  "latitude": 41.2619,
  "is_public": true
}
```

**Response:** 201 Created

```json
{
  "spot_id": "uuid",
  "creator_id": "uuid",
  "name": "Henry Doorly Zoo",
  "longitude": -95.9345,
  "latitude": 41.2619,
  "is_public": true,
  "created_at": "2025-12-10T..."
}
```

**Auth Required:** Yes  
**Notes:**

- `is_public` defaults to `false`
- Creator automatically set to authenticated user

---

#### PUT `/spots/:id`

Update spot details.

**Request Body:**

```json
{
  "name": "Updated Name",
  "is_public": true
}
```

**Response:** 200 OK (updated spot data)

**Response:** 403 Forbidden if not creator  
**Response:** 403 Forbidden if attempting to unpublish a public spot

**Auth Required:** Yes  
**Notes:**

- Only the spot creator can update
- Once a spot is public, it cannot be made private

---

#### DELETE `/spots/:id`

Delete a spot.

**Response:** 200 OK

```json
{
  "message": "Spot deleted"
}
```

**Response:** 403 Forbidden if not creator

**Auth Required:** Yes  
**Notes:**

- Only the spot creator can delete

---

## User Spots Endpoints

User spots represent a user's visit/interaction with a spot. They store personal notes, pictures, and visibility settings.

#### GET `/user_spots?user_id=uuid&spot_id=uuid`

Retrieve user spots with optional filters.

**Query Parameters:**

- `user_id` (optional): Filter by user
- `spot_id` (optional): Filter by spot

**Response:** 200 OK

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "spot_id": "uuid",
    "pictures": ["url1", "url2"],
    "notes": "Great place!",
    "is_public": true,
    "created_at": "2025-12-10T..."
  }
]
```

**Auth Required:** No  
**RLS:** Returns only public user spots or ones owned by authenticated user

---

#### GET `/user_spots/:id`

Retrieve a specific user spot.

**Response:** 200 OK (user spot object)

**Response:** 404 Not Found if inaccessible

**Auth Required:** No  
**RLS:** User can only see public user spots or their own

---

#### POST `/user_spots`

Create a new user spot (visit record).

**Request Body:**

```json
{
  "spot_id": "uuid",
  "pictures": ["url1", "url2"],
  "notes": "Great place to visit!",
  "is_public": true
}
```

**Response:** 201 Created (user spot object)

**Auth Required:** Yes  
**Notes:**

- `pictures` and `notes` are optional
- `is_public` defaults to `false`

---

#### PUT `/user_spots/:id`

Update a user spot.

**Request Body:**

```json
{
  "pictures": ["new_url"],
  "notes": "Updated notes",
  "is_public": true
}
```

**Response:** 200 OK (updated user spot object)

**Response:** 403 Forbidden if not owner

**Auth Required:** Yes  
**RLS:** User can only update their own user spots

---

#### DELETE `/user_spots/:id`

Delete a user spot.

**Response:** 200 OK

```json
{
  "message": "User spot deleted"
}
```

**Auth Required:** Yes  
**RLS:** User can only delete their own user spots

---

## Comments Endpoints

#### GET `/comments?user_spot_id=uuid`

Retrieve comments for a user spot.

**Query Parameters:**

- `user_spot_id` (required): The user spot to get comments for

**Response:** 200 OK

```json
[
  {
    "id": "uuid",
    "user_spot_id": "uuid",
    "user_id": "uuid",
    "content": "Nice photos!",
    "created_at": "2025-12-10T..."
  }
]
```

**Auth Required:** No  
**RLS:** Returns comments only if user can see the user spot

---

#### POST `/comments`

Create a comment on a user spot.

**Request Body:**

```json
{
  "user_spot_id": "uuid",
  "content": "Great place!"
}
```

**Response:** 201 Created (comment object)

**Auth Required:** Yes  
**Notes:**

- User must have access to the user spot

---

#### DELETE `/comments/:id`

Delete a comment.

**Response:** 200 OK

```json
{
  "message": "Comment deleted"
}
```

**Response:** 403 Forbidden if not comment author

**Auth Required:** Yes  
**RLS:** User can only delete their own comments

---

## Favorites Endpoints

#### GET `/user_favorites?user_id=uuid`

Retrieve user's favorite spots.

**Query Parameters:**

- `user_id` (required): The user to get favorites for

**Response:** 200 OK

```json
[
  {
    "spot_id": "uuid",
    "user_id": "uuid",
    "created_at": "2025-12-10T...",
    "spots": {
      "spot_id": "uuid",
      "name": "...",
      ...
    }
  }
]
```

**Auth Required:** No  
**RLS:** Returns only public favorites (or all if viewing own)

---

#### POST `/user_favorites`

Add a spot to favorites.

**Request Body:**

```json
{
  "spot_id": "uuid"
}
```

**Response:** 201 Created

**Response:** 403 Forbidden if spot is not visible to user

**Auth Required:** Yes  
**RLS:** User can only favorite spots they can see

---

#### DELETE `/user_favorites`

Remove a spot from favorites.

**Request Body:**

```json
{
  "spot_id": "uuid"
}
```

**Response:** 200 OK

```json
{
  "message": "Favorite deleted"
}
```

**Auth Required:** Yes  
**RLS:** User can only delete their own favorites

---

## Followers Endpoints

#### GET `/followers?user_id=uuid&type=followers|following`

Retrieve followers or following list.

**Query Parameters:**

- `user_id` (required): The user
- `type` (optional): `followers` or `following` (defaults to following)

**Response:** 200 OK

```json
[
  {
    "id": "uuid",
    "follower_id": "uuid",
    "following_id": "uuid",
    "created_at": "2025-12-10T..."
  }
]
```

**Auth Required:** No

---

#### POST `/followers`

Follow a user.

**Request Body:**

```json
{
  "following_id": "uuid"
}
```

**Response:** 201 Created (follower relationship object)

**Auth Required:** Yes  
**Notes:**

- `following_id` is the user ID of the person to follow (not username)

---

#### DELETE `/followers/:id`

Unfollow a user.

**Path Parameters:**

- `id`: The user ID of the person to unfollow

**Response:** 200 OK

```json
{
  "message": "Unfollowed"
}
```

**Auth Required:** Yes

---

## Reports Endpoints

#### POST `/spot_reports`

Report a spot.

**Request Body:**

```json
{
  "spot_id": "uuid",
  "reason": "Inappropriate content"
}
```

**Response:** 201 Created

**Auth Required:** Yes  
**RLS:** User can only report spots they can see

---

#### POST `/user_spot_reports`

Report a user spot (visit).

**Request Body:**

```json
{
  "user_spot_id": "uuid",
  "reason": "Inappropriate content"
}
```

**Response:** 201 Created

**Auth Required:** Yes  
**RLS:** User can only report user spots they can see

---

# Database Schema

## Tables

### `users`

Stores user profile information.

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  username text NOT NULL UNIQUE,
  bio text DEFAULT 'I''m on spotvault'::text CHECK (char_length(bio) <= 180),
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `id`: User's auth ID (UUID)
- `username`: Unique username
- `bio`: User bio (max 180 characters)
- `created_at`: Account creation timestamp

---

### `spots`

Global locations created by users.

```sql
CREATE TABLE public.spots (
  spot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  longitude numeric NOT NULL,
  latitude numeric NOT NULL,
  name text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `spot_id`: Unique spot identifier
- `creator_id`: User who created the spot
- `longitude`: Spot longitude coordinate
- `latitude`: Spot latitude coordinate
- `name`: Spot name
- `is_public`: Whether spot is visible to all users
- `created_at`: Spot creation timestamp

**Notes:**

- Once `is_public` is set to `true`, it cannot be changed back to `false`

---

### `user_spots`

User's personal visits/interactions with spots.

```sql
CREATE TABLE public.user_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  spot_id uuid NOT NULL FOREIGN KEY REFERENCES spots(spot_id),
  pictures jsonb,
  notes text,
  is_public boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `id`: Unique user spot identifier
- `user_id`: User who created the visit record
- `spot_id`: The spot being visited
- `pictures`: JSON array of picture URLs
- `notes`: Personal notes about the visit
- `is_public`: Whether this visit is visible to others
- `created_at`: Visit creation timestamp

---

### `comments`

Comments on user spots.

```sql
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_spot_id uuid NOT NULL FOREIGN KEY REFERENCES user_spots(id),
  user_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  content text NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `id`: Unique comment identifier
- `user_spot_id`: The user spot being commented on
- `user_id`: User who made the comment
- `content`: Comment text
- `created_at`: Comment creation timestamp

---

### `user_favorites`

User's favorite spots.

```sql
CREATE TABLE public.user_favorites (
  spot_id uuid NOT NULL FOREIGN KEY REFERENCES spots(spot_id),
  user_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  created_at timestamp without time zone DEFAULT now(),
  PRIMARY KEY (spot_id, user_id)
);
```

**Fields:**

- `spot_id`: Favorited spot
- `user_id`: User who favorited
- `created_at`: Favorite creation timestamp

**RLS:** User can only favorite spots they can access

---

### `followers`

User follow relationships.

```sql
CREATE TABLE public.followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  following_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `id`: Unique follower relationship identifier
- `follower_id`: User doing the following
- `following_id`: User being followed
- `created_at`: Follow creation timestamp

**Notes:**

- `follower_id` and `following_id` should be different users

---

### `spot_reports`

Reports made on spots.

```sql
CREATE TABLE public.spot_reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid NOT NULL FOREIGN KEY REFERENCES spots(spot_id),
  user_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  reason text NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `report_id`: Unique report identifier
- `spot_id`: Reported spot
- `user_id`: User who reported
- `reason`: Report reason
- `created_at`: Report creation timestamp

**RLS:** User can only report spots they can see

---

### `user_spot_reports`

Reports made on user spots.

```sql
CREATE TABLE public.user_spot_reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_spot_id uuid NOT NULL FOREIGN KEY REFERENCES user_spots(id),
  user_id uuid NOT NULL FOREIGN KEY REFERENCES users(id),
  reason text NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);
```

**Fields:**

- `report_id`: Unique report identifier
- `user_spot_id`: Reported user spot
- `user_id`: User who reported
- `reason`: Report reason
- `created_at`: Report creation timestamp

**RLS:** User can only report user spots they can see

---

# Row Level Security (RLS) Policies

## `spots` Table

### SELECT - View Spot

Users can see:

- Public spots
- Their own private spots

```sql
CREATE POLICY "Users can view public spots or their own"
ON spots FOR SELECT
USING (is_public OR creator_id = auth.uid());
```

### INSERT - Create Spot

Users can create spots.

```sql
CREATE POLICY "Users can create spots"
ON spots FOR INSERT
WITH CHECK (creator_id = auth.uid());
```

### UPDATE - Edit Spot

Only creator can update, and cannot unpublish once public.

```sql
CREATE POLICY "Users can update their own spots"
ON spots FOR UPDATE
USING (creator_id = auth.uid())
WITH CHECK (
  creator_id = auth.uid()
  AND (
    NOT is_public OR is_public = (SELECT is_public FROM spots WHERE spot_id = spots.spot_id)
  )
);
```

### DELETE - Delete Spot

Only creator can delete.

```sql
CREATE POLICY "Users can delete their own spots"
ON spots FOR DELETE
USING (creator_id = auth.uid());
```

---

## `user_spots` Table

### SELECT - View User Spot

Users can see:

- Public user spots
- Their own user spots

```sql
CREATE POLICY "Users can view public user_spots or their own"
ON user_spots FOR SELECT
USING (is_public OR user_id = auth.uid());
```

### INSERT - Create User Spot

Users can create user spots for spots they can see.

```sql
CREATE POLICY "Users can create user_spots"
ON user_spots FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM spots
    WHERE spots.spot_id = user_spots.spot_id
    AND (spots.is_public OR spots.creator_id = auth.uid())
  )
);
```

### UPDATE - Edit User Spot

Only owner can update their own user spots.

```sql
CREATE POLICY "Users can update their own user_spots"
ON user_spots FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

### DELETE - Delete User Spot

Only owner can delete.

```sql
CREATE POLICY "Users can delete their own user_spots"
ON user_spots FOR DELETE
USING (user_id = auth.uid());
```

---

## `comments` Table

### SELECT - View Comments

Users can see comments on visible user spots.

```sql
CREATE POLICY "Users can view comments on visible user_spots"
ON comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_spots
    WHERE user_spots.id = comments.user_spot_id
    AND (user_spots.is_public OR user_spots.user_id = auth.uid())
  )
);
```

### INSERT - Create Comment

Users can comment on visible user spots.

```sql
CREATE POLICY "Users can create comments on visible user_spots"
ON comments FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM user_spots
    WHERE user_spots.id = comments.user_spot_id
    AND (user_spots.is_public OR user_spots.user_id = auth.uid())
  )
);
```

### DELETE - Delete Comment

Only comment author can delete.

```sql
CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
USING (user_id = auth.uid());
```

---

## `user_favorites` Table

### SELECT - View Favorites

Users can see:

- Public favorites of other users
- All their own favorites

```sql
CREATE POLICY "Users can view public favorites or their own"
ON user_favorites FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_spots
    WHERE user_spots.id IN (
      SELECT id FROM user_spots WHERE user_favorites.spot_id = user_spots.spot_id
    )
    AND user_spots.is_public
  )
);
```

### INSERT - Add Favorite

Users can only favorite spots they can access.

```sql
CREATE POLICY "Users can only favorite visible spots"
ON user_favorites FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM spots
    WHERE spots.spot_id = user_favorites.spot_id
    AND (spots.is_public OR spots.creator_id = auth.uid())
  )
);
```

### DELETE - Remove Favorite

Users can only delete their own favorites.

```sql
CREATE POLICY "Users can delete their own favorites"
ON user_favorites FOR DELETE
USING (user_id = auth.uid());
```

---

## `followers` Table

### SELECT - View Followers

All followers data is public.

```sql
CREATE POLICY "Anyone can view followers"
ON followers FOR SELECT
USING (true);
```

### INSERT - Follow User

Users can follow others.

```sql
CREATE POLICY "Users can follow others"
ON followers FOR INSERT
WITH CHECK (follower_id = auth.uid());
```

### DELETE - Unfollow User

Users can only unfollow for themselves.

```sql
CREATE POLICY "Users can unfollow others"
ON followers FOR DELETE
USING (follower_id = auth.uid());
```

---

## `spot_reports` and `user_spot_reports` Tables

### INSERT - Create Report

Users can report spots/user spots they can see.

```sql
-- For spot_reports
CREATE POLICY "Users can report visible spots"
ON spot_reports FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM spots
    WHERE spots.spot_id = spot_reports.spot_id
    AND (spots.is_public OR spots.creator_id = auth.uid())
  )
);

-- For user_spot_reports
CREATE POLICY "Users can report visible user_spots"
ON user_spot_reports FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM user_spots
    WHERE user_spots.id = user_spot_reports.user_spot_id
    AND (user_spots.is_public OR user_spots.user_id = auth.uid())
  )
);
```

---

# Frontend Integration Notes

## Authentication Flow

1. User signs up/logs in via `/auth/signup` or `/auth/login`
2. Supabase sets auth cookie automatically
3. All subsequent requests include auth cookie
4. Check auth status by attempting to get current session

## Key Implementation Details

- **Spot IDs vs Usernames**: Followers require user ID (UUID), not username. Fetch user ID from `/users/:username` first.
- **Visit Public/Private**: User spots have separate `is_public` from the underlying spot. A user can make their visit private even if the spot is public.
- **Pictures**: Stored as JSON array—frontend should send array of URLs.
- **Coordinates**: Use numeric type (accepts decimals)—suitable for latitude/longitude.
