import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({trip}) {
  return (
    <div>
        <h2 className='font-bold text-lg'>Places to Visit</h2>

        <div>
            {trip.tripData?.itinerary?.daily_plans.map((item,index)=>(
                <div className='mt-5' key={item.day || index}>
                <div className='mt-5'>
                    <h2 className='font-medium text-lg'>Day {item.day}: {item.theme}</h2>
                    <div className='grid md:grid-cols-2 gap-5'>
                    {item.activities.map((place,index)=>(
                        <div className='' key={place.place_name + index}>
                            <h2 className='font-medium text-sm text-orange-600'>{place.best_time_to_visit_place}</h2>
                            <PlaceCardItem place={place} />
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PlacesToVisit 