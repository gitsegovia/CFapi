import { checkToken, doLoginProvider, doLoginEmployee } from "../../utils/auth";
import { AuthenticationError } from "../../utils/graphqlError";

export default {
  Query: {
    dataEmployeeByUserId: async (_, { userId }, { models }) => {
      const user = await models.User.findByPk(userId, {
        include: [
          {
            model: models.Provider,
            as: "Provider",
            include: [
              {
                model: models.ProviderPersonal,
                as: "ProviderPersonal",
              },
              {
                model: models.ProviderResponsible,
                as: "ProviderResponsible",
              },
              {
                model: models.CategoryCompany,
                as: "CategoryCompany",
              },
            ],
          },
        ],
      });

      if (user) {
        return user;
      }
      throw new Error("Usuario no encontrado");
    },
  },
  Mutation: {
    me: async (_, { token, onTokenExpiration }, { models }) => {
      try {
        const result = await checkToken({
          access_token: token,
          onTokenExpiration,
          models,
        });
        return result;
      } catch (error) {
        throw AuthenticationError(error);
      }
    },
    loginEmployee: (_, { input }, { models }) => {
      const { email, password, systemConnect } = input;
      try {
        const result = doLoginEmployee(
          { email, password, systemConnect },
          models
        );

        return result;
      } catch (error) {
        throw AuthenticationError(error);
      }
    },
    createAdmin: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const newUser = {
            email: "demo@demo.com",
            password: "1234",
            phone: "0000",
            typeUser: "Employee",
            nameUser: "ADMIN",
            Employee: {
              firstName: "admin",
              lastName: "admin",
              idnDni: "000000",
              gender: "male",
              position: "Admin",
              coordinator: true,
              role: "administrator",
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
        console.log(error);
        throw new Error("Error");
      }
    },
  },
};
