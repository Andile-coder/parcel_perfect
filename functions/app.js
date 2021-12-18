const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const { authenticateAsync } = require("@themidastouch/parcelperfect/src/authentication");
const { quoteToCollection, updateService } = require("@themidastouch/parcelperfect/src/quotes");
const { loadConfig } = require("@themidastouch/parcelperfect/src/config");

const createQuote = require("./src/createQuote");
const fetchDestination = require("./src/fetchDestination");

const logger = require("./src/logger");
const Order = require("./src/models/order");
const { fetchOrder } = require("./fetchOrder");
const { send } = require("./src/sendgrid");

let username;
let password;

if (process.env.PARCELPERFECT_URL) {
    loadConfig(process.env.PARCELPERFECT_URL);
    const startDevServer = require("./server");
    startDevServer();
} else {
    return ".env.PARCELPERFECT_URL environment variable not set"
}

exports.createOrder = functions.https.onRequest(async (request, response) => {
    const wcorder = request.body;
    if (wcorder.number) {
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

        try {
            order.save();
            const token = await authenticateAsync(username, password);
            const destination = await fetchDestination(wcorder, token);

            if (destination) {
                const quote = await createQuote(wcorder, destination, token);
                order.quoteno = quote.quoteno;
                order.update();

                const service = await updateService(quote.quoteno, "ONX", token);
                if (service.errorcode) throw Error(service.errormessage);

                const collection = await quoteToCollection(quote.quoteno, token);
                if (collection.errorcode) throw Error(collection.errormessage);

                order.waybillno = collection.results[0].waybillno;
                order.update();

                response.status(200).send();
            } else {
                response.status(404).send();
            }
        } catch (error) {
            logger.error(error);
            response.status(500).send(error);
        }
    } else {
        logger.info("woocommerce");
        response.status(200).send();
    }
});

exports.completeOrder = functions.https.onRequest(async (request, response) => {
    const wcorder = request.body;
    if (wcorder.status === "completed") {
        const order = await fetchOrder(wcorder.number);
        if (order) {
            const result = await send(order);
            response.send(result);
        } else {
            response.status(404).send();
        }
    }
    response.send();
})
