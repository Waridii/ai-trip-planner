// src/view-trip/components/HotelCardItem.jsx

import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ item }) {
    const [photoUrl, setPhotoUrl] = useState();

    const hotelName = item?.hotel_name || item?.hotelName || item?.hotel?.name || 'Hotel';
    const hotelAddress = item?.hotel_address || item?.hotelAddress || 'Address Not Available';
    const price = item?.price_per_night || item?.price || 'Price Not Available';
    const rating = item?.rating || 'Rating Not Available';

    useEffect(() => {
        item && GetPlaceImg();
    }, [item]);

    const GetPlaceImg = async () => {
        const data = {
            textQuery: hotelName
        };

        try {
            const resp = await GetPlaceDetails(data);
            const photos = resp?.data?.places?.[0]?.photos;
            if (photos && photos.length > 0) {
                const photoIndex = photos.length > 3 ? 3 : 0;
                const fetchedPhotoUrl = PHOTO_REF_URL.replace('{NAME}', photos[photoIndex].name);
                setPhotoUrl(fetchedPhotoUrl);
            }
        } catch (error) {
            console.error('Error fetching place photo:', error);
        }
    };

    return (
        <div>
            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${hotelName}, ${hotelAddress}`
                )}`}
                target='_blank'
            >
                <div className='hover:scale-105 transition-all cursor-pointer'>
                    <img
                        src={photoUrl ? photoUrl : '/road-trip-vacation.jpg'}
                        alt={hotelName}
                        className='rounded-xl h-[180px] w-full object-cover'
                    />
                    <div className='my-3 py-2'>
                        <h2 className='font-medium'>{hotelName}</h2>
                        <h2 className='text-xs text-gray-500'>📍 {hotelAddress}</h2>
                        <h2 className='text-sm'>💰 {price}</h2>
                        <h2 className='text-sm'>⭐ {rating}</h2>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default HotelCardItem;
