import http from 'http'

interface StartInterface {
    port: number
    rateLimit?: number
}

export enum Method {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export type Endpoint = {
    method: Method
    path: string
    handler: (req: http.IncomingMessage, res: http.ServerResponse) => void
}

export default class Server {
    public endpoints: Endpoint[] = []
    public notFound: (
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ) => void
    public port: number
    public rateLimit: number
    public server: http.Server

    constructor({ port, rateLimit }: StartInterface) {
        this.port = port
        this.rateLimit = rateLimit || 1000
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res)
        })
    }

    private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        const matchingEndpoint = this.endpoints.find(
            (endpoint) =>
                endpoint.method.toString() === req.method &&
                req.url === endpoint.path,
        )

        if (matchingEndpoint) {
            matchingEndpoint.handler(req, res)
        } else {
            if (!this.notFound) {
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.end('Not Found')
                return
            }
            this.notFound(req, res)
        }
    }

    private registerEndpoint(
        path: string,
        handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
        method: Method,
    ) {
        const endpoint: Endpoint = {
            method: method,
            path: path,
            handler: handler,
        }

        this.endpoints.push(endpoint)
    }

    private registerHandler(
        path: string,
        handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
        method: Method,
    ) {
        this.registerEndpoint(path, handler, method)
    }

    private createMethod(method: Method) {
        return (
            path: string,
            handler: (
                req: http.IncomingMessage,
                res: http.ServerResponse,
            ) => void,
        ) => {
            this.registerHandler(path, handler, method)
        }
    }

    start(callback?: () => void) {
        this.server.listen(this.port)
        if (callback) {
            callback()
        }
    }

    get = this.createMethod(Method.GET)
    post = this.createMethod(Method.POST)
    put = this.createMethod(Method.PUT)
    delete = this.createMethod(Method.DELETE)
}
