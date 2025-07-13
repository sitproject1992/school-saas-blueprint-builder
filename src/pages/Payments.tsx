import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../integrations/stripe/client';
import CheckoutForm from '../components/payments/CheckoutForm';
import { supabase } from '../integrations/supabase/client';

const PaymentsPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // In a real application, you would fetch the client secret from your server.
    // For this example, we'll create a payment intent on the client side.
    const createPaymentIntent = async () => {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount: 1000 }, // amount in cents
      });
      if (data) {
        setClientSecret(data.clientSecret);
      }
    };
    createPaymentIntent();
  }, []);

  const handleSuccess = () => {
    // Handle successful payment, e.g., update the invoice status.
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentsPage;
