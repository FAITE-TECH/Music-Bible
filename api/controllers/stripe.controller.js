import Stripe from 'stripe';
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createSession = async (req, res) => {
  const { musicId, title, price, userId, image } = req.body;

  // Validate required fields
  if (!musicId || !title || price == null || !userId || !image) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Log inputs for debugging
    console.log('Music Data:', { musicId, title, price, userId, image });

    // Create customer with metadata
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        musicId: musicId,
        title: title,
        image: image,
        price: price,
      },
    });

    // Create line item for music purchase
    const line_item = {
      price_data: {
        currency: 'usd', // Changed to USD
        product_data: {
          name: title,
          images: [image],
          description: `Purchase of ${title}`,
          metadata: {
            id: musicId,
          },
        },
        unit_amount: Math.round(price * 100), // USD requires the amount in cents
      },
      quantity: 1,
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      phone_number_collection: {
        enabled: true,
      },
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [line_item],
      mode: 'payment',
      success_url: `https://amusicbible.com/order-pay-success/${musicId}/${userId}`,
      cancel_url: `https://amusicbible.com/musics`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create order (save successful payments in database)

const createOrder = async (customer, data) => {
  try {
    // Create an array of music details (from customer metadata)
    const musicDetails = [{
      musicId: customer.metadata.musicId, 
      title: customer.metadata.title, 
      image: customer.metadata.image
    }];

    // Create the new order document
    const newOrder = new Order({
      orderId: data.id, // Stripe session ID as order ID
      userId: customer.metadata.userId,
      musicId: musicDetails, // Array of music details
      email: data.customer_details.email,
      phone: data.customer_details.phone,
      totalcost: data.amount_total / 100, // Convert from cents to dollars
      
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();
    console.log("Order successfully saved:", savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Webhook and handling events

let endpointSecret;

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Webhook verified!!");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createOrder(customer, data);
        console.log("Order created successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};
