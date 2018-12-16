
module.exports = function (sequelize, DataTypes) {
    var Tasks = sequelize.define("Tasks", {

        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            isUnique: true
        },
        assignedUser: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        assignedBy: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 30]
            }
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255]
            }
        },
        taskStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        statusDate: {
            type: DataTypes.DATE,
            required: true,
            validate: {
                len: [8]
            }
        },
        deadline: {
            type: DataTypes.DATE
        },
        progress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        
        },
        isAccepted: {
            type: DataTypes.STRING,
            defaultValue: "NO",
            validate: {
                len: [1, 10]
            }
        }
    });

    Tasks.associate = function (models) {
        Tasks.belongsTo(models.Accounts, { foreignKey: "uuid" });
    };


    return Tasks;
};
