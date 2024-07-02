module.exports = (sequelize, Sequelize) => {
  const Business = sequelize.define("business", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    alias: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    image_url: {
      type: Sequelize.STRING
    },
    is_closed: {
      type: Sequelize.BOOLEAN
    },
    url: {
      type: Sequelize.STRING
    },
    review_count: {
      type: Sequelize.DOUBLE
    },
    categories: {
      type: Sequelize.TEXT
    },
    rating: {
      type: Sequelize.DOUBLE
    },
    latitude: {
      type: Sequelize.DOUBLE
    },
    longitude: {
      type: Sequelize.DOUBLE
    },
    transactions: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    },
    address1: {
      type: Sequelize.STRING
    },
    address2: {
      type: Sequelize.STRING
    },
    address3: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    zip_code: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    },
    display_phone: {
      type: Sequelize.STRING
    },
  });

  return Business;
};
