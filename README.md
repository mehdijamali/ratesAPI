# Rates API

IS a HTTP API that provides freight prices data between two regions and for the specific time period.

## Endpoints

#### GET /rates

expects the following paramters:

- date_from
- date_to
- origin
- destination

and returns a list with the average prices for each day on a route between port codes _origin_ and _destination_.

#### GET /rates_null

expect to recive the same paramters of /rates endpoint but it returns an empty value (JSON null) for days
on which there are less than 3 prices in total.

### POST /upload_price

uploads a price into DB by receiving the following parameters:

- date_from
- date_to
- origin_code,
- destination_code
- price

### POST /upload_price_with_currency

uploads a price into DB by receiving the following parameters:

- date_from
- date_to
- origin_code,
- destination_code
- price
- currency

and converts the price value to USD from the curreny code provided in the currency paramter

- Note that it does not do the conversion now since the free version of https://openexchangerates.org/ API does not support conversion.

## Usage

First install the npm dependencies after cloning the ropository:

```sh
   npm install
```

Then since it uses PostgreSQL instance within the docker setup file run the following lines:

```bash
docker build -t ratestask .
```

```bash
docker run -p 0.0.0.0:5432:5432 --name ratestask ratestask
```

Then run

```sh
   npm run dev
```

#### It uses the port number 8081 so you can access to the API from "127.0.0.1:8081"

## Testing

I utilized the follwoing testing frameworks:

- [Mocha](https://mochajs.org)
- [Chai](https://www.chaijs.com)
- [Supertest](https://github.com/visionmedia/supertest)

to run the tests use the following command:

```sh
   npm run test
```
