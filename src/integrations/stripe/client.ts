import { loadStripe } from '@stripe/stripe-js';

// Only initialize Stripe if the publishable key is available
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null);

export default stripePromise;