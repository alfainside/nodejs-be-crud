module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        id_business: {
            type: DataTypes.STRING,
        },
        alias: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.STRING
        }
    });
  
    return Category;
};