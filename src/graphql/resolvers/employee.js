import moment from "moment";
import { encrypt } from "../../utils/security";

export default {
  Query: {
    getAllEmployee: async (_, { search }, { models }) => {
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        include: {
          model: models.User,
          as: "User",
        },
      };

      if (options !== null) {
        if (options.limit > 0) {
          optionsFind.limit = options.limit;
        }
        if (options.offset > 0) {
          optionsFind.offset = options.offset;
        }
        if (options.orderBy) {
          optionsFind.order = options.orderBy.map((field, index) => {
            return [
              field,
              options.direction ? options.direction[index] ?? "ASC" : "ASC",
            ];
          });
          optionsFind.include.order = optionsFind.order;
        }
      }

      const listEmployee = await models.Employee.findAll(optionsFind);

      const infoPage = {
        count: listEmployee.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listEmployee,
      };
    },
    getAllIdEmployee: async (_, _args, { models }) => {
      const listEmployee = await models.Employee.findAll();

      const listId = listEmployee.map((t) => t.id);

      return listId;
    },
    getDataEmployeeById: async (_, { id }, { models }) => {
      const optionsFind = {
        include: {
          model: models.User,
          as: "User",
        },
      };

      const findEmployee = await models.Employee.findByPk(id, optionsFind);

      return findEmployee;
    },
  },
  Mutation: {
    createEmployee: async (_, { input }, { models }) => {
      const { id } = input;

      if (id) {
        const findEmployee = await models.Employee.findByPk(id);
        if (!findEmployee) {
          throw new Error("error");
        }

        if (findEmployee.active === false) {
          throw new Error("Usuario suspendido no puede ser modificado");
        }

        try {
          const result = await models.sequelizeInst.transaction(async (t) => {
            const upUser = {
              email: input.email,
            };
            if (input.password !== "") {
              upUser.password = encrypt(input.password);
            }
            const upEmployee = {
              ...input,
            };

            await models.Employee.update(
              { ...upEmployee },
              {
                where: {
                  id: id,
                },
                transaction: t,
              }
            );

            await models.User.update(
              { ...upUser },
              {
                where: {
                  employeeId: id,
                },
                transaction: t,
              }
            );

            return true;
          });

          return result;
        } catch (error) {
          throw new Error("error");
        }
      } else {
        try {
          const result = await models.sequelizeInst.transaction(async (t) => {
            const newUser = {
              email: input.email,
              password: input.password,
              phone: input.phone,
              typeUser: "Employee",
              nameUser: "ADMIN",
              Employee: {
                firstName: input.firstName,
                lastName: input.lastName,
                idnDni: input.idnDni,
                gender: input.gender,
                phone: input.phone,
                position: input.position,
                coordinator: true,
                role: input.role,
                birthDate: "1991-01-01",
                photo: "1.png",
                numberEmployee: 0,
              },
            };

            await models.User.create(
              { ...newUser },
              {
                include: {
                  model: models.Employee,
                  as: "Employee",
                },
                transaction: t,
              }
            );

            return true;
          });

          return result;
        } catch (error) {
          // PRIORITARIO Create error manager to handle internal messages or retries or others
          throw new Error("error");
        }
      }
    },
    deleteEmployeeById: async (_, { id }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const findAtt = await models.Attendance.findOne({
            where: {
              teacherId: id,
            },
          });

          if (findAtt) {
            throw new Error("1");
          }

          await models.Employee.destroy({
            where: {
              id: id,
            },
            include: {
              model: models.User,
              as: "User",
            },
            transaction: t,
          });

          return true;
        });

        return result;
      } catch (error) {
        // PRIORITARIO Create error manager to handle internal messages or retries or others

        if (error.message === "1") {
          throw new Error("Usuario ya tiene registro almacenado");
        }
        throw new Error("error");
      }
    },
  },
};
