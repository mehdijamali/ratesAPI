import pg from 'pg';
import fetch from 'node-fetch';
import { validationResult } from 'express-validator';

const pool = new pg.Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'ratestask',
});

const API_ID = 'd9cd776dce3e440faa00855e32a2da98';

/**
 *  returns the dta of direct and indirect linked between origin and destinations
 * @param {*} request
 * @param {*} response
 */
const getAllRates = (request, response) => {
  const { date_from, date_to, origin, destination } = request.query;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  } else {
    const sqlQuery = `
        WITH RECURSIVE search_regions(slug, name, parent_slug, depth, path, cycle) AS (
        SELECT r.slug, r.name, r.parent_slug, 1, 
            ARRAY[r.slug],
            false
        FROM regions r
        WHERE r.slug = $1 OR r.slug = $2
        UNION ALL
        SELECT r.slug, r.name, r.parent_slug, sg.depth +  1,  
            path || r.slug, 
            r.slug = ANY(path)
        FROM regions r, search_regions sg 
        WHERE r.parent_slug = sg.slug  AND NOT cycle 
        )
       
        SELECT TO_CHAR(day, 'YYYY-MM-DD') as day, ROUND(AVG( price), 0) as average_price
        FROM prices
        WHERE orig_code IN
            (SELECT DISTINCT ports.code as code FROM search_regions 
            RIGHT  JOIN ports ON ports.parent_slug = search_regions.slug
            WHERE  $1=ANY(search_regions.path) OR ports.code = $1)
         AND dest_code IN     
            (SELECT DISTINCT ports.code as code FROM search_regions 
            RIGHT  JOIN ports ON ports.parent_slug = search_regions.slug
            WHERE  $2=ANY(search_regions.path) OR ports.code = $2)
        AND day BETWEEN $3 AND $4 GROUP BY day
`;

    pool.query(
      sqlQuery,
      [origin, destination, date_from, date_to],
      (error, results) => {
        if (error) {
          response.status(500).json({ error: error.toString() });
        } else response.status(200).json(results.rows);
      }
    );
  }
};

const getAllNullRates = (request, response) => {
  const { date_from, date_to, origin, destination } = request.query;
  const PRICE_COUNT_LIMIT = 2;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  } else {
    const sqlQuery = `
    WITH RECURSIVE search_regions(slug, name, parent_slug, depth, path, cycle) AS (
    SELECT r.slug, r.name, r.parent_slug, 1, 
        ARRAY[r.slug],
        false
    FROM regions r
    WHERE r.slug = $1 OR r.slug = $2
    UNION ALL
    SELECT r.slug, r.name, r.parent_slug, sg.depth +  1,  
        path || r.slug, 
        r.slug = ANY(path)
    FROM regions r, search_regions sg 
    WHERE r.parent_slug = sg.slug  AND NOT cycle 
    )
   
    SELECT TO_CHAR(day, 'YYYY-MM-DD') as day, CASE WHEN count(price) > ${PRICE_COUNT_LIMIT} THEN ROUND(AVG( price), 0) ELSE NULL END as average_price
    FROM prices
    WHERE orig_code IN
        (SELECT DISTINCT ports.code as code FROM search_regions 
        RIGHT  JOIN ports ON ports.parent_slug = search_regions.slug
        WHERE  $1=ANY(search_regions.path) OR ports.code = $1)
     AND dest_code IN     
        (SELECT DISTINCT ports.code as code FROM search_regions 
        RIGHT  JOIN ports ON ports.parent_slug = search_regions.slug
        WHERE  $2=ANY(search_regions.path) OR ports.code = $2)
    AND day BETWEEN $3 AND $4 GROUP BY day
`;

    pool.query(
      sqlQuery,
      [origin, destination, date_from, date_to],
      (error, results) => {
        if (error) {
          response.status(500).json({ error: error.toString() });
        } else response.status(200).json(results.rows);
      }
    );
  }
};

const createPrice = (request, response) => {
  const {
    date_from,
    date_to,
    origin_code,
    destination_code,
    price,
  } = request.query;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  } else {
    if (parseInt(price, 10) >= 0) {
      const checkPortsCodeQuery = `SELECT code FROM ports WHERE code IN ($1, $2)`;
      pool.query(
        checkPortsCodeQuery,
        [origin_code, destination_code],
        (error, results) => {
          if (error) {
            response.status(500).json({ error: error.toString() });
          } else {
            const sqlQuery = `INSERT INTO prices (orig_code, dest_code , day, price)
          SELECT $1, $2, days.day, $3 From 
         (SELECT generate_series as day FROM (select generate_series(
           (date '${date_from}')::date,
           (date '${date_to}')::date,
           interval '1 day'
         )) AS dates) AS days`;
            if (results.rows.length === 2) {
              pool.query(
                sqlQuery,
                [origin_code, destination_code, price],
                (error, results) => {
                  if (error) {
                    response.status(500).json({ error: error.toString() });
                  } else {
                    response.status(201).json({
                      message: `${results.rowCount} ${
                        results.rowCount > 1 ? 'items have' : 'item has'
                      } been inserted into the price table`,
                      rowCount: results.rowCount,
                    });
                  }
                }
              );
            } else {
              if (results.rows.length === 0) {
                response.status(500).json({
                  errors: `origin_code: "${origin_code}" and destination_code:"${destination_code}" do not exist`,
                });
              } else {
                const missingItem =
                  results.rows[0].code === origin_code
                    ? 'destination_code'
                    : 'origin_code';
                response.status(500).json({
                  errors: `${missingItem}: "${request.query[missingItem]}" does not exist`,
                });
              }
            }
          }
        }
      );
    } else {
      response.status(400).json({
        errors: `the price value should not be negative`,
      });
    }
  }
};
// FREE API DOES NOT WORK
const createConvertedPrice = (request, response) => {
  const {
    date_from,
    date_to,
    origin_code,
    destination_code,
    price,
    currency,
  } = request.query;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  } else {
    const url = `https://openexchangerates.org/api/convert/${price}/${currency}/USD?app_id=${API_ID}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error)
          createPrice(
            {
              ...request,
              query: {
                date_from,
                date_to,
                origin_code,
                destination_code,
                price: resp.response,
              },
            },
            response
          );
        else {
          response.status(500).json({ errors: data });
        }
      })
      // ERROR HANDLING
      .catch((error) => esponse.status(500).json({ errors: error }));
  }
};
export default {
  createPrice,
  getAllRates,
  getAllNullRates,
  createConvertedPrice,
};
