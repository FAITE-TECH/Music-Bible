import Stripe from 'stripe';
import dotenv from "dotenv";
import MusicOrder from "../models/musicorder.model.js";
import Music from "../models/music.model.js"; 

dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createSession = async (req, res) => {
  const { musicId, title, price, userId, image, username, email, mobile, audioFile } = req.body;

  // Validate required fields
  if (!musicId || !title || price == null || !userId || !image || !username || !email || !audioFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create customer with metadata including the music file
    const customer = await stripe.customers.create({
      metadata: {
        userId,
        username,
        email,
        mobile: mobile || '',
        musicId,
        title,
        image,
        price,
        musicFile: audioFile 
      },
    });

    // Create line item for music purchase
    const line_item = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: title,
          images: [image],
          description: `Purchase of ${title}`,
          metadata: {
            id: musicId,
          },
        },
        unit_amount: Math.round(price * 100),
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
      metadata: {
        productType: 'music_purchase',
        userId: userId
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create music order in database
const createMusicOrder = async (customer, data) => {
  try {
    const newOrder = new MusicOrder({
      orderId: data.id,
      userId: customer.metadata.userId,
      username: customer.metadata.username,
      email: data.customer_details.email,
      mobile: data.customer_details.phone || customer.metadata.mobile,
      musicId: customer.metadata.musicId,
      musicTitle: customer.metadata.title,
      musicImage: customer.metadata.image,
      musicFile: customer.metadata.musicFile, 
      price: customer.metadata.price,
      status: 'completed'
    });

    const savedOrder = await newOrder.save();
    console.log("Music Order successfully saved:", savedOrder);
    
  } catch (error) {
    console.error("Error creating music order:", error);
    throw error;
  }
};

// Webhook handler for music purchases
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
    // Verify this is for our music product
    if (data.metadata?.productType !== 'music_purchase') {
      console.log("Received non-music product purchase, skipping");
      return res.status(200).send();
    }

    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createMusicOrder(customer, data);
        console.log("Music Order created successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  res.send().end();
};