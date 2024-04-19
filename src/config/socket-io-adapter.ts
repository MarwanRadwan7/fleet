import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from 'src/common/types';

// This class will help in importing the ports and host
// of the React Client dynamically to things like CORS
export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(PORT: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    // CORS configuration
    const cors = {
      origin: [
        `localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO Server with Custom CORS options', {
      cors,
    });

    const optionsWithCors: ServerOptions = {
      ...options,
      cors,
    };

    const jwtService = this.app.get(JwtService);

    const server: Server = super.createIOServer(PORT, optionsWithCors);

    // Attach the namespaces here of the gateways
    server.of('chat').use(createTokenMiddleware(jwtService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) => async (socket: SocketWithAuth, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug('Validating Auth Token before connection');

    try {
      const payload = await jwtService.verifyAsync(token);

      socket.userID = payload.user_id;
      socket.username = payload.sub.username;
      socket.email = payload.email;
      socket.role = payload.role;

      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
