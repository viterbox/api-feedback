const mongoRepository = require("../../repository/mongodb");
const httpStatus = require("../../util/httpStatus");
const { BadRequestError } = require("../../errors/Exception");

module.exports = saveOrder = async (req, res) => {
    try {
        const { idUser } = req.body;

        const user = await mongoRepository.getUsers(idUser).catch(error => {
            throw error;
        });

        if(!user || user.length == 0) {
            throw new BadRequestError("idUser does not exist");
        }

        const payload = await mongoRepository.saveOder(req.body).catch(error => {
            throw error;
        });

        if(!payload){
            throw new Error("Order has not been created, you have to create a new user, then create the order");
        }

        return res.status(httpStatus.CREATED).jsonp(payload);
    } catch (error) {
        if(error instanceof Error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp({
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            })
        }
        return res.status(error.status).jsonp({
            status: error.status,
            message: error.message
        });
    }
}