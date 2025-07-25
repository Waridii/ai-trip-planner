// src/view-trip/components/PlaceCardItem.jsx

import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        if (place?.place_name) {
            GetPlaceImg();
        }
    }, [place]);

    const GetPlaceImg = async () => {
        try {
            const data = {
                textQuery: place?.place_name
            };
            const resp = await GetPlaceDetails(data);
            const photoReference = resp?.data?.places?.[0]?.photos?.[0]?.name;
            if (photoReference) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoReference);
                setPhotoUrl(PhotoUrl);
            }
        } catch (error) {
            console.error("Error fetching place image:", error);
        }
    };

    // Handle geo_coordinates safely for Google Maps link
    const coordinates = place?.geo_coordinates
        ? typeof place.geo_coordinates === 'string'
            ? place.geo_coordinates
            : `${place.geo_coordinates.latitude},${place.geo_coordinates.longitude}`
        : '';

    return (
        <div>
            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.place_name || '')},${coordinates}`}
                target='_blank'
                rel='noopener noreferrer'
            >
                <div className='my-4 bg-gray-50 p-2 gap-2 border rounded-lg flex hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
                    <img
                        src={photoUrl ? photoUrl : '/road-trip-vacation.jpg'}
                        alt={place?.place_name || 'Place'}
                        className='w-[130px] h-[130px] rounded-xl object-cover'
                    />
                    <div className='flex flex-col justify-between ml-2 flex-1'>
                        <div>
                            <h2 className='font-medium text-sm text-orange-600'>{place?.duration || place?.time || ''}</h2>
                            <h2 className='font-bold'>{place?.place_name}</h2>
                            <p className='text-sm text-gray-500'>{place?.place_details}</p>
                            <h2 className='text-blue-700 text-sm'>{place?.ticket_pricing}</h2>
                            <h2 className='text-sm text-yellow-500'>⭐ {place?.rating}</h2>
                        </div>
                        <div className='mt-2'>
                            <Button size='icon'>
                                <FaLocationDot />
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;
