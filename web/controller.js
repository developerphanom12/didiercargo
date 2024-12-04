
import axios from 'axios';
import db from './database/connection.js'





async function checkTokenShop(shopName) {
  return new Promise((resolve, reject) => {
    const query = "SELECT tokenshop FROM store_detail WHERE shopname = ?";
    db.query(query, [shopName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0].tokenshop : null);
      }
    });
  });
}


const shopName = "productinsight-review.myshopify.com";
async function fetchInsuranceData() {
  return new Promise((resolve, reject) => {
    const query = `SELECT insuranceid, product_id, id, created_at FROM products`;
    db.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

export const orderget = async (req, res) => {
  
  try {
    const response = await axios.get(`https://${shopName}/admin/api/2024-04/orders.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });
    
    const orders = response.data.orders;
    const insuranceData = await fetchInsuranceData();
    
    console.log("Fetched Insurance Data:", insuranceData,orders); // Log fetched insurance data for debugging
    
    // Create a mapping of insurance data
    const insuranceMap = insuranceData.reduce((map, product) => {
      const insuranceId = product.insuranceid.split('/').pop(); // Extract insurance ID
      map[insuranceId] = product; 
      return map;
    }, {});

    const result = await Promise.all(
      orders.map(async (order) => {
        if (order.line_items) {
          const matchingLineItems = order.line_items.filter(lineItem => {
            return insuranceMap[lineItem.variant_id.toString()]; // Ensure proper type matching
          });
          
          if (matchingLineItems.length > 0) {
            const trackingInfo = order.fulfillments.map(fulfillment => ({
              tracking_number: fulfillment.tracking_number || null,
              tracking_url: fulfillment.tracking_url || null,
              shipping_status: fulfillment.shipment_status || "Not shipped",
                      }));

                      const insuranceProducts = await Promise.all(
                          matchingLineItems.map(async (item) => {
                              const insuranceDetails = insuranceMap[item.variant_id.toString()]; // Match properly
                              
                              try {
                                const variantResponse = await axios.get(`https://${shopName}/admin/api/2024-04/variants/${item.variant_id}.json`, {
                                  headers: {
                                    "X-Shopify-Access-Token": accessToken,
                                  },
                                });
                                
                                  const variantTitle = variantResponse.data.variant.title; 

                                  return {
                                      insurance_id: item.variant_id,
                                      insurance_details: insuranceDetails,
                                      title: variantTitle,
                                      price: item.price,
                                      quantity: item.quantity,
                                    };
                              } catch (error) {
                                  console.error(`Error fetching variant for item ${item.variant_id}:`, error.message);
                                  return null; // Skip if there's an error
                              }
                          })
                      );

                      return {
                          order_id: order.id,
                          total_price: order.total_price,
                          financial_status: order.financial_status,
                          fulfillment_status: order.fulfillment_status || null,
                          tracking_info: trackingInfo.length > 0 ? trackingInfo : "No tracking info available",
                          insurance_products: insuranceProducts.filter(p => p !== null), // Remove null entries
                      };
                  }
              }
              return null; // If no matching line items, return null
            })
      );

      const filteredResult = result.filter(order => order); // Filter out null orders
      res.status(200).json({ status: 200, data: filteredResult });
    } catch (error) {
      console.error("Error in order retrieval:", error.message); // Log the error for debugging
      res.status(500).json({ success: false, error: error.message });
  }
};



export const claimsget = async (req, res) => {
  
  const checkQuery = `
  SELECT * FROM claimsdata 
  WHERE storename = ?
  `;
  const checkValues = [shopName];
  
  try {
      const checkResult = await new Promise((resolve, reject) => {
        db.query(checkQuery, checkValues, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
  
      // Respond with the retrieved claims data
      res.status(200).json({ message: 'Claims retrieved successfully', claims: checkResult });
    } catch (error) {
      console.error('Error retrieving claims:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  
  
  
  export const insurnacePercentageget = async (req, res) => {
    const storename = "productinsight-review.myshopify.com";
    
    const checkQuery = `
    SELECT * FROM store_claimpercentage 
    WHERE storename = ?
    `;
    const checkValues = [storename];
    
    try {
      const checkResult = await new Promise((resolve, reject) => {
        db.query(checkQuery, checkValues, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
      
      // Respond with the retrieved claims data
      res.status(200).json({ message: 'Claims retrieved successfully', claims: checkResult });
    } catch (error) {
      console.error('Error retrieving claims:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  const accessToken = await checkTokenShop(shopName);
  