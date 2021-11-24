const admin = require("firebase-admin");
const functions = require("firebase-functions");

const db = admin.firestore();

const fetchOrder = async (number) => {
    const ref = await db.collection("orders").doc(number).get();
    const data = ref.data();
    return data;
}

module.exports = { fetchOrder };