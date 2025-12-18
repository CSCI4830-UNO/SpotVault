//meant to transform the db types into the application types.
export default function transformSpotResponse(
  spot: any,
  userSpot: any | null,
  comments: any[] = []
) {
  const final = {
    id: spot.spot_id,
    name: spot.name,
    description: userSpot?.notes || undefined,
    latitude: spot.latitude,
    longitude: spot.longitude,
    photos: userSpot?.pictures || [],
    comments: comments.map(c => ({
      id: c.id,
      text: c.content,
      username: c.username,
      createdAt: c.created_at,
    })),
    tags: spot.tags || [],
    createdAt: spot.created_at,
    updatedAt: spot.created_at,
    isFavorite: false, // Set by client based on user_favorites
    isPublic: spot.is_public,
    creator_id: spot.creator_id,
  }
  return final
}
