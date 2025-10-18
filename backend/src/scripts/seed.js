require('dotenv').config();
const { connectDB } = require('../config/db');
const ServiceCategory = require('../models/ServiceCategory');
const Service = require('../models/Service');

async function run() {
  await connectDB();
  const cat = await ServiceCategory.findOneAndUpdate(
    { slug: 'instagram' },
    { name: 'Instagram', slug: 'instagram' },
    { upsert: true, new: true }
  );
  await Service.findOneAndUpdate(
    { name: 'Instagram Followers' },
    { name: 'Instagram Followers', category: cat._id, pricePer1000: 100, minQty: 100, maxQty: 10000, description: 'High quality followers', status: 'active' },
    { upsert: true, new: true }
  );
  console.log('Seeded categories and services');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });

