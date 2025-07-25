export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:"Stay conscious of costs",
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:"Keep cost on the average side",
        icon:'💰',
    },
    {
        id:3,
        title:'Luxury',
        desc:"Don't worry about cost",
        icon:'💎',
    },
]

export const SelectTravelList=[
    {
        id:1,
        title:'Just Me',
        desc:"A sole traveles",
        icon:'🙋🏾‍♀️',
        people:'1',
    },
    {
        id:2,
        title:'A couple',
        desc:"Two travelers",
        icon:'👫🏾',
        people:'2',
    },
    {
        id:3,
        title:'Family',
        desc:"A group of fun loving adv",
        icon:'🏡',
        people:'3 to 5 people',
    },
    {
        id:4,
        title:'Friends',
        desc:"A bunch of thrill-seekers",
        icon:'👩‍👩‍👦‍👦',
        people:'5 to 12 people',
    },
]

export const AI_PROMPT = `
You are an AI travel planner.

Generate a detailed JSON travel plan for:
- Location: {location}
- Total days: {totalDays}
- Travelers: {traveler}
- Budget: {budget}

**Requirements:**
- Use **strict snake_case field names** exactly as provided below.
- Return a **JSON only, no text or markdown**, matching this structure exactly:

{
  "id": string,
  "tripData": {
    "id": string,
    "budget_level": string,
    "duration_days": number,
    "hotel_options": [
      {
        "description": string,
        "geo_coordinates": {
          "latitude": number,
          "longitude": number
        },
        "hotel_address": string,
        "hotel_image_url": string,
        "hotel_name": string,
        "price_per_night": string,
        "rating": number
      }
    ],
    "itinerary": [
      {
        "best_time_to_visit_day": string,
        "date": string,
        "day": number,
        "plan": [
          {
            "duration": string,
            "geo_coordinates": {
              "latitude": number,
              "longitude": number
            },
            "place_details": string,
            "place_image_url": string,
            "place_name": string,
            "rating": number,
            "ticket_pricing": string
          }
        ]
      }
    ]
  },
  "location": string,
  "travelers": number,
  "userEmail": string,
  "userSelection": {
    "budget": string,
    "location": {
      "formatted_address": string,
      "geometry": {
        "location": {
          "lat": number,
          "lng": number
        }
      },
      "label": string | null,
      "name": string,
      "place_id": string
    },
    "utc_offset_minutes": number,
    "noOfDays": string,
    "traveler": string
  }
}

**Additional instructions:**
- Always use snake_case for all keys.
- All geo_coordinates should be returned as objects with numeric latitude and longitude.
- Use placeholder values if information is missing (empty string for strings, 0 for numbers).
- For hotel_options, include a variety (min 2-3) with full details.
- For itinerary, generate 2-3 days with meaningful plans (3-5 places per day).
- Each plan item should include "place_name", "place_details", "place_image_url", "geo_coordinates", "ticket_pricing", "rating", and "duration".
- Always return **valid parseable JSON only** with no extra commentary.
- do not include another tripData field inside the tripData field, just start with the hotel_options.

`;