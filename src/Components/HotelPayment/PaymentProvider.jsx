

// PaymentProvider.js
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import LoadingRainbow from "../Loading/LoadingRainbow";
import useHotelStore from "../../stores/hotel-store";
import useBookingStore from "../../stores/booking-store";
import { useShallow } from "zustand/shallow";
const API = import.meta.env.VITE_API

// const stripePromise = loadStripe("pk_test_51QHdYyBU681vIFBkL7FTVXhlWjLIlvdVbeCAUK4UC8hTsHqUtxMvbb72EQVxIF9sUdU8aJQn3oeDgv17crnmXikJ006cLmV8Fz");
const stripePromise = loadStripe("pk_test_51QHddSIdZP6xs5KfcWePGPewYV4O84Muncrv0bXmWW7vgGfoiep9oxhu0inJuFyCvwRK49CxMfD8jxGwbp0xPhKS00Bjvf926V");
export default function PaymentProvider({ children }) {
    const {clientSecret , setClientSecret} =  useBookingStore(useShallow(state=>({
        clientSecret  :state.clientSecret,
        setClientSecret  :state.setClientSecret
    })))

    const summary = useHotelStore(state=>state.summary)

    const [loadingStripe, setLoadingStripe] = useState(true);
    const [loadingClientSecret, setLoadingClientSecret] = useState(true);
    useEffect(() => {
        const fetchClientSecret = async () => {
            // Load Stripe
        stripePromise.then(() => setLoadingStripe(false));


            try {
                const res = await axios.post(`${API}/payment/create-payment-intent`, {totalPrice: summary});
                setClientSecret(res.data.clientSecret);
                setLoadingClientSecret(false);
            } catch (error) {
                console.error("Error fetching client secret:", error);
                setLoadingClientSecret(false);
            }
        };

        fetchClientSecret();
    }, []);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#FFA500',
            colorText: '#333333',
            borderRadius: '10px',
            spacingUnit: '10px',
            fontSizeBase: '16px'
        },
        rules: {
            '.Input': {
                border: '1px solid #FFA500',
                padding: '10px'
            },
            '.Tab, .Label': {
                color: '#333333',
                fontSize: '16px'
            },
            '.Tab--selected': {
            
                borderColor: '#FFA500'
            }
        }
    };

    const loader = 'auto';

    // ถ้า clientSecret ยังไม่มี ให้แสดง LoadingBooking
    if (loadingStripe || loadingClientSecret) {
        return <LoadingRainbow />;
    }

    return (
        <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
            {children}
        </Elements>
    );
}
