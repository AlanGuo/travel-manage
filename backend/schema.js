var Sequelize = require('sequelize');
var connection = require('./connection');

//定义User表
var Admin = connection.define('admin', {
    uid: { 
        type: Sequelize.UUID, 
        primaryKey: true, 
        defaultValue: Sequelize.UUIDV4, 
        allowNull: false
    },
    //uid: Sequelize.STRING(36),
    name: Sequelize.STRING(45),
    password: Sequelize.STRING(45),
    email: Sequelize.STRING(60),
    mobile: Sequelize.STRING(30)
},{
  timestamps: false,
  freezeTableName: true
});

var schema = {
    Admin : Admin
};


module.exports = schema;




