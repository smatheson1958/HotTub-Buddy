import Stripe from "stripe";

export const POST = async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  async function handler({ measurementSystem, redirectURL }) {
    // Determine price based on measurement system
    const isMetric = measurementSystem === "metric";
    const amount = isMetric ? 350 : 500; // £3.50 or $5.00 in cents
    const currency = isMetric ? "gbp" : "usd";
    const displayAmount = isMetric ? "£3.50" : "$5.00";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Buy Me a Coffee ☕",
              description: `Thank you for supporting the Hot Tub Logger app!`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${redirectURL}?payment=success`,
      cancel_url: redirectURL,
    });

    return { url: session.url };
  }

  let data = {};
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await handler(data, request);
  if (result instanceof Response) {
    return result;
  }
  return Response.json(result === undefined ? {} : result);
};
