module.exports = async (req, res) => {
    console.log(req.body)

    res.send({ message: req.body });
    // try {
    //     const DBConnecter = require("../../../controller/DBconnecter");
    //     const conn = new DBConnecter();

    //     conn.closeConnect();

    //     res.send({ message: req.body });
    // } catch (error) {
    //     console.log(error);
    // }
}