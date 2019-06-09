const {SchemaDirectiveVisitor} = require("graphql-tools");

const {DirectiveLocation,
    GraphQLDirective
} =  require("graphql");

const { createError } = require("apollo-errors");
const { IncomingMessage } = require("http");

const AuthorizationError = createError('AuthorizationError', {
    message: 'You are not authorized.'
});

const config = require("../config");

/*******************************************
This class provides the processing logic for the directive
requiresPersonalScope. For now the directive processes information
found in ../config.js. TokenOne does NOT have permission to access
fields marked with the directive, requiresPersonalScope.

Token one does have permission to access directives marked with
requiresPersonalScope.
 ********************************************/
class RequiresPersonalScope extends SchemaDirectiveVisitor {
    static getDirectiveDeclaration(directiveName, schema) {
        return new GraphQLDirective({
            name: "requiresPersonalScope",
            locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
        });
    }

    visitObject(obj) {
        const fields = obj.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const next = field.resolve;

            field.resolve = function(result, args, context, info) {
                isValidToken({ context }); // will throw error if not valid signed jwt
                return next(result, args, context, info);
            };
        });
    }

    visitFieldDefinition(field) {
        const next = field.resolve;

        field.resolve = function(result, args, context, info) {
            if(!isValidToken({ context })){
                result.email = 'You are not authorized to view personal information';
            }
            return result.email;
        };
    }
}

const isValidToken = ({ context }) => {
    const req = context instanceof IncomingMessage ? context : (context.req || context.request);

    if (
        !req ||
        !req.headers ||
        (!req.headers.authorization && !req.headers.Authorization)
    ) return false;

    const token = req.headers.authorization || req.headers.Authorization;
    return config.hasPersonalScope(token);
};

module.exports = RequiresPersonalScope;