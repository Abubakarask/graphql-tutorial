import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { BookType, authors, books } from "./data";
import { AuthorType } from "./fieldTypes/authorType";

const app = express();

const RootQuery = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello,GraphQL!",
    },
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return books.find((book) => book.id === args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List Of Books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A Single Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of Authors",
      resolve: () => authors,
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a Book",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add a Author",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.listen(3000, () => {
  console.log("App Running on PORT 3000");
});
