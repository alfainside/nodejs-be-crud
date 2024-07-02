const db = require("../models");
const Business = db.business;
const Category = db.category;
const Op = db.Sequelize.Op;
const { uuid } = require('uuidv4');

// Create and Save a new Business
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    this.globalRes(req, res, {status: 400, success: false, data: null, message: `Content can not be empty!`})
    return;
  }

  // Create a Business
  const business = {
    id: uuid(),
    alias: req.body.alias,
    name: req.body.name,
    image_url: req.body.image_url,
    is_closed: req.body.is_closed,
    url: req.body.url,
    review_count: req.body.review_count,
    rating: req.body.rating,
    latitude: req.body.coordinates.latitude,
    longitude: req.body.coordinates.longitude,
    transactions: req.body.transactions,
    price: req.body.price,
    address1: req.body.location.address1,
    address2: req.body.location.address2,
    address3: req.body.location.address3,
    city: req.body.location.city,
    zip_code: req.body.location.zip_code,
    country: req.body.location.country,
    state: req.body.location.state,
    phone: req.body.phone,
    display_phone: req.body.display_phone,
  };

  // Save Business in the database
  Business.create(business)
    .then(() => {
      for(let i = 0; i < req.body.categories.length; i++){
        Category.create({
          id: uuid(),
          id_business: business.id,
          alias: req.body.categories[i].alias,
          title: req.body.categories[i].title,
        })
        .then(() => {
          this.globalRes(req, res, {status: 200, success: true, data: null, message: `Success create data`})
        })
        .catch(err => {
          this.globalRes(req, res, {status: 500, success: false, data: null, message: err.message || "Some error occurred while creating the Business."})
        });
      }
    })
    .catch(err => {
      this.globalRes(req, res, {status: 500, success: false, data: null, message: err.message || "Some error occurred while creating the Business."})
    });
};

// Find a single Business with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;
  const project = await Business.findOne({ where: { id: id }});
  if (project === null) {
    this.globalRes(req, res, {status: 400, success: false, data: null, message: `Cannot find Business with id=${id}.`})
  } else {
    let datas = project.dataValues;
    this.globalRes(req, res, {status: 200, success: true, data: this.globalObj(datas), message: "Success get data"})
  }
};

// Update a Business by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;
  // Data a Business
  const businessData = {
    alias: req.body.alias,
    name: req.body.name,
    image_url: req.body.image_url,
    is_closed: req.body.is_closed,
    url: req.body.url,
    review_count: req.body.review_count,
    rating: req.body.rating,
    latitude: req.body.coordinates.latitude,
    longitude: req.body.coordinates.longitude,
    transactions: req.body.transactions,
    price: req.body.price,
    address1: req.body.location.address1,
    address2: req.body.location.address2,
    address3: req.body.location.address3,
    city: req.body.location.city,
    zip_code: req.body.location.zip_code,
    country: req.body.location.country,
    state: req.body.location.state,
    phone: req.body.phone,
    display_phone: req.body.display_phone,
  };


  const updateBusiness = await Business.update(businessData, { where: { id: id }});

  // Delete Category
  const deleteCategory = await Category.destroy({ where: { id_business: id }});
  for(let i = 0; i < req.body.categories.length; i++){
    // Create Category
    const createCategory = await Category.create({
      id: uuid(),
      id_business: id,
      alias: req.body.categories[i].alias,
      title: req.body.categories[i].title
    });
  }
  
  if (updateBusiness[0] === 1) {
    this.globalRes(req, res, {status: 200, success: true, data: null, message: `Business was updated successfully`})
  } else {
    this.globalRes(req, res, {status: 200, success: false, data: null, message: `Cannot update Business with id=${id}. Maybe Business was not found or req.body is empty`})
  }
};

// Delete a Business with the specified id in the request
exports.delete = async (req, res) => {
  const id = req.params.id;
  const deleteCategory = await Category.destroy({ where: { id_business: id }});
  const deleteBusiness = await Business.destroy({ where: { id: id }});
  if (deleteBusiness === 0 && deleteCategory === 0) {
    this.globalRes(req, res, {status: 400, success: false, data: null, message: `Cannot find Business with id=${id}.`})
  } else {
    this.globalRes(req, res, {status: 200, success: true, data: null, message: `Business was deleted successfully`})
  }
};

// find all published Business
exports.findAllPublished = (req, res) => {
  return Business.findAll({
    where: {
      [Op.or]: [
        {
          alias: { [Op.like] : req.query.alias }
        },
        {
          name: { [Op.like] : req.query.name }
        },
        {
          phone: { [Op.like] : req.query.phone }
        },
        {
          country: { [Op.like] : req.query.country }
        },
        {
          city: { [Op.like] : req.query.city }
        },
        {
          zip_code: { [Op.like] : req.query.zip_code }
        },
        {
          state: { [Op.like] : req.query.state }
        },
        {
          latitude: { [Op.like] : req.query.latitude }
        },
        {
          longitude: { [Op.like] : req.query.longitude }
        }
      ]
    },
    include: [
      {
        where: {
          alias: {[Op.like] : req.query.categories}
        },
        model: Category, 
        as: "category", 
        attributes: ["alias", "title"]
      }
    ],
  })
  .then(data => {
    if(data.length === 0){
      this.globalRes(req, res, {status: 400, success: false, data: data, message: 'Data not found!'})
    } 
    let datas = data[0].dataValues;
    this.globalRes(req, res, {status: 200, success: true, data: this.globalObj(datas), message: 'Success get data'})
  })
  .catch(err => {
    this.globalRes(req, res, {status: 500, success: false, data: null, message: err.message || "Some error occurred while retrieving businesss."})
  });
};

// Object for select
exports.globalObj = (datas) => {
  let obj = {
    id: datas.id,
    alias: datas.alias,
    name: datas.name,
    image_url: datas.image_url,
    is_closed: datas.is_closed,
    url: datas.url,
    review_count: datas.review_count,
    categories: datas.category,
    rating: datas.rating,
    coordinates: {
      latitude: datas.latitude,
      longitude: datas.longitude,
    },
    transactions: JSON.parse(datas.transactions),
    location: {
      address1: datas.address1,
      address2: datas.address2,
      address3: datas.address3,
      city: datas.city,
      zip_code: datas.zip_code,
      country: datas.country,
      state: datas.state,
      display_address: [
        datas.address1,
        datas.address2,
        datas.address3,
        datas.city,
        datas.zip_code,
        datas.country,
        datas.state,
      ]
    },
    phone: datas.phone,
    display_phone: datas.display_phone
  }
  obj.location.display_address = obj.location.display_address.filter(function(e) { return e !== '' })
  return obj;
}

// Response data global
exports.globalRes = (req, res, {status, success, data, message}) => {
  return res.status(status).send({
    success: success,
    data: data,
    message: message,
  });
}