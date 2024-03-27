const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
