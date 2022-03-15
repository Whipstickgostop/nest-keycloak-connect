"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToken = exports.extractRequest = void 0;
const extractRequest = (context) => {
    var _a;
    let request, response;
    // Check if request is coming from graphql or http
    if (context.getType() === 'http') {
        // http request
        const httpContext = context.switchToHttp();
        request = httpContext.getRequest();
        response = httpContext.getResponse();
    }
    else if (context.getType() === 'graphql') {
        let gql;
        // Check if graphql is installed
        try {
            gql = require('@nestjs/graphql');
        }
        catch (er) {
            throw new Error('@nestjs/graphql is not installed, cannot proceed');
        }
        // graphql request
        const gqlContext = gql.GqlExecutionContext.create(context).getContext();
        request = gqlContext.req;
        response = gqlContext.res;
    }
    else if (context.getType() === 'ws') {
        const wsContext = context.switchToWs();
        const socket = wsContext.getClient();
        if (socket && socket.request) {
            // const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
            const wsRequest = socket.request;
            wsRequest.headers = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.headers;
            request = wsRequest;
            response = {};
        }
        else {
            throw new Error(`The express compatible 'request' was not found. Are you using 'ws'? Only Socket.IO platform is supported as native 'ws' cannot send headers.`);
        }
    }
    return [request, response, context.getType()];
};
exports.extractRequest = extractRequest;
const parseToken = (token) => {
    const parts = token.split('.');
    return JSON.parse(Buffer.from(parts[1], 'base64').toString());
};
exports.parseToken = parseToken;
