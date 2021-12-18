const logger = require("./src/logger");

const express = require("express");
const cors = require("cors");
const { authenticateAsync } = require("@themidastouch/parcelperfect/src/authentication");
const fetchDestination = require("./src/fetchDestination");
const createQuote = require("./src/createQuote");
const { updateService, quoteToCollection } = require("@themidastouch/parcelperfect/src/quotes");

const Order = require("./src/models/order");
const { fetchOrder } = require("./fetchOrder");
const { send } = require("./src/sendgrid");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    response.send("🏄‍♂️ Sup Baz from Muse! 🏄‍♂️");
    logger.info('🏄‍♂️ Muse API ONLINE!! 🏄‍♂️');
});

app.post("/createOrder", async (request, response) => {
    const wcorder = request.body;
    logger.log({ 'createOrder - request.body': wcorder })

    if (wcorder.status === "processing") {

        const order = new Order(
            wcorder.id,
            wcorder.number,
            `${wcorder.billing.first_name} ${wcorder.billing.last_name}`,
            wcorder.billing.email,
            wcorder.billing.phone,
            {
                address_1: wcorder.billing.address_1,
                address_2: wcorder.billing.address_2,
                city: wcorder.billing.city,
                state: wcorder.billing.state,
                country: wcorder.billing.country,
                postcode: wcorder.billing.postcode
            },
            wcorder.customer_note
        );
        order.save();
        logger.log({ 'createOrder - order': order })

        try {
            const username = process.env.PARCELPERFECT_USERNAME;
            const password = process.env.PARCELPERFECT_PASSWORD;
            const token = await authenticateAsync(username, password).catch(error => { logger.error("authenticateAsync", error); });;
            logger.info({ "authenticateAsync": token });
            const destination = await fetchDestination(wcorder, token).catch(error => { logger.error("fetchDestination", error); });;
            logger.info({ "fetchDestination": JSON.stringify(destination) });
            // response.status(200).json(destination);

            if (destination) {
                // const quote = await createQuote(wcorder, destination, token).catch(error => { logger.error("createQuote", error); });;
                // order.quoteno = quote.quoteno;
                // order.update();

                // const service = await updateService(quote.quoteno, "ONX", token).catch(error => { logger.error("updateService", error); });;
                // if (service.errorcode) throw Error(service.errormessage);

                // const collection = await quoteToCollection(quote.quoteno, token).catch(error => { logger.error("quoteToCollection", error); });;
                // if (collection.errorcode) throw Error(collection.errormessage);

                // order.waybillno = collection.results[0].waybillno;
                // order.update();

                response.json(order);
            } else {
                response.status(200).json('destination does not exist');
            }
        } catch (error) {
            logger.error("ERROR", error);
            response.status(500).json("An error occurred:" + error);
            throw error;
        }
    } else {
        response.status(200).json("incorrect status");
    }
});

app.post("/completeOrder", async (request, response) => {
    const wcorder = request.body;
    logger.log({ 'completeOrder - request.body': wcorder })
    if (wcorder.status === "completed") {
        const order = await fetchOrder(wcorder.number);
        if (order) {
            const result = await send(order);
            response.status(200).json(result);
        } else {
            response.status(200).json("order not in database");
        }
    } else {
        response.status(200).json("incorrect status");
    }
});

const startDevServer = () => {
    app.listen(12000, console.info("⚡ Listening on http://localhost:12000"));
}

module.exports = startDevServer;