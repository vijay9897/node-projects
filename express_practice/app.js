const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const { mongoConnect } = require('./utils/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('646f4b0b6d9bf228805d3c35')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//     app.listen(3000);
// });

mongoose.connect('mongodb://127.0.0.1:27017/shopping_db?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.0')
.then(result => {
    console.log('Connected!');
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name: 'Vijay',
                email: 'vijay@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
