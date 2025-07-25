// src/view-trip/components/PlacesToVisit.jsx

import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
    const itinerary = trip?.tripData?.tripData?.itinerary || [];

    return (
        <div className='my-4'>
            <h2 className='font-bold text-xl'>Places to Visit</h2>
            <div>
                {itinerary.map((item, i) => (
                    <div key={i} className='my-4'>
                        <h2 className='font-medium text-lg'>
                            {item?.day || `Day ${item?.day || i + 1}`} 
                            {item?.best_time_to_visit_day ? ` - ${item.best_time_to_visit_day}` : ''}
                        </h2>

                        <div className='grid md:grid-cols-2 gap-4 mt-2'>
                            {item?.plan?.map((place, index) => (
                                <PlaceCardItem key={index} place={place} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlacesToVisit;
