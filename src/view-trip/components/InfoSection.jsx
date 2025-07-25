// src/view-trip/components/InfoSection.jsx

import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

function InfoSection({ trip }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        if (trip) {
            GetPlaceImg();
        }
    }, [trip]);

    const GetPlaceImg = async () => {
        try {
            const data = {
                textQuery:
                    trip?.tripData?.location?.formatted_address ||
                    trip?.tripData?.location ||
                    trip?.location ||
                    'Travel Destination',
            };

            const resp = await GetPlaceDetails(data);
            const photoName = resp?.data?.places?.[0]?.photos?.[3]?.name;
            if (photoName) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                setPhotoUrl(PhotoUrl);
            }
        } catch (error) {
            console.error('Error fetching place image:', error);
        }
    };

    const locationName =
        trip?.tripData?.location?.formatted_address ||
        trip?.tripData?.location ||
        trip?.location ||
        'Unknown Destination';

    const noOfDays =
        trip?.tripData?.noOfDays ||
        trip?.noOfDays ||
        trip?.tripData?.duration_days ||
        trip?.userSelection?.noOfDays ||
        'N/A';

    const travelers =
        trip?.tripData?.traveler ||
        trip?.traveler ||
        trip?.tripData?.travelers ||
        'N/A';

    const budget =
        trip?.tripData?.budget ||
        trip?.tripData?.budget_level ||
        trip?.budget ||
        trip?.userSelection?.budget ||
        'N/A';

    return (
        <div>
            <img
                src={photoUrl ? photoUrl : '/road-trip-vacation.jpg'}
                className='h-[330px] w-full object-cover rounded-xl'
                alt={locationName}
            />
            <div className='flex justify-between items-center'>
                <div className='my-6 flex flex-col gap-2'>
                    <h2 className='font-bold text-2xl'>{locationName}</h2>
                    <div className='flex gap-3 flex-wrap mt-4'>
                        <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
                            🗓️ {noOfDays} {noOfDays === 1 ? 'Day' : 'Days'}
                        </h2>
                        <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
                            👩‍👧‍👦 Travelers: {travelers}
                        </h2>
                        <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>
                            💵 Budget: {budget}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InfoSection;
