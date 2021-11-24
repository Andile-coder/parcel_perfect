const sendgrid = require("@sendgrid/mail");
const logger = require("./logger");

const send = async (order) => {
    logger.info({'sendgrid:order' : order})

    const mail = {
        from: "sales@musebeauty.co.za",
        personalizations: [
            {
                to: order.email,
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

    if (process.env.ENVIRONMENT) {
        sendgrid.setApiKey(process.env.SENDGRID_KEY)

        try {
            const response = await sendgrid.send(mail);
            logger.info({'sendgrid:response' : response})
            return response
        }
        catch(error){
            logger.info({'sendgridSendmail:error' : error})
            return response.status(200).json("sendgridSendmail:error");
        }
        
    } else {
        return response.status(200).json(".env.ENVIRONMENT variable not saved");
    }
    
}

module.exports = { send };