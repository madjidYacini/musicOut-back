import Sequelize, { Model } from "sequelize";

export default class Event extends Model {
  static init(database) {
    return super.init(
      {
        EventId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false
        },
        picture: {
          type: Sequelize.STRING,
          allowNull: false
        },
        latitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        longitude: {
          type: Sequelize.FLOAT,
          allowNull: false
        },
        like: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        dislike: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      },
      {
        tableName: "Event",
        sequelize: database,

        indexes: [
          {
            unique: true,
            fields: ["EventId"]
          }
        ]
      }
    );
  }
  static associate(models) {
    models.Event.belongsTo(models.User, { as: "user" });
    // models.Event.hasMany(models.Kind, { as: "kind" });
  }
}
