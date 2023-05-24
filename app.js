const express = require('express');

const app = express();

const bodyparser = require('body-parser');

const exhbs = require('express-handlebars');

const dbo = require('./db');

const ObjectID = dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))

app.set('view engine','hbs');

app.set('views','views');

app.use(bodyparser.urlencoded({extended:true}));

app.get('/', async (req, res) => {

      let database = await dbo.getDatabase();

      const collection = database.collection('products');

      const cursor = collection.find({})

      let products = await cursor.toArray();

      let message = '';

      let edit_id, edit_product;

      if (req.query.edit_id) {

        edit_id = req.query.edit_id;

        edit_product = await collection.findOne({ _id:new ObjectID(edit_id) })

      }

      if (req.query.delete_id) {

        await collection.deleteOne({ _id:new ObjectID(req.query.delete_id) })

        return res.redirect('/?status=3');

      }

      switch (req.query.status) {

        case '1':

          message = 'Product inserted successfully!';

          break;

        case '2':

          message = 'Product updated successfully!';

          break;

        case '3':

          message = 'Product deleted successfully!';

          break;

        default:

          break;

      }

      res.render('main', { message, products, edit_id, edit_product })

    })     

    app.post('/store_product', async (req, res) => {

        let database = await dbo.getDatabase();

        const collection = database.collection('products');

        let product = { name: req.body.name, price: req.body.price };

        await collection.insertOne(product);

        return res.redirect('/?status=1');

})

app.post('/update_product/:edit_id', async (req, res) => {

    let database = await dbo.getDatabase();

    const collection = database.collection('products');

    let product = { name: req.body.name, price: req.body.price };

    let edit_id = req.params.edit_id;

    await collection.updateOne({ _id:new ObjectID(edit_id)}, { $set: product });

    return res.redirect('/?status=2');

});

app.listen(4000, () => {

    console.log('Server is running on port 4000');

  })

  
