function Router(event, context, callback) {
    // critical parameters for routing
    // resource carries the template string of path. i.e. /part1/{path_param1}/part2/{path_param2}
    this.path = event.resource;
    // request method; GET, POST, PUT, DELETE
    this.method = event.httpMethod;
    // request context callback
    this.callback = callback;

    // Main route function 
    this.route = function (method, path, handler) {
        console.log(JSON.stringify(event))
        // calling the passed handler if the designated method and path matches the request
        if (this.method === method && this.path === path) {
            try {
                // event body is a string and shall be parsed to JSON unless the request is of type GET
                if (method !== 'GET') {
                    event.body = JSON.parse(event.body);
                }
                handler(event, context, callback);
            } catch (e) {
                console.log(e);
                this.callback(null, builResponse(500, "Data Error"));
            }
        }
    }
}

// Function to build and return the response
function builResponse(statusCode, body) {
    return {
        // Response status
        statusCode,
        // Response is of type string, so stringify
        body: JSON.stringify(body),
        // Handling cors. Change these as desired
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
}

module.exports = { Router, builResponse };
