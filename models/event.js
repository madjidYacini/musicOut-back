import Sequelize, { Model, Op } from "sequelize";
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
          allowNull: true
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
          allowNull: true
        },
        dislike: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        duration: {
          type: Sequelize.STRING,
          allowNull: true
        },
        schedule: {
          type: Sequelize.STRING,
          allowNull: true
        },
        finish: {
          type: Sequelize.BOOLEAN,
          allowNull: true
        },
        kind: {
          type: Sequelize.STRING,
          allowNull: true
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
  }
}
