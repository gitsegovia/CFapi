import jwt from "jsonwebtoken";
import { encrypt, getBase64, setBase64 } from "./security";
import config_auth from "../configs/config_auth";
import { isPasswordMatch } from "./is";
import { LIST_STATUS_USER_VALID_LOGIN } from "../const";

export const createTokenWeb = async (user) => {
  const { id } = user;

  const idHas = setBase64(id);

  const token = jwt.sign({ id: idHas }, config_auth.secretKey, {
    expiresIn: config_auth.expiresInWeb,
  });

  return token;
};

export const createTokenApp = async ({ id }) => {
  const idHas = setBase64(id);

  const token = jwt.sign({ id: idHas }, config_auth.secretKey, {
    expiresIn: config_auth.expiresInApp,
  });

  return token;
};

export const checkToken = async ({
  access_token,
  onTokenExpiration = "logout",
  models,
}) => {
  try {
    const result = {};

    await new Promise((resolve) => {
      jwt.verify(access_token, config_auth.secretKey, async (err, decode) => {
        if (err) {
          if (onTokenExpiration === "logout") {
            throw new Error("session_expired");
          } else {
            const oldTokenDecoded = jwt.decode(access_token, {
              complete: true,
            });

            const { id: userIdB64 } = oldTokenDecoded.payload;

            const userId = getBase64(userIdB64);

            const user = await models.User.findByPk(userId, {
              include: [
                {
                  model: models.Employee,
                  as: "Employee",
                },
              ],
            });

            if (user.status !== "Active") {
              throw new Error("account_inactive");
            }

            const idHas = setBase64(user.id);

            const accessToken = jwt.sign({ id: idHas }, config_auth.secretKey, {
              expiresIn: config_auth.expiresInWeb,
            });

            result.user = user;
            result.token = accessToken;

            resolve(result);
          }
        } else {
          const { id: userIdB64 } = decode;

          const userId = getBase64(userIdB64);

          const user = await models.User.findByPk(userId, {
            include: [
              {
                model: models.Employee,
                as: "Employee",
              },
            ],
          });

          if (user.status !== "Active") {
            throw new Error("account_inactive");
          }

          const idHas = setBase64(user.id);

          const accessToken = jwt.sign({ id: idHas }, config_auth.secretKey, {
            expiresIn: config_auth.expiresInWeb,
          });

          result.user = user;
          result.token = accessToken;

          resolve(result);
        }
      });
    });

    return result;
  } catch (e) {
    throw new Error("invalid_token");
  }
};

export const doLoginEmployee = async (
  { email, password, systemConnect },
  models
) => {
  const user = await models.User.findOne({
    where: { email, typeUser: "Employee" },
    include: {
      model: models.Employee,
      as: "Employee",
    },
  });
  if (!user) {
    throw new Error("Usuario o clave invalida");
  }

  const passwordMatch = isPasswordMatch(encrypt(password), user.password);
  const isActive = user.status === "Active";

  if (!passwordMatch || !isActive) {
    throw new Error("Usuario o clave invalida");
  }
  let token = "";
  if (systemConnect === "App") {
    token = createTokenApp({ id: user.id });
  } else {
    token = createTokenWeb({ id: user.id });
  }
  return { user, token };
};
