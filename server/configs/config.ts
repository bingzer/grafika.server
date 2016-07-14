import ensure = require('../libs/ensure');
import * as winston from 'winston';
let pkg = require('../../package.json');
let env = process.env;

interface IConfig {
    validate() : void;
}

class Setting implements IConfig {
    private name: string;
    private version: string;

    private server: Server;
	private client: Client;

	constructor() {
		this.name = 'Grafika Web Server';
		this.version = pkg.version;
		this.server = new Server();
		this.client = new Client();
	}

    public validate() : void {
		try {
			ensure.notNullOrEmpty(this.name);
			ensure.notNullOrEmpty(this.version);

			this.server.validate();
			this.client.validate();

			winston.info('Settings [OK]');
		}
		catch (e) {
			winston.error('Settings [FAILED]');
			winston.error(e);
		}
    }

	public get $name(): string {
		return this.name;
	}

	public get $version(): string {
		return this.version;
	}

	public get $server(): Server {
		return this.server;
	}

	public get $client(): Client {
		return this.client;
	}

}

/**
 * The server configuration
 */
class Server implements IConfig {
    private version: string;
    private url: string;
    private databaseUrl: string;
    private superSecret: string;
    private mailService: string;
    private mailSmtp: string;
    private mailPort: string;
    private mailUser: string;
    private mailPassword: string;
    private mailFrom: string;

    constructor() {
        this.version = pkg.version;
        this.url = env.server_url;
        this.databaseUrl = env.server_database_url;
        this.superSecret = env.server_superSecret;
        this.mailService = env.server_mailer_service;
        this.mailSmtp = env.server_mailer_smtp;
        this.mailPort = env.server_mailer_port;
        this.mailUser = env.server_mailer_user;
        this.mailPassword = env.server_mailer_password;
        this.mailFrom = env.server_mailer_from;
    }

    public validate() : void {
		ensure.notNullOrEmpty(this.version, "version");
		ensure.notNullOrEmpty(this.url, "server_url");
		ensure.notNullOrEmpty(this.databaseUrl, "server_database_url");
		ensure.notNullOrEmpty(this.superSecret, "server_superSecret");
		ensure.notNullOrEmpty(this.mailService, "server_mailer_service");
    }

	public get $version(): string {
		return this.version;
	}
    

	public get $url(): string {
		return this.url;
	}

	public get $databaseUrl(): string {
		return this.databaseUrl;
	}

	public get $superSecret(): string {
		return this.superSecret;
	}

	public get $mailService(): string {
		return this.mailService;
	}

	public get $mailSmtp(): string {
		return this.mailSmtp;
	}

	public get $mailPort(): string {
		return this.mailPort;
	}

	public get $mailUser(): string {
		return this.mailUser;
	}

	public get $mailPassword(): string {
		return this.mailPassword;
	}

	public get $mailFrom(): string {
		return this.mailFrom;
	}	
	
}

/**
 * Client configuration
 */
class Client implements IConfig {
	private sessionSecret: string;

	constructor() {
		this.sessionSecret = env.client_sessionSecret;
	}

    public validate() : void {
		ensure.notNullOrEmpty(this.sessionSecret, "client_sessionSecret");
    }

	public get $sessionSecret(): string {
		return this.sessionSecret;
	}
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let setting = new Setting();
export { setting };