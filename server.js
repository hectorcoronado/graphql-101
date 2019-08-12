const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

/**
 * whenever a request comes in for a `graphql` route, we use `expressGraphQL`
 * 
 * `graphiql` is a dev tool, which allows us to make req's against our dev server
 */
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log(`listening`)
});