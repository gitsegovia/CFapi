import { GraphQLError } from "graphql";

export const AuthenticationError = (error) => {
  return new GraphQLError(error, {
    extensions: {
      code: "UNAUTHENTICATED",
      myExtension: "foo",
    },
  });
};

export const ForbiddenError = (error) => {
  return new GraphQLError(error, {
    extensions: {
      code: "FORBIDDEN",
      myExtension: "foo",
    },
  });
};
