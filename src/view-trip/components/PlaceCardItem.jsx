import React from 'react';
import { Button } from '@/components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

function PlaceCardItem({place}) {

  const [photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
      place&&GetPlacePhoto();
    },[place])
  
    const GetPlacePhoto=async()=>{
  
      const data={
        textQuery:place.place_name
      }
      const result=await GetPlaceDetails(data).then(resp=>{
        //console.log(resp.data.places[0].photos[3].name)
  
        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
        setPhotoUrl(PhotoUrl);
      })
    }
  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.place_name} target='_blank'>
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
          <img src={photoUrl?photoUrl:"https://github.com/oykuky/Full-Stack-AI-Trip-Planner/blob/main/public/road-trip-vacation.jpg?raw=true"} alt="" className='w-[130px] h-[130px] rounded-xl object-cover'/>
          <div>
            <h2 className='font-bold text-lg'>{place.place_name}</h2>
            <p className='text-sm text-gray-400'>{place.place_details}</p>
            <h2 className='mt-2'>{place.duration_at_location_minutes} minutes</h2>
            <Button><FaMapLocationDot /></Button>

          </div>
      </div>
    </Link>
  )
}

export default PlaceCardItem 