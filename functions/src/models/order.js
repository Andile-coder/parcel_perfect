const admin = require("firebase-admin");
const logger = require("../logger");
const db = admin.firestore();

function Order(id, number, name, email, phone, address, notes) {
  this.id = id;
  this.number = number;
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.quoteno = "";
  this.waybillno = "";
  this.address = address;
  this.notes = notes;

  this.save = async () => {
    logger.info({ firestore_db: "Order - Saved order" });
    const ref = await db.collection("orders").doc(this.number).set({
      id: this.id,
      number: this.number,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      notes: this.notes,
    });
    this.id = ref.id;
  };

  this.update = async () => {
    logger.info({ firestore_db: "Order - Update order" });
    const ref = await db.collection("orders").doc(this.number).update({
      quotno: this.quoteno,
      waybillno: this.waybillno,
    });
    return ref;
  };
}

module.exports = Order;
