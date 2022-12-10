import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import db from '../firebase';
import "./PlansScreen.css";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
    const [products, setProducts] = useState([]);
    const user = useSelector(selectUser);
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        db.collection('customers')
        .doc(user.uid)
        .collection('subscriptions')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(async subscription => {
                setSubscription({
                    role: subscription.data().role,
                    current_period_end: subscription.data().current_period_end.seconds,
                    current_period_start: subscription.data().current_period_end.seconds,
                });
            });
        });
    }, [user.uid]);

    useEffect(() => {
        db.collection('products')
          .where('active', "==", true)
          .get()
          .then((querySnapshot) => {
            const products = {};
            querySnapshot.forEach(async (productDoc) => {
                products[productDoc.id] = productDoc.data();
                const priceSnap = await productDoc.ref.collection('prices').get();
                priceSnap.docs.forEach(price => {
                    products[productDoc.id].prices = {
                        priceId: price.id,
                        priceData: price.data()
                    }
                })
            });
            setProducts(products);
        });
    }, []);

    console.log(products);
    console.log(subscription);


  const loadCheckout = async (priceId) => {
        const docRef = await db
         .collection('customers')
         .doc(user.uid)
         .collection('checkout_sessions')
         .add({
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
         });

         docRef.onSnapshot(async(snap) => {
            const { error, sessionId } = snap.data();

            if (error) {
                //Show an error to the customer and inspect cloud function logs in firebase console
                alert(`An error occured: ${error.message}`);
            }

            if (sessionId) {
                // We have a session, redirects to checkout
                // Init Stripe
                const stripe = await loadStripe("pk_test_51LvDJTKwwShnlZIqxaGSdKLE2Zi4cCvcAkvLIxiINH3G2fuNTkKQ8qrckZekBBbvH83GzyTUUZjfJ5OCQ1LiEIAb00JOxVCf0c");

                stripe.redirectToCheckout({ sessionId });
            }
         })
  };

  return (
    <div className='plansScreen'>
        {Object.entries(products).map(([productId, productData]) => {
            // TODO: Add logic to check if the user's subscription is active...
            return (
                <div className='plansScreen__plan'>
                    <div className='plansScreen__info'>
                        <h5>{productData.name}</h5>
                        <h6>{productData.description}</h6>
                    </div>

                    <button onClick={() => loadCheckout(productData.prices.priceId)}>
                        Subscribe
                    </button>
                </div>
            );
        })}
    </div>
  )
}

export default PlansScreen