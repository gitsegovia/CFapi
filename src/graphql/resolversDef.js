import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers } from "@graphql-tools/merge";

const resolversArray = loadFilesSync(path.join(__dirname, "./resolvers"), {
  extensions: ["js"],
});

export const resolvers = mergeResolvers(resolversArray);
