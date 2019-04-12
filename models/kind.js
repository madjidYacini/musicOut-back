import Sequelize, { Model } from "sequelize";

export default class Kind extends Model {
  static init(database) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        style: {
          type: Sequelize.STRING,
          allowNull: false
        }
      },
      {
        tableName: "kind",
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
    this.hasMany(models.Event, {
      as: "events"
    });
  }
}
