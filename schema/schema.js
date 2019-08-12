/**
 * we define what properties each object has here, and how
 * each object relates to another
 */

const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;
const _ = require('lodash');

const users = [
    { id: '23', firstName: 'bill', age: 20 },
    { id: '47', firstName: 'samantha', age: 21 }
];

/**
 * the `name` property below refers to the kind of object we're dealing with
 * 
 * the `fields` property refers to the kinds of things our object possesses,
 * and we have to tell GraphQL what *type* of thing each property is....
 */

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

/**
 * if you're looking for a user, supply an id (`args[id]`)
 * 
 * `resolve` function specifies how we're gunna actually get the data we're
 * looking for.
 */
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLString }
            },
            resolve (parentValue, args) {
                return _.find(users, { id: args.id })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});