/**
 * we define what properties each object has here, and how
 * each object relates to another
 */

const axios = require('axios')
const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;
// const _ = require('lodash');

// const users = [
//     { id: '23', firstName: 'bill', age: 20 },
//     { id: '47', firstName: 'samantha', age: 21 }
// ];

/**
 * the `name` property below refers to the kind of object we're dealing with
 * 
 * the `fields` property refers to the kinds of things our object possesses,
 * and we have to tell GraphQL what *type* of thing each property is....
 */

const rootUrl = 'http://localhost:3000'

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        // we need to `resolve` because our User Model defines a companyId, but
        // here in the User Type we have a company
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data)
            }
        }
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
            /**
             * when `axios` returns a promise, the response is nested
             * under `data`, so we need to make our response point to it
             */
            resolve: (parentValue, args) =>
                axios.get(`${rootUrl}/users/${args.id}`)
                    .then(resp => resp.data)
        },
        company: {
            type: CompanyType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (parentValue, args) =>
                axios.get(`${rootUrl}/companies/${args.id}`)
                    .then(resp => resp.data)
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});