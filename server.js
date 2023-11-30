const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images"});

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html");
})

let videoGames = [
    {
    _id: 1,
    name: "Fortnite",
    year: "2017",
    rating: "9.6/10",
    price: "Free",
    characters: [
        "Trooper",
        "Jonesey",
        "Trace",
    ],
},
{
    _id: 2,
    name: "Rocket League",
    year: "2015",
    rating: "9.3/10",
    price: "Free",
    characters: [
        "Octane",
        "Dominus",
        "Batmobile",
    ],
},
{
    _id: 3,
    name: "Resident Evil 4",
    year: "2005",
    rating: "9.8/10",
    price: "$59.99",
    characters: [
        "Ada Wong",
        "Jack Krauser",
        "Luis Sera",
    ],
},
{
    _id: 4,
    name: "Last of Us",
    year: "2013",
    rating: "10/10",
    price: "$59.99",
    characters: [
        "Joel",
        "Ellie",
        "Marlene",
    ],
},
{
    _id: 5,
    name: "Borderlands 2",
    year: "2012",
    rating: "9/10",
    price: "$19.99",
    characters: [
        "Axton",
        "Krieg",
        "Athena",
    ],
},
{
    _id: 6,
    name: "Madden 23",
    year: "2022",
    rating: "7/10",
    price: "$69.99",
    characters: [
        "Patrick Mahomes",
        "Justin Jefferson",
        "Lamar Jackson",
    ],
},
]

app.get("/api/videoGames", (req, res) => {
    res.send(videoGames);
})

app.get("/api/videoGames/:id", (req, res) =>{
    const id = parseInt(req.params.id);

    const videoGame = videoGames.find((v) => v._id === id);

    if(!videoGame){
        res.status(404).send("The video game with the given id was not found");
    }

    res.send(videoGame);
})

app.post("/api/videoGames", upload.single("img"), (req, res) =>{
    const result = validateVideoGame(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const videoGame = {
        _id: videoGames.length + 1,
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating,
        price: req.body.price,
        characters: req.body.characters.split(","),
    }

    videoGames.push(videoGame);
    res.send(videoGame);
})

app.put("/api/videoGames/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);
    
    const videoGame = videoGames.find((v) => v._id === id);

    const result = validateVideoGame(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    videoGame.name = req.body.name;
    videoGame.year = req.body.year;
    videoGame.rating = req.body.rating;
    videoGame.price = req.body.price;
    videoGame.characters = req.body.characters.split(",");

    res.send(videoGame);
})

app.delete("/api/videoGames/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const videoGame = videoGames.find((v) => v._id === id);

    if(!videoGame){
        res.status(404).send("The video game with the given id was not found");
    }

    const index = videoGames.indexOf(videoGame);
    videoGames.splice(index, 1);
    res.send(videoGame);
})


const validateVideoGame = (videoGame) =>{
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(1).required(),
        year: Joi.string().min(4).required(),
        rating: Joi.string().min(3).required(),
        price: Joi.string().min(3).required(),
        characters: Joi.allow(),
    })

    return schema.validate(videoGame);
}


app.listen(3000, () => {
    console.log("Welcome");
})