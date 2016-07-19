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
	private auth: Auth;

	constructor() {
		this.name = 'Grafika Web Server';
		this.version = pkg.version;
		this.server = new Server();
		this.client = new Client();
		this.auth = new Auth();
	}

    public validate() : void {
		try {
			ensure.notNullOrEmpty(this.name);
			ensure.notNullOrEmpty(this.version);

			this.server.validate();
			this.client.validate();
			this.auth.validate();

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

	public get $auth(): Auth {
		return this.auth;
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
		ensure.notNullOrEmpty(this.mailSmtp, "server_mailer_smtp");
		ensure.notNullOrEmpty(this.mailPort, "server_mailer_port");
		ensure.notNullOrEmpty(this.mailUser, "server_mailer_username");
		ensure.notNullOrEmpty(this.mailPassword, "server_mailer_from");
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

/**
 * Auth configuration
 */
class Auth implements IConfig {
	// private googleId : string;
	// private googleSecret: string;
	// private googleScopes: [string];
	// private googleCallbackUrl: string;

	// private facebookId: string;
	// private facebookSecret: string;
	// private facebookCallbackUrl: string;
	// private facebookScopes: [string];
	// private enableProof: boolean;

	// private disqusSecret: string;
	// private disqusPublic: string;

	private awsUrl: string = 'https://s3.amazonaws.com/';
	private awsBucket: string;
	private awsId: string;
	private awsSecret: string;

	constructor() {
		this.awsBucket = env.auth_aws_bucket;
		this.awsId = env.auth_aws_id;
		this.awsSecret = env.auth_aws_secret;
	}

    public validate() : void {
		ensure.notNullOrEmpty(this.awsBucket, "auth_aws_bucket");
		ensure.notNullOrEmpty(this.awsId, "auth_aws_id");
		ensure.notNullOrEmpty(this.awsSecret, "auth_aws_secret");
    }

	public get $awsUrl(): string  {
		return this.awsUrl;
	}

	public get $awsBucket(): string {
		return this.awsBucket;
	}

	public get $awsId(): string {
		return this.awsId;
	}

	public get $awsSecret(): string {
		return this.awsSecret;
	}
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let setting = new Setting();
export { setting };