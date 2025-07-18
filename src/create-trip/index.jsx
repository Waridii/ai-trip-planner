import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import React, { useEffect, useRef, useState } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { toast } from 'sonner'
import { AI_PROMPT } from '@/constants/options';
import { GoogleGenAI } from '@google/genai';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google"
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";


const libraries = ['places'];

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog]=useState(false);
  const autocompleteRef = useRef(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const selectedPlace = autocompleteRef.current.getPlace();
      setPlace(selectedPlace);
      handleInputChange('location', selectedPlace);
    }
  };

  const login=useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
    onError:(error)=>console.log(error)
  })


  // Utility to clean location data for Firestore
  const cleanLocationData = (location) => {
  if (!location) return null;

  // Safely extract only Firestore-safe fields
  return {
    name: location.name || null,
    place_id: location.place_id || null,
    formatted_address: location.formatted_address || null,
    label: location.label || null,
    utc_offset_minutes: location.utc_offset_minutes || null,
    geometry: {
      location: {
        lat: location.geometry?.location?.lat ? location.geometry.location.lat() : null,
        lng: location.geometry?.location?.lng ? location.geometry.location.lng() : null,
      },
    },
  };
};

 const extractJSON = (text) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? jsonMatch[0] : null;
};



  const OnGenerateTrip = async () => {

    const user=localStorage.getItem('user');

    if (!user){
      setOpenDialog(true)
      return ;
    }



  if (
    (formData?.noOfDays > 5 && !formData?.location) ||
    !formData?.budget ||
    !formData?.traveler
  ) {
    toast("Please fill all details!");
    return;
  }

  setLoading(true);
  const FINAL_PROMPT = AI_PROMPT
    .replace("{location}", formData?.location?.formatted_address)
    .replace("{totalDays}", formData?.noOfDays)
    .replace("{traveler}", formData?.traveler)
    .replace("{budget}", formData?.budget);


  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
  });

  const model = "gemini-2.5-flash-preview-05-20";

  const config = {
    responseMimeType: "application/json",
  };

  const userContent = [
    {
      role: "user",
      parts: [{ text: FINAL_PROMPT }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents: userContent,
  });

  let finalResponse = "";

  for await (const chunk of response) {
    finalResponse += chunk.text || "";
    console.log(chunk.text);
  }
  setLoading(false);
  SaveAiTrip(finalResponse)
};

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString();
        const cleanedFormData = {
            ...formData,
            location: cleanLocationData(formData.location)
        };

        const cleanedJSON = extractJSON(TripData);
        if (!cleanedJSON) {
            toast("Failed to parse AI response, please try again.");
            setLoading(false);
            return;
        }

        await setDoc(doc(db, "AITrips", docId), {
            userSelection: cleanedFormData,
            tripData: JSON.parse(cleanedJSON),
            userEmail: user?.email,
            id: docId
        });

        setLoading(false);
        navigate('/view-trip/' + docId);
    } catch (error) {
        console.error("Firestore save error:", error);
        toast("Failed to save trip. Please try again.");
        setLoading(false);
    }
};


  const GetUserProfile=(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,{
     headers:{
      Authorization: `Bearer ${tokenInfo?.access_token}`,
      Accept:'Application/json'
     }
  }).then((resp)=>{
    console.log(resp);
    localStorage.setItem('user',JSON.stringify(resp.data));
    setOpenDialog(false)
    OnGenerateTrip();
  })
  }


  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
      libraries={libraries}
    >
      <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
        <div>
          <h2 className='font-bold text-3xl'> Tell us your travel preferences 🌍✈️🌴</h2>
          <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
        </div>

        <div className='mt-20 flex flex-col gap-10'>
          <div>
            <h2 className='text-xl my-3 font-medium'>What is the destination of your choice?</h2>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search your destination"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </Autocomplete>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>How many days are you planning for your trip?</h2>
            <Input
              placeholder='Ex. 3'
              type='number'
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
            <p>The budget is exclusively allocated for activities and dining purposes.</p>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectBudgetOptions.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('budget', item.title)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.budget === item.title && 'shadow-lg border-black'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className="text-sm text-gray-500">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
            <div className='grid grid-cols-3 gap-5 mt-5'>
              {SelectTravelList.map((item, index) => (
                <div key={index}
                  onClick={() => handleInputChange('traveler', item.people)}
                  className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${formData?.traveler === item.people && 'shadow-lg border-black'}`}>
                  <h2 className='text-4xl'>{item.icon}</h2>
                  <h2 className='font-bold text-lg'>{item.title}</h2>
                  <h2 className="text-sm text-gray-500">{item.desc}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='my-10 justify-end flex'>
          <Button 
             disabled={loading}
          onClick={OnGenerateTrip}>
          {loading?
           <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />: 'Generate Trip'  
        }
          </Button>
        </div>

        <Dialog open={openDialog}>
        
        <DialogContent>
          <DialogHeader>
            
            <DialogDescription>
              <img src="/logo.svg" alt="" />
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>

              <Button
              onClick={login}
              className='w-full mt-5 flex gap-4 items-center'>
                <FcGoogle className='h-7 w-7'/>
                Sign In With Google</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>



      </div>
    </LoadScript>
  );
}

export default CreateTrip;
