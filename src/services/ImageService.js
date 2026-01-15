// Image service for trip cover images
// Uses Unsplash for destination images

// Curated destination images for common cities
const DESTINATION_IMAGES = {
    // Major cities
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=200&fit=crop',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop',
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop',
    'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=200&fit=crop',
    'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=200&fit=crop',
    'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=200&fit=crop',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=200&fit=crop',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=200&fit=crop',
    'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=200&fit=crop',
    'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop',
    'los angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=200&fit=crop',
    'miami': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=200&fit=crop',
    'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=200&fit=crop',
    'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&fit=crop',
    'lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=200&fit=crop',
    'prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=200&fit=crop',
    'vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&h=200&fit=crop',
    'bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=200&fit=crop',
    'hong kong': 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=200&fit=crop',
    'seoul': 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=200&fit=crop',
    'istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=200&fit=crop',
    'moscow': 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&h=200&fit=crop',
    'mexico city': 'https://images.unsplash.com/photo-1518659526054-190340b32735?w=400&h=200&fit=crop',
    'buenos aires': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400&h=200&fit=crop',
    'rio de janeiro': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=200&fit=crop',
    'cape town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&h=200&fit=crop',
    'cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=400&h=200&fit=crop',
    'mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&h=200&fit=crop',
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=200&fit=crop',
};

// Fallback travel images for unknown destinations
const TRAVEL_IMAGES = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop', // Travel planning
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=400&h=200&fit=crop', // Eiffel tower
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=200&fit=crop', // Lake and mountains
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=200&fit=crop', // Beach sunset
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=400&h=200&fit=crop', // City lights
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=200&fit=crop', // Road trip
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=200&fit=crop', // Tropical beach
    'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&h=200&fit=crop', // Airplane wing
];

export const ImageService = {
    // Get a destination image URL
    getDestinationImageUrl: (destination) => {
        if (!destination) {
            return TRAVEL_IMAGES[Math.floor(Math.random() * TRAVEL_IMAGES.length)];
        }

        // Try to find a matching city
        const normalizedDest = destination.toLowerCase().trim();

        for (const [city, url] of Object.entries(DESTINATION_IMAGES)) {
            if (normalizedDest.includes(city) || city.includes(normalizedDest.split(',')[0].trim())) {
                return url;
            }
        }

        // Return a random travel image for unknown destinations
        // Use a hash of the destination to get consistent image per destination
        const hash = destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return TRAVEL_IMAGES[hash % TRAVEL_IMAGES.length];
    },

    // Get a random travel image
    getRandomTravelImage: () => {
        return TRAVEL_IMAGES[Math.floor(Math.random() * TRAVEL_IMAGES.length)];
    },

    // Fallback gradient backgrounds
    getGradientClass: (index = 0) => {
        const gradients = [
            'from-indigo-500 to-violet-600',
            'from-rose-500 to-pink-600',
            'from-cyan-500 to-blue-600',
            'from-emerald-500 to-teal-600',
            'from-amber-500 to-orange-600',
            'from-fuchsia-500 to-purple-600',
        ];
        return gradients[index % gradients.length];
    }
};
