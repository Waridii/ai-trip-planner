// src/view-trip/components/Hotels.jsx

import React from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
    // Robustly handle field variations from AI/Firebase outputs:
    const hotels =
        trip?.tripData?.hotel_options ||
        trip?.tripData?.tripData?.hotel_options ||
        trip?.tripData?.hotels ||
        trip?.tripData?.hotel_options_list ||
        trip?.tripData?.hotels_options_list ||
        trip?.hotel_options ||
        trip?.hotels ||
        trip?.hotel_options_list ||
        trip?.hotels_options_list ||
        [];

    return (
        <div>
            <h2 className='font-bold text-xl my-7'>Hotel Recommendations</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
                {hotels.length > 0 ? (
                    hotels.map((item, index) => (
                        <HotelCardItem key={index} item={item} />
                    ))
                ) : (
                    <p className='text-gray-500'>No hotel data available for this trip.</p>
                )}
            </div>
        </div>
    );
}

export default Hotels;
