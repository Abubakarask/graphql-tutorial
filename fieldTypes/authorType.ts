import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { BookType, books } from "../data";

export const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author of book",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: BookType,
      resolve: (author) => {
        return books.find((book) => author.id === book.authorId);
      },
    },
  },
});
