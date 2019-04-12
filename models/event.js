import Sequelize, { Model } from "sequelize";

export default class Event extends Model {
  static init(database) {
    return super.init(
      {
        id: {
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
            fields: ["id"]
          }
        ]
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.User, { as: "user" });
    this.belongsTo(models.Kind, { as: "kind" });
  }
}
