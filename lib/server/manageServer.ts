import http from 'http';

interface startInterface {
    port: number
    rateLimit?: number // Per 15 minutes
}

class Server {
  private server: http.Server;

  constructor() {
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    // Handle incoming HTTP requests here.
    // You can define your own routing and request handling logic.

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
  }

  public start(data: startInterface) {
    if(!data.port) {
      throw new Error('No port specified');
    }

    this.server.listen(data.port);
  }
}

export { Server };
