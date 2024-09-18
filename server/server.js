const cors = require("cors");
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// TODO: make sure this is connecting to the front-end on LIVE server
app.use(cors({ origin: 'http://localhost:3000' }));

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(
    "/graphql",
    expressMiddleware(
      server,
      // TODO enable this when implementing auth middleware
      {
        context: authMiddleware,
      }
    )
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // STRIPE CHECKOUT ROUTES
  app.post("/create-checkout-session", async (req, res) => {
    try {
      const { priceId } = await req.body;

      if (!priceId) {
        throw new Error("priceId is missing or invalid");
      }
  
      console.log("Received priceId:", priceId); 
  
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        return_url: `${req.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      });
      res.json({ clientSecret: session.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Unable to create checkout session" });
    }
  });

  app.get("/session-status", async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    res.send({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  });

  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });
};

startApolloServer();
