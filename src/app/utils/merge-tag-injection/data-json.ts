[{
  "name": "storedData",
  "displayName": "Stored Data",
  "items": [
    {
      "name": "Customer",
      "type": "Customer",
      "objType": "single",
      "input": [
        { "displayName": "CustomerCode", "actualName": "Customer.CustomerCode", "varArrayType": false },
        { "displayName": "TemplateId", "actualName": "Customer.TemplateId", "varArrayType": false },
        { "displayName": "CreatedDate", "actualName": "Customer.CreatedDate", "varArrayType": false },
        { "displayName": "UpdatedDate", "actualName": "Customer.UpdatedDate", "varArrayType": false },
        { "displayName": "CustomerCodeExternal", "actualName": "Customer.CustomerCodeExternal", "varArrayType": false },
        { "displayName": "CustomerSalutation", "actualName": "Customer.CustomerSalutation", "varArrayType": false }
        
      ],
      "attributeCount": 6
    },
    {
      "name": "Promotion",
      "type": "Promotion",
      "objType": "single",
      "input": [
        { "displayName": "PromotionCode", "actualName": "Promotion.PromotionCode", "varArrayType": false },
        { "displayName": "PromotionName", "actualName": "Promotion.PromotionName", "varArrayType": false },
        { "displayName": "PromotionDesc", "actualName": "Promotion.PromotionDesc", "varArrayType": false },
        { "displayName": "LatestWaveKey", "actualName": "Promotion.LatestWaveKey", "varArrayType": false },
        { "displayName": "ListId", "actualName": "Promotion.ListId", "varArrayType": false },
        { "displayName": "StartDate", "actualName": "Promotion.StartDate", "varArrayType": false },
        { "displayName": "EndDate", "actualName": "Promotion.EndDate", "varArrayType": false }
      ],
      "attributeCount": 7
    },
    {
      "name": "Event",
      "type": "Event",
      "objType": "single",
      "input": [
        { "displayName": "Purchased Products", "actualName": "Event.productCode", "varArrayType": true },
        { "displayName": "Total Price", "actualName": "Event.totalPrice", "varArrayType": false },
        { "displayName": "Discount", "actualName": "Event.discount", "varArrayType": false }
      ],
      "attributeCount": 3
    }
  ]
},
  {

  "name": "apiData",
  "displayName": "API Data",
  "items": [
    {
      "name": "Abnd_Crt_api_1",
      "type": "API",
      "objType": "single",
      "input": [
        { "displayName": "clickURL", "actualName": "{API.Abnd_Crt_api_1.clickURL}", "varArrayType": true },
        { "displayName": "rating", "actualName": "{API.Abnd_Crt_api_1.rating}", "varArrayType": false },
        { "displayName": "salePriceCents", "actualName": "{API.Abnd_Crt_api_1.salePriceCents}", "varArrayType": false }
      ],
      "attributeCount": 3
    },
    {
      "name": "AllenSollyRecsAPI",
      "type": "API",
      "objType": "Multi",
      "input": [
        { "displayName": "imageURL", "actualName": "{API.AllenSollyRecsAPI.imageURL}", "varArrayType": true },
        { "displayName": "clickTrackingURL", "actualName": "{API.AllenSollyRecsAPI.clickTrackingURL}", "varArrayType": false },
        { "displayName": "name", "actualName": "{API.AllenSollyRecsAPI.name}", "varArrayType": false },
        { "displayName": "Gender", "actualName": "{API.AllenSollyRecsAPI.Gender}", "varArrayType": false }
      ],
      "attributeCount": 4
    }
  ]
  },
  {
  "name": "dmeData",
  "displayName": "DME Data",
  "items": [
    {
      "name": "Rating_DME_Chk",
      "type": "DME",
      "objType": "Multi",
      "input": [
        { "displayName": "ProductCode", "actualName": "{dme.Rating_DME_Chk.ProductCode}", "varArrayType": true },
        { "displayName": "ProductName", "actualName": "{dme.Rating_DME_Chk.ProductName}", "varArrayType": false },
        { "displayName": "ProductRating", "actualName": "{dme.Rating_DME_Chk.ProductRating}", "varArrayType": false }
      ],
      "attributeCount": 3
    },
    {
      "name": "customer_affinity_product",
      "type": "DME",
      "objType": "Multi",
      "input": [
        { "displayName": "email_address", "actualName": "{dme.customer_affinity_product.email_address}", "varArrayType": true },
        { "displayName": "firstName", "actualName": "{dme.customer_affinity_product.firstName}", "varArrayType": false },
        { "displayName": "lastName", "actualName": "{dme.customer_affinity_product.lastName}", "varArrayType": false },
        { "displayName": "age", "actualName": "{dme.customer_affinity_product.age}", "varArrayType": false }
      ],
      "attributeCount": 4
    },
    {
      "name": "product_master",
      "type": "DME",
      "objType": "Multi",
      "input": [
        { "displayName": "product_id", "actualName": "{dme.product_master.product_id}", "varArrayType": true },
        { "displayName": "name", "actualName": "{dme.product_master.name}", "varArrayType": false },
        { "displayName": "price", "actualName": "{dme.product_master.price}", "varArrayType": false },
        { "displayName": "imageUrl", "actualName": "{dme.product_master.imageUrl}", "varArrayType": false }
      ],
      "attributeCount": 4
    }
  ]
}]