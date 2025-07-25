// src/view-trip/[tripId]/index.jsx
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tripId) {
            GetTripData();
        }
    }, [tripId]);

    const GetTripData = async () => {
        try {
            const docRef = doc(db, 'AITrips', tripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Fetched trip:", docSnap.data());
                setTrip(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading trip details...
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="p-10 text-center text-red-500">
                No trip found.
            </div>
        );
    }

    return (
        <div className='p-4 md:px-20 lg:px-44 xl:px-56'>
            {/* Trip Information */}
            <InfoSection trip={trip} />
            {/* Hotels */}
            <Hotels trip={trip} />
            {/* Places to Visit */}
            <PlacesToVisit trip={trip} />
            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Viewtrip;
