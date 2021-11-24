const sendgrid = require("@sendgrid/mail");

const send = async (order) => {

    const mail = {
        from: "sales@musebeauty.co.za",
        personalizations: [
            {
                to: [
                    {
                        email: order.email
                    }
                ],
                dynamic_template_data: {
                    receiver_name: order.name,
                    waybill_number: order.waybillno,
                    tracking_code: `http://tracking.pperfect.com/waybill.php?ppcust=2500.2401.3136&waybill=${order.waybillno}`,
                    address_1: order.address.address_1,
                    address_2: order.address.address_2,
                    city: order.address.city,
                    order_number: order.number
                }
            }
        ],
        template_id: "d-3975c310a9f24347ae17a09515e31a4e"
    };

    if (process.env.ENVIRONMENT && process.env.ENVIRONMENT) {
        sendgrid.setApiKey(process.env.SENDGRID_KEY)
        return await sendgrid.send(mail)
    } else {
        return '.env.ENVIRONMENT variable not saved'
    }
    
}

module.exports = { send };