import {
  Model,
  UUID,
  UUIDV4,
  STRING,
  TEXT,
  DATEONLY,
  INTEGER,
  BOOLEAN,
} from "sequelize";

const createModel = (sequelize) => {
  class Employee extends Model {
    static associate(models) {
      Employee.hasOne(models.User, {
        foreignKey: {
          name: "employeeId",
          field: "employeeId",
        },
        as: "User",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Employee.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: STRING,
      },
      lastName: {
        allowNull: false,
        type: STRING,
      },
      typeDni: {
        allowNull: false,
        type: STRING,
        defaultValue: "dni",
      },
      idnDni: {
        allowNull: false,
        type: STRING,
      },
      gender: {
        allowNull: false,
        type: STRING,
      },
      birthDate: {
        allowNull: true,
        type: DATEONLY,
      },
      codeCountryPhone: {
        allowNull: false,
        type: STRING,
        defaultValue: "+507",
      },
      phone: {
        allowNull: false,
        type: STRING,
        defaultValue: "",
      },
      address: {
        allowNull: true,
        type: TEXT,
      },
      position: {
        allowNull: false,
        type: STRING,
      },
      coordinator: {
        allowNull: false,
        type: BOOLEAN,
        defaultValue: false,
      },
      role: {
        allowNull: false,
        type: TEXT,
      },
      photo: {
        allowNull: true,
        type: STRING,
      },
      dniImg: {
        allowNull: true,
        type: STRING,
      },
      numberEmployee: {
        allowNull: false,
        type: INTEGER,
      },
      active: {
        allowNull: false,
        type: BOOLEAN,
        defaultValue: true,
      },
    },
    {
      hooks: {
        beforeCreate: async (employee) => {
          let valor = await Employee.findAll({
            attributes: [
              [
                sequelize.fn("max", sequelize.col("numberEmployee")),
                "maxNumber",
              ],
            ],
            raw: true,
          });
          let number = 1;
          if (valor && valor[0].maxNumber != null) {
            number += valor[0].maxNumber;
          }
          employee.numberEmployee = number;
        },
      },
      sequelize,
      modelName: "Employee",
    }
  );
  return Employee;
};

export default createModel;
