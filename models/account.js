
var bcrypt = require('bcrypt');

//var uuidv1 = require('uuid/v1');
module.exports = function (sequelize, DataTypes) {
    var Accounts = sequelize.define("Accounts", {

        uuid: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            isUnique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        account_key: {
            type: DataTypes.STRING,
            required: false,
            allowNull: true,
            validate: {
                len: [8]
            }
        }

    });
    // methods ======================
    // generating a hash
    Accounts.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    // checking if password is valid
    Accounts.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.account_key);
    };

    Accounts.associate = function (models) {
        Accounts.hasMany(models.Tasks, { foreignKey: "id" });
    };

    Accounts.associate = function (models) {
        Accounts.hasMany(models.Notes, { foreignKey: "id" });
    };



    return Accounts;
};
