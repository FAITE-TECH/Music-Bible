import Stripe from 'stripe';
import dotenv from "dotenv";
import Order from "../models/order.model.js";

dotenv.config();

const stripe = Stripe(process.env.CHECKOUT_API_KEY_SECRET);

export const createSession = async (req, res) => {
  const { musicId, title, price, userId } = req.body; // Destructure the needed data from the request body

  // Validate the required fields
  if (!musicId || !title || !price || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create customer with user ID metadata
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
        musicId: musicId,
        title: title,
      },
    });

    // Define the line item for the music purchase
    const line_item = {
      price_data: {
        currency: "lkr", // Set currency to LKR (Sri Lankan Rupees)
        product_data: {
          name: title, // Name of the music item
          description: `Purchase of ${title}`, // Simple description for the checkout page
          metadata: {
            id: musicId,
          },
        },
        unit_amount: price * 100, // Convert the price to cents
      },
      quantity: 1, // For single music purchase, the quantity is 1
    };

    // Check if the price is less than 50 cents in LKR
    const totalAmount = line_item.price_data.unit_amount;
    if (totalAmount < 50 * 100) { // Total amount must be at least 50 LKR cents
      return res.status(400).json({ error: "Total amount must be at least 50 cents in LKR." });
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id, // Link the customer to the session
      line_items: [line_item], // Pass the single music item to line_items
      mode: 'payment', // 'payment' mode for one-time purchases
      success_url: `http://localhost:5173/order-pay-success`, // Redirect after successful payment
      cancel_url: `http://localhost:5173/muiscs`, // Redirect if payment is canceled
    });

    // Respond with the session URL for redirection to Stripe checkout
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Something went wrong with creating the payment session.' });
  }
};



// Create order (save successful payments in database)
const createOrder = async (customer, data) => {
  try {
    const cartItems = JSON.parse(customer.metadata.cartItems);
    const items = cartItems.items.map(item => ({
      _id: item._id,
      title: item.title,
      cartTotalQuantity: item.cartTotalQuantity,
      mainImage: item.images[0],
    }));

    const newOrder = new Order({
      orderId: data.id,
      userId: customer.metadata.userId,
      productsId: items.map(item => ({
        id: item._id,
        title: item.title,
        mainImage: item.mainImage, 
        quantity: item.cartTotalQuantity
      })),
      first_name: data.customer_details.name.split(' ')[0],
      last_name: data.customer_details.name.split(' ')[1],
      email: data.customer_details.email,
      phone: data.customer_details.phone,
      address: data.customer_details.address.line1,
      city: data.customer_details.address.city,
      zip: data.customer_details.address.postal_code,
      subtotal: data.amount_subtotal / 100,
      deliveryfee: 300,
      totalcost: data.amount_total / 100,
    });

    const savedOrder = await newOrder.save();
    console.log("Processed Order:", savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// This is your Stripe CLI webhook secret for testing your endpoint locally.
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
