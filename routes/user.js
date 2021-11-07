
// Filename : user.js

import sequelize from "../config/db";

const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
import models from "../models";

router.post(
    "/signup",
    [
        check("name", "Please Enter a Valid Username").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 3
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {name, email, password} = req.body;
        let t = null;
        try {
            let _check_user = await models.user.findOne({
                where: {
                    email
                }
            });
            if (_check_user) {
                return res.status(400).json({
                    msg: "Users Already Exists"
                });
            }


            t = await  sequelize.transaction();
            const salt = await bcrypt.genSalt(10);
            let pass = await bcrypt.hash(password, salt);

            let _insert_user = await models.user.create({
                name, email, password: pass
            })

            const payload = {
                user: {
                    id: _insert_user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 100000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );

            await  t.commit();
        } catch (err) {
            if(t)await t.rollback();
            console.log(err);
            res.status(500).send("Error in Saving");
        }
    }
);


router.post(
    "/login",
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        try {
            let user = await models.user.findOne({
                where: {email}
            });
            if (!user)
                return res.status(400).json({
                    message: "Users Not Exist"
                });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({
                    message: "Incorrect Password !"
                });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString",
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

router.get("/me", auth, async (req, res) => {
    try {
        const user = await models.user.findOne({
            attributes:["id", "name", "email", "phone_number"],
                where: {
                id : req.user.id
            }
        });
        res.json(user);
    } catch (e) {
        console.log(e.message);
        res.send({ message: "Error in Fetching user" });
    }
});
module.exports = router;
