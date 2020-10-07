import express from 'express';
import bodyParser from 'body-parser';
import db from './src/db';
import validator from './src/validator';
require('@babel/register');

const APP_PORT = 8081;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (request, response) => {
  response.json({ message: 'Welcome to the rates API' });
});

app.get('/rates', validator.get, db.getAllRates);
app.get('/rates_null', validator.get, db.getAllNullRates);
app.post('/upload_price', validator.post, db.createPrice);

// API DOES NOT WORKS SINCE THE FREE API DOES NOT PERFOM THE SINGLE CONVERSION FOR FREE
app.post(
  '/upload_price_with_currency',
  validator.postWithCurrency,
  db.createConvertedPrice
);

app.listen(APP_PORT, () =>
  console.log(`Server is running on port ${APP_PORT}`)
);

export default app;
