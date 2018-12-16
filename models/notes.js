

module.exports = function (sequelize, DataTypes) {
    var Notes = sequelize.define("Notes", {

        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            isUnique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        long: {

            type: DataTypes.INTEGER,
            validate: {
                len: [1, 1]
            }
        },
        date: {
            type: DataTypes.DATE
        },
        completed: {
            type: DataTypes.INTEGER,
            validate: {
                len: [1, 1]
            }
        },
        color: {
            type: DataTypes.STRING,
            required: true,
            validate: {
                len: [20]
            }
        }

    });

    Notes.associate = function (models) {
        Notes.belongsTo(models.Accounts, { foreignKey: "uuid" });
    };




    return Notes;
};
