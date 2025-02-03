import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

const stripePromise = loadStripe('pk_test_51QmvomRpsiQOSl8fZ9jjJPPpkcsnVt4UeiQvvzY5K2JgemFko7zPT5fLCaTMK34WW9Ifq8cbeF5JFsrmsnyoTkri0060DYFbqc');

const PaymentForm = () => {
    const [amount, setAmount] = useState(1000);
    const [currency, setCurrency] = useState('usd');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async () => {
        if (!stripe || !elements) {
            console.error("Stripe.js has not yet loaded.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://localhost:4000/create-payment-intent", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, description: "Test payment" })
            });

            const { clientSecret } = await response.json();

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                console.error("CardElement not found.");
                setLoading(false);
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (result.error) {
                setMessage(`Error: ${result.error.message}`);
            } else if (result.paymentIntent.status === 'succeeded') {
                setMessage("✅ Payment Successful!");
            }
        } catch (error) {
            setMessage("❌ Payment failed. Try again.");
            console.error('Payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-card">
            <h2>Stripe Payment</h2>
            <div className="row">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input-field half-width"
                    placeholder="Amount (in cents)"
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field half-width">
                    <option value="usd">USD</option>
                    <option value="inr">INR</option>
                    <option value="eur">EUR</option>
                </select>
            </div>
            <div className="card-element-container">
                <CardElement className="card-element" />
            </div>
            <button
                disabled={!stripe || loading}
                onClick={handlePayment}
                className="pay-button"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

const PaymentPage = () => {
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    useEffect(() => {
        stripePromise.then(() => setIsStripeLoaded(true));
    }, []);

    if (!isStripeLoaded) {
        return <div className="loading-message">Loading Stripe...</div>;
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

export default PaymentPage;
