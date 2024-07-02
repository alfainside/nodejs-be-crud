module.exports = app => {
  const business = require("../controllers/business.js");

  var router = require("express").Router();

  // Create a new Business
  router.post("/", business.create);

  // Retrieve all published Businesss
  router.get("/search", business.findAllPublished);

  // Retrieve a single Business with id
  router.get("/:id", business.findOne);

  // Update a Business with id
  router.put("/:id", business.update);

  // Delete a Business with id
  router.delete("/:id", business.delete);

  app.use('/api/business', router);
};
