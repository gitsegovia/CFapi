import { Model, UUID, UUIDV4, STRING, TEXT, BOOLEAN, INTEGER } from "sequelize";
import { encrypt, makeCodeNumeric } from "../utils/security";

const createModel = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Employee, {
        foreignKey: {
          name: "employeeId",
          field: "employeeId",
        },
        as: "Employee",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4,
      },
      email: {
        allowNull: false,
        type: STRING,
      },
      codeCountryPhone: {
        allowNull: false,
        type: STRING,
        defaultValue: "+507",
      },
      phone: {
        allowNull: false,
        type: STRING,
      },
      password: {
        allowNull: false,
        type: STRING,
      },
      pin: {
        allowNull: true,
        type: STRING,
        defaultValue: makeCodeNumeric(4),
      },
      typeUser: {
        allowNull: false,
        type: STRING,
      },
      status: {
        allowNull: false,
        type: STRING,
        defaultValue: "Active",
      },
      typeSuspension: {
        allowNull: true,
        type: STRING,
      },
      reasonSuspension: {
        allowNull: true,
        type: TEXT,
      },
      numberUser: {
        allowNull: false,
        type: INTEGER,
        defaultValue: 0,
      },
      nameUser: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          let valor = await User.findAll({
            attributes: [
              [sequelize.fn("max", sequelize.col("numberUser")), "maxNumber"],
            ],
            raw: true,
          });
          let number = 1;
          if (valor && valor[0].maxNumber != null) {
            number += valor[0].maxNumber;
          }
          user.numberUser = number;
          user.password = encrypt(user.password);
          user.email = user.email.trim().toLowerCase();
        },
      },
      sequelize,
      modelName: "User",
    }
  );

  return User;
};

export default createModel;
