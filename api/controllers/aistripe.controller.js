import Stripe from 'stripe';
import dotenv from "dotenv";
import AIOrder from "../models/aiorder.model.js";
import User from "../models/user.model.js";

dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createAISession = async (req, res) => {
  const { userId } = req.body;

  try {
    // Get user details from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const price = 50000; // $500 in cents

    // Create customer with metadata
    const customer = await stripe.customers.create({
      metadata: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        mobile: user.mobile || '',
      },
    });

    // Create line item for AI API purchase
    const line_item = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Bible AI API Key',
          description: 'One-year subscription for Bible AI API access',
          metadata: {
            productType: 'bible_ai_api'
          }
        },
        unit_amount: price,
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
      success_url: `http://localhost:5173/ai-order-success/${user._id}`,
      cancel_url: `http://localhost:5173//bible/ai`,
      metadata: {
        productType: 'bible_ai_api',
        userId: user._id.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create AI order in database
const createAIOrder = async (customer, data) => {
  try {
    const newOrder = new AIOrder({
      orderId: data.id,
      userId: customer.metadata.userId,
      username: customer.metadata.username,
      email: data.customer_details.email,
      mobile: data.customer_details.phone || customer.metadata.mobile,
      totalcost: data.amount_total / 100,
      status: 'completed'
    });

    const savedOrder = await newOrder.save();
    console.log("AI Order successfully saved:", savedOrder);
    
    // Here you would typically:
    // 1. Send confirmation email with API key
    // 2. Update user's account with API access
  } catch (error) {
    console.error("Error creating AI order:", error);
    throw error;
  }
};

// Webhook handler for AI purchases
// Webhook and handling events for AI purchases
let endpointSecret; // Can be set from environment variables or elsewhere

export const handleAIWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let data;
  let eventType;

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("AI Webhook verified!!");
    } catch (err) {
      console.log(`AI Webhook Error: ${err.message}`);
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
    // Verify this is for our Bible AI product
    if (data.metadata?.productType !== 'bible_ai_api') {
      console.log("Received non-AI product purchase, skipping");
      return res.status(200).send();
    }

    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createAIOrder(customer, data);
        console.log("AI Order created successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};