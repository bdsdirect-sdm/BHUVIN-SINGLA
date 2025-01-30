import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QmvomRpsiQOSl8fZ9jjJPPpkcsnVt4UeiQvvzY5K2JgemFko7zPT5fLCaTMK34WW9Ifq8cbeF5JFsrmsnyoTkri0060DYFbqc'); // Replace with your actual Stripe publishable key

const PaymentForm = () => {
    const [amount, setAmount] = useState(1000);  // Example amount in cents (1000 = $10)
    const [currency, setCurrency] = useState('usd');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error("Stripe.js has not yet loaded.");
            return;
        }

        setLoading(true);  // Start loading

        try {
            const response = await fetch('http://localhost:4000/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency }),
            });

            const { clientSecret } = await response.json();

            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                console.error("CardElement is not found.");
                setLoading(false);
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                console.error("Payment error:", result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment Successful');
                }
            }
        } catch (error) {
            console.error('Payment failed', error);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <div>
            <CardElement />
            <button disabled={!stripe || loading} onClick={handlePayment}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

const PaymentPage = () => {
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);

    useEffect(() => {
        // Check if stripe is loaded
        stripePromise.then(() => {
            setIsStripeLoaded(true);
        });
    }, []);

    if (!isStripeLoaded) {
        return <div>Loading Stripe...</div>;  // Show a loading message while Stripe is being initialized
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

export default PaymentPage;
