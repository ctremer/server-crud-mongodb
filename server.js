const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images"});

mongoose
    .connect("mongodb+srv://remerc:nLNZQNovoCAewETq@server-crud-mongodb.a4iwz3f.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Couldn't connect to MongoDB", error));

const videoGameSchema = new mongoose.Schema({
    /*_id: mongoose.SchemaTypes.ObjectId*/
    name: String,
    year: Number,
    rating: String,
    price: String,
    characters: [String],
    img: String,
})

const VideoGame = mongoose.model("VideoGame", videoGameSchema);

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html");
})

app.get("/api/videoGames", (req, res) => {
    getVideoGames(res);
})

const getVideoGames = async (res) => {
    const videoGames = await VideoGame.find();
    res.send(videoGames);
}

app.get("/api/videoGames/:id", (req, res) =>{
    getVideoGame(req.params.id, res);
})

const getVideoGame = async(id ,res) =>{
    const videoGame = await VideoGame.findOne({ _id: id });
    res.send(videoGame);
}

app.post("/api/videoGames", upload.single("img"), (req, res) =>{
    const result = validateVideoGame(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const videoGame = new VideoGame({
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating,
        price: req.body.price,
        characters: req.body.characters.split(","),
    })

    if(req.file){
        videoGame.img = "images/" + req.file.filename;
    }

    createVideoGame(videoGame, res);
})

const createVideoGame = async (videoGame, res) =>{
    const result = await videoGame.save();
    res.send(videoGame);
}

app.put("/api/videoGames/:id", upload.single("img"), (req, res) => {

    const result = validateVideoGame(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateVideoGame(req, res);

})

const updateVideoGame = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        year: req.body.year,
        rating: req.body.rating,
        price: req.body.price,
        characters: req.body.characters.split(","),
    }

    if(req.file){
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await VideoGame.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const videoGame = await VideoGame.findById(req.params.id);
    
    res.send(videoGame);
}

app.delete("/api/videoGames/:id", (req, res) => {
    removeVideoGames(res, req.params.id);
})

const removeVideoGames = async(res, id) =>{
    const videoGame = await VideoGame.findByIdAndDelete(id);
    res.send(videoGame);
}


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