const express = require("express"),
    User = require("../user/user.model"),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    Nexmo = require("nexmo"),
    nexService = new Nexmo({
        apiKey: process.env.NEXMO_API_KEY,
        apiSecret: process.env.NEXMO_API_SECRET
    });

router.post("/login", async function (req, res) {
   try {

    nexService.verify.request({
        number: req.body.countryCode + req.body.mobileNumber,
        brand: 'DigiBill',
        code_length: '6'
    }, (err, result) => {
        if (err) return res.json({
            error: true,
            message: err
        });

        let user = await User.findOne({
            phone: req.body.mobileNumber,
            countryCode: req.body.countryCode,
            deleted: false
        });

        if(user) {
            User.update({
                phone: req.body.mobileNumber,
                countryCode: req.body.countryCode
            }, {
                requestId: result.request_id
            });
        } else {
            User.create({
                phone: req.body.mobileNumber,
                countryCode: req.body.countryCode,
                requestId: result.request_id
            })
        }

        return res.json({
            requestId: result.request_id,
            error: false
        })
    });
   } catch (error) {
       console.log(error);
       res.end("Error Occured");
   }
})

router.post("/verify", async function (req, res) {
    try {
        nexService.verify.check({
            request_id: req.body.requestId,
            code: req.body.code
        }, (err, result) => {
            if(err) return res.json({
                error: true,
                message: "Invalid Code"
            });

            let userObj = await User.findOne({
                requestId: req.body.requestId,
                deleted: false
            });

            if(!userObj) throw "Invalid Request ID"; 

            jwt.sign(userObj._id, process.env.SECRET, function(err, token) {
                if (err) return res.end(err);    
                res.json({
                    error: false,
                    token: token
                })
            })
        }); 
    } catch (error) {
        console.log(error);
        res.end("Error Occured");
    }
})

module.exports = router;