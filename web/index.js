// @ts-nocheck
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import db from './database/connection.js'
import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import axios from "axios";
import { routes } from "./routes.js";
import dotenv  from 'dotenv'
import Stripe from 'stripe'
import connection from "./database/connection.js";
dotenv.config(); 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORTS = process.env.PORTS;
console.log("port",PORTS)


const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use("/apiProduct",routes );



async function checkTokenShop(shopName) {
  return new Promise((resolve, reject) => {
    const query = "SELECT tokenshop FROM store_detail WHERE shopname = ?";
    connection.query(query, [shopName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0].tokenshop : null);
      }
    });
  });
}



function insertOrUpdateInsurance(product_ids, insuranceTitle, price, shopName, insuranceId) {
  return new Promise((resolve, reject) => {
    // Validate that product_ids is an array and not empty
    if (!Array.isArray(product_ids) || product_ids.length === 0) {
      return reject(new Error("Product IDs must be a non-empty array."));
    }

    // Create placeholders for the query
    const placeholders = product_ids.map(() => "(?, ?, ?, ?, ?)").join(", ");
    const insertQuery = `
      INSERT INTO products (product_id, title, price, store_name, insuranceid)
      VALUES ${placeholders}
    `;

    // Flatten the product_ids array for the query parameters
    const params = product_ids.flatMap(product_id => [product_id, insuranceTitle, price, shopName, insuranceId]);

    // Execute the query
    db.query(insertQuery, params, (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result);  
    });
  });
}


app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res) => {
    const shop = req.query.shop;


    const thirdPartyUrl = `https://www.phanomprofessionals.com?shop=${shop}`;
    res.redirect(thirdPartyUrl);
  }
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());




async function claimdatastore(id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM products WHERE id = ?`; 
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

//==============================================New Test API==================================
//############################################## NEW TEST ####################################
//############################################## API #########################################

//  Backend API to create a product via Shopify Admin API _
// app.post('/products', async (req, res) => {
//   const productData = {
//     product: {
//       title: "Insurance Productssssss",
//       body_html: "<strong>Insurance for damage protection</strong>",
//       variants: [
//         {
//           option1: "ABC",
//           price: "5.00",
//           sku: "insurance-sku",
//           inventory_management: "shopify",  // Track inventory via Shopify
//           inventory_policy: "continue",     // Allow purchases even if sold out, or use "deny"
//           fulfillment_service: "manual",
//           requires_shipping: true,
//           inventory_quantity: 100,         // Set initial stock level (e.g., 100)
//           tracked: true                    // Enable inventory tracking
//         }
//       ]
//     }
//   };

//   try {
//     const response = await axios.post(`https://productinsight-review.myshopify.com/admin/api/2024-10/products.json`, productData, {
//       headers: {
//         'X-Shopify-Access-Token': 'shpua_b073306ebe6368bada0ea8d5c6a994a7',
//         'Content-Type': 'application/json'
//       }
//     });
//     res.json({ status: 200, data: response.data.product });
//   } catch (error) {
//     res.json({ status: 'error', message: error.message });
//   }
// });


// New


 // @ts-ignore  
 app.post("/product", async (req, res) => {
    try {
      const changeValue = Math.floor(Math.random() * 100000);  
      const option = `CargoInsurance ${changeValue}`;
      const { price, product_ids,shopName } = req.body;
      const accessToken = await checkTokenShop(shopName);
      const productName = req.query.name || 'Protection'; 
  
      const query = `
        {
          products(first: 150, query: "title:*${productName}*") {
            edges {
              node {
                id
                title
                images(first: 1) {
                  edges {
                    node {
                      src
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price
                    }
                  }
                }
              }
            }
          }
        }
      `;
  
      const response = await axios.post(
        `https://${shopName}/admin/api/graphql.json`,
        { query },
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
          },
        }
      );
  
      const products = response.data.data.products.edges.map((edge) => {
        const product = edge.node;
        return {
          id: product.variants.edges.length > 0 ? product.variants.edges[0].node.id : null,
          title: product.title,
          image: product.images.edges.length > 0 ? product.images.edges[0].node.src : null,
          price: product.variants.edges.length > 0 ? product.variants.edges[0].node.price : null,
          productId: product.id,
        };
      });
  
      if (products.length > 0) {
        const product = products[0]; 
        console.log("Product found:", product);
  
        const createVariantMutation = `
          mutation {
            productVariantCreate(input: {
              productId: "${product.productId}",
              price: "${price}",
              options: ["${option}"],
              inventoryPolicy: CONTINUE
            }) {
              productVariant {
                id
                title
                price
                inventoryPolicy
              }
              userErrors {
                field
                message
              }
            }
          }
        `;
  
        const variantResponse = await axios.post(
          `https://${shopName}/admin/api/graphql.json`,
          { query: createVariantMutation },
          {
            headers: {
              "X-Shopify-Access-Token": accessToken,
            }
          }
        );
  
        const newVariant = variantResponse.data.data?.productVariantCreate?.productVariant;
        console.log("newvaraint",newVariant);
  
        if (newVariant) {
          const insuranceId = newVariant.id;
  
          const dbResult = await insertOrUpdateInsurance(product_ids, newVariant.title, price, shopName, insuranceId);
  
          return res.status(200).json({ status: 200, data: newVariant });
        } else {
          return res.status(500).json({ success: false, error: "Failed to create variant" });
        }
      } else {
        return res.status(404).json({ success: false, error: "No products found" });
      }
  
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  });

// @ts-ignore
app.post('/claimsdataadd', async (req, res) => {
  const { premiumAmount, storename, productName } = req.body;

  
  const customer = 'default_customer';
  const event = 'default_event'; 
  const isActive = 1; 
  const isDeleted = 0;
  const openingUpdate = new Date(); 
  const lastUpdate = new Date(); 

  const checkQuery = `
    SELECT COUNT(*) AS claimCount FROM claimsdata 
    WHERE productName = ? 
  `;
  const checkValues = [productName];

  try {
    const [checkResult] = await new Promise((resolve, reject) => {
      db.query(checkQuery, checkValues, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    if (checkResult.claimCount > 0) {
      return res.status(400).json({ error: 'Claim already exists for this product. Please wait for admin approval.' });
    }

    const query = `
      INSERT INTO claimsdata (customer, event, Amount, opening_update, last_update, is_active, is_deleted, storename, productName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `; 

    const values = [customer, event, premiumAmount, openingUpdate, lastUpdate, isActive, isDeleted, storename, productName];

    const result = await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(201).json({ message: 'Claim added successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding claim:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @ts-ignore
app.post('/insuranceset', async (req, res) => {
  const { storename, percentage } = req.body;
  try {
   
    const query = `
      INSERT INTO store_claimpercentage ( storename, percentage)
      VALUES (?, ?)
    `; 

    const values = [storename, percentage];

    const result = await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(201).json({ message: 'Insurance Premium rates successfully', id: result.insertId });
  } catch (error) {
    console.error('Error adding claim:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Define your endpoint for creating payment intents
app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency, description, receipt_email } = req.body;

  try {
    // Step 1: Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      receipt_email,
    });

    
    // Return the client secret to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Payment Intent Creation Failed');
  }
});


app.get('/api/store/info', async (req, res) => {
  try {
    const SHOPIFY_STORE_URL = "productinsight-review.myshopify.com";
    const SHOPIFY_ACCESS_TOKEN = "shpua_b073306ebe6368bada0ea8d5c6a994a7";

      const response = await axios.get(`https://${SHOPIFY_STORE_URL}/admin/api/2023-10/shop.json`, {
          headers: {
              'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
              'Content-Type': 'application/json',
          },
      });

      res.json(response.data.shop);
  } catch (error) {
      console.error('Error fetching store info:', error);
      res.status(500).json({ error: 'Failed to fetch store information from Shopify' });
  }
});


app.post('/insuractive', async (req, res) => {
  const { shopname, activate } = req.body;

  try {
    // Check if the shopname already exists in the table
    const checkQuery = `SELECT * FROM store_insuranceactive WHERE shopname = ?`;
    const existingRecord = await new Promise((resolve, reject) => {
      db.query(checkQuery, [shopname], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    let query;
    let values;

    if (existingRecord.length > 0) {
      // If the shopname exists, update the activate value
      query = `UPDATE store_insuranceactive SET activate = ? WHERE shopname = ?`;
      values = [activate, shopname];
    } else {
      // If the shopname does not exist, insert a new row
      query = `INSERT INTO store_insuranceactive (shopname, activate) VALUES (?, ?)`;
      values = [shopname, activate];
    }

    const result = await new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(200).json({ status: 200, message: 'Insurance status successfully updated or added' });
  } catch (error) {
    console.error('Error updating or adding insurance status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const shopUrl = 'https://productinsight-review.myshopify.com'; // Replace with your shop URL
const accessToken = 'shpua_3cd98f6a75c0b2e615f0b1b66b0cd6bb'; // Replace with your access token

// Route to fetch product details
app.get('/product', async (req, res) => {
  const query = `
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            descriptionHtml
            vendor
            productType
            createdAt
            updatedAt
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  sku
                  inventoryQuantity
                }
              }
            }
            images(first: 5) {
              edges {
                node {
                  id
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      `${shopUrl}/admin/api/2023-10/graphql.json`, 
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    // Return the data from Shopify
    res.json(response.data);
  } catch (error) {
    // Handle errors (e.g., API issues, invalid access token)
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Error fetching product details' });
  }
});


app.get('/insuractivefetch', async (req, res) => {
  const { shopname} = req.query;

  try {
    // Check if the shopname already exists in the table
    const checkQuery = `SELECT * FROM store_insuranceactive WHERE shopname = ?`;
    const existingRecord = await new Promise((resolve, reject) => {
      db.query(checkQuery, [shopname], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    res.status(200).json({ status: 200, data:existingRecord});
    console.log("mujeyyadrkhna",existingRecord)
  } catch (error) {
    console.error('Error updating or adding insurance status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// @ts-ignore
app.use(shopify.cspHeaders());
// @ts-ignore
app.use(serveStatic(STATIC_PATH, { index: false }));

// @ts-ignore
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORTS, () => {
  console.log(`Server is running on ${PORTS} `);
});