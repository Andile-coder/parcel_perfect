const admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");
admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://muse-beauty-default-rtdb.firebaseio.com/",
    databaseAuthVariableOverride: {},
  },
  "name"
);
const db = admin.firestore();

const fetchOrder = async (number) => {
  const ref = await db.collection("orders").doc(number).get();
  const data = ref.data();
  return data;
};

module.exports = { fetchOrder };
