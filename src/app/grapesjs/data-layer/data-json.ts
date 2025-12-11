// Extract tree data into a separate constant for better readability and maintainability
export const TREE_DATA = [
  {
    name: "TagParameter",
    expanded: false,
    type: "tag_parameter",
    objType: "single",
    input: [],
  },
  {
    name: "DeviceParameter",
    expanded: false,
    type: "device_parameter",
    objType: "single",
    input: [
      { name: "ZipCode ", metadata: { type: "childLabel", edit: true, fallback: true } },
      { name: "State", metadata: { type: "childLabel", edit: true, fallback: true } },
      { name: "Country", metadata: { type: "childLabel", edit: true, fallback: true } },
    ],
  },
  {
    name: "offer_master",
    type: "dme",
    objType: "multi",
    count: 3,
    metadata: {
      type: "parentLabel",
      edit: true,
      fallback: true,
      transform: true,
      delete: true,
      addDME: true,
      addAPI: true,
    },
    childEntity: [
      {
        name: "offer_master_1",
        type: "dme",
        count: 7,
        metadata: { type: "parentLabel", fallback: true, transform: true },
        input: [
          { name: "offer_master_1.1", metadata: { type: "childLabel", edit: true, fallback: true } },
          { name: "offer_master_1.2", metadata: { type: "childLabel", edit: true, fallback: true } },
        ],
      },
    ],
    input: [
      { name: "name", metadata: { type: "childLabel", edit: true, fallback: true } },
      { name: "bar_code", metadata: { type: "childLabel", edit: true, fallback: true } },
      { name: "img_url", metadata: { type: "childLabel", edit: true, fallback: true } },
    ],
  },
  {
    name: "RR_reco",
    expanded: false,
    type: "api",
    count: 8,
    objType: "multi",
    metadata: {
      type: "parentLabel",
      edit: true,
      fallback: true,
      transform: true,
      delete: true,
      addDME: true,
      addAPI: true,
    },
    childEntity: [
      {
        name: "Realtime_price",
        type: "dme",
        objType: "single",
        metadata: { type: "parentLabel", fallback: true, transform: true },
        input: [
          { name: "retail_price", metadata: { type: "childLabel", fallback: true, transform: true } },
          { name: "offer_price", metadata: { type: "childLabel", fallback: true, transform: true } },
        ],
      },
    ],
    input: [
      { name: "product_name", metadata: { type: "childLabel", fallback: true, transform: true } },
      { name: "image_url", metadata: { type: "childLabel", fallback: true, transform: true } },
      { name: "link_click", metadata: { type: "childLabel", fallback: true, transform: true } },
      { name: "price", metadata: { type: "childLabel", fallback: true, transform: true } },
    ],
  },
  {
    name: "customer_category_affinity",
    type: "api",
    objType: "single",
    metadata: {
      type: "parentLabel",
      edit: true,
      fallback: true,
      transform: true,
      delete: true,
      addDME: true,
      addAPI: true,
    },
    childEntity: [
      {
        name: "RR_reco",
        type: "api",
        count: 5,
        objType: "multi",
        metadata: {
          type: "parentLabel",
          edit: true,
          fallback: true,
          transform: true,
          delete: true,
          addDME: true,
          addAPI: true,
        },
        childEntity: [
          {
            name: "Realtime_price",
            type: "api",
            objType: "single",
            metadata: { type: "parentLabel", fallback: true, transform: true },
            input: [
              { name: "retail_price", metadata: { type: "childLabel", fallback: true, transform: true } },
              { name: "offer_price", metadata: { type: "childLabel", fallback: true, transform: true } },
            ],
          },
          {
            name: "Realtime_SF",
            type: "api",
            objType: "single",
            metadata: { type: "parentLabel", fallback: true, transform: true },
            input: [
              { name: "msg", metadata: { type: "childLabel", fallback: true, transform: true } },
              { name: "ratings", metadata: { type: "childLabel", fallback: true, transform: true } },
            ],
          },
        ],
        input: [
          { name: "product_name", metadata: { type: "childLabel", fallback: true, transform: true } },
          { name: "image_url", metadata: { type: "childLabel", fallback: true, transform: true } },
          { name: "link_click", metadata: { type: "childLabel", fallback: true, transform: true } },
          { name: "price", metadata: { type: "childLabel", fallback: true, transform: true } },
        ],
      },
    ],
    input: [
      { name: "cat_name", metadata: { type: "childLabel", fallback: true, transform: true } },
      { name: "cat_image", metadata: { type: "childLabel", fallback: true, transform: true } },
      { name: "cat_landing_url", metadata: { type: "childLabel", fallback: true, transform: true } },
    ],
  },
];
