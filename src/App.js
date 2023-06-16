import React, { useState, useEffect } from "react";
import "./App.css";
// stripe
import { loadStripe } from '@stripe/stripe-js';

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const stripePromise = loadStripe(
      'pk_test_key'
  );
  const handlePayment = async () => {
    const stripe = await stripePromise;
    // Call your backend to create the Checkout Session
    fetch('/create-checkout-session', {
      method: 'POST',
    })
        .then(function(response) {
          console.log(" session",response);
          return response.json();
        })
        .then(function(session) {
          return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .then(function(result) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using `error.message`.
          if (result.error) {
            alert(result.error.message);
          }
        });
  };
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
      <section>
        <div className="product">
          <img
              src="https://i.imgur.com/EHyR2nP.png"
              alt="The cover of Stubborn Attachments"
          />
          <div className="description">
            <h3>Stubborn Attachments</h3>
            <h5>$10.00</h5>
          </div>
        </div>

        {/*   <form action="/create-checkout-session" method="POST">
      <button type="submit">
        Checkout
      </button>
    </form>*/}

        <button type="submit"  onClick={handlePayment}>
          Checkout
        </button>

      </section>
  );
}