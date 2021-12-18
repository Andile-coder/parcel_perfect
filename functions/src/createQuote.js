const fetchOrigin = require("./fetchOrigin");
const { requestQuote } = require("@themidastouch/parcelperfect/src/quotes");
const logger = require("./logger");

const generateQuote = (destination, origin, order) => {
    logger.info({'order' : order});

    return {
        quoteno: "",
        waybill: "",
        details: {
            specinstruction: order.customer_note,
            reference: order.number,
            origperadd1: "102 Lilian Ngoyi Road, Windermere, Durban",            
            origplace: origin.place,
            origtown: origin.town,
            origpers: "MINT MARKETING T/A MUSE BEAUTY",
            origpercontact: "TASNEEM",
            origperpcode: origin.pcode,

            /* LOGICAL SPLIT */
            destperadd1: order.billing.address_1,
            destperadd2: order.billing.address_2,
            destperadd3: order.billing.address_3,
            destperadd4: order.billing.address_4,
            destperphone: order.billing.phone,
            destpercell: order.billing.phone,
            destplace: destination.place,
            desttown: destination.town,
            destpers: order.billing.first_name + order.billing.last_name,
            destpercontact: order.billing.first_name,
            destperpcode: destination.pcode,
        },
        contents: [
            {
                item: 1,
                desc: "Test",
                pieces: 1,
                dim1: 1,
                dim2: 1,
                dim3: 1,
                actmass: 1,
            },    
        ],
        ttype: "I"    
    };
}

const createQuote = async (order, destination, token) => {
    const origin = await fetchOrigin(token).catch(error => { logger.error("fetchOrigin", error); });;
    if (!origin) throw Error;

    const quote = generateQuote(destination, origin, order);
    logger.info(quote);
    
    const response = await requestQuote(quote, token);
    logger.info(response);
    
    if (response.errorcode) {
        logger.error("createQuote", response.errormessage);
        throw Error(response.errormessage);
    } else {
        return response.results[0];
    }
}

module.exports = createQuote;