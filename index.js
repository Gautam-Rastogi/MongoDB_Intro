const { name } = require('ejs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb+srv://shubhamrastogibs_db_user:nwBtao2VHAMLZA7C@cluster0.hody6bc.mongodb.net/?appName=Cluster0/usersData').then(() => {
    console.log('Connected');
});
const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true}
}, {timestamps: true})

const User = mongoose.model('user', userSchema)


app.listen(8000, ()=>{
    console.log('app running on port 8000');
});

app.post('/users', async(req,res)=>{  
    let {name, email}  = req.body;
    let data = await User.create({
        name: name,
        email: email
    });
    console.log(data)
    return res.json('new user added')
});

app.get('/users', async(req,res)=>{
    let data = await User.find({})
    console.log(data);
    return res.json(data);
});

app.get('/users/:id', async(req,res)=>{
    let id = req.params.id;
    let data = await User.findById(id);
    console.log(data);
    return res.json(data);
});

app.delete('/users/:id', async(req,res)=>{
    let id = req.params.id;
    let data = await User.findByIdAndDelete(id);
    console.log(data);
    return res.json(data);
});

app.patch('/users/:id', async(req,res)=>{
    let id = req.params.id;
    let data = await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email
    });
    console.log(data);
    return res.json(data);
});


