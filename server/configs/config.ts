import * as winston from 'winston';
import * as q from 'q';

import ensure = require('../libs/ensure');

let pkg = require('../../package.json');
let env = process.env;

interface IConfig {
    validate() : void;
}

class Setting implements IConfig {
    private name: string;
    private version: string;
	private debug: boolean;

    private server: Server;
	private client: Client;
	private auth: Auth;

	constructor() {
		this.name = 'Grafika Web Server';
		this.version = pkg.version;
		this.debug = process.env.NODE_ENV !== 'production';
		this.server = new Server();
		this.client = new Client();
		this.auth = new Auth();
	}

	initialize(app): q.Promise<any> {
		let defer = q.defer();

		setTimeout(() => {
			try {
				this.validate();

				winston.info('Settings [OK]');
				defer.resolve();
			}
			catch (e) {
				winston.error('Settings [FAILED]');
				defer.reject(e);
			}
		}, 100);

		return defer.promise;
	}

    validate() : void {
		ensure.notNullOrEmpty(this.name);
		ensure.notNullOrEmpty(this.version);

		this.server.validate();
		this.client.validate();
		this.auth.validate();
    }

	public get $name(): string {
		return this.name;
	}

	public get $version(): string {
		return this.version;
	}

	public get $debug(): boolean {
		return this.debug;
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
	private awsUrl: string = 'https://s3.amazonaws.com/';
	private awsBucket: string;
	private awsId: string;
	private awsSecret: string;

	private googleId : string;
	private googleSecret: string;
	private googleScopes: [string];
	private googleCallbackUrl: string;

	private facebookId: string;
	private facebookSecret: string;
	private facebookCallbackUrl: string;
	private facebookScopes: [string];

	private disqusId: string;
	private disqusSecret: string;

	constructor() {
		this.awsBucket = env.auth_aws_bucket;
		this.awsId = env.auth_aws_id;
		this.awsSecret = env.auth_aws_secret;

		this.googleId = env.auth_google_id;
		this.googleSecret = env.auth_google_secret;
		this.googleCallbackUrl = env.server_url + 'api/accounts/google/callback';
		this.googleScopes = ['email'];

		this.facebookId = env.auth_fb_id;
		this.facebookSecret = env.auth_fb_secret;
		this.facebookCallbackUrl = env.server_url + 'api/accounts/facebook/callback';
		this.facebookScopes = ['email'];

		this.disqusId = env.auth_disqus_id;
		this.disqusSecret = env.auth_disqus_secret;
	}

    public validate() : void {
		ensure.notNullOrEmpty(this.awsBucket, "auth_aws_bucket");
		ensure.notNullOrEmpty(this.awsId, "auth_aws_id");
		ensure.notNullOrEmpty(this.awsSecret, "auth_aws_secret");

		ensure.notNullOrEmpty(this.googleId, "env.auth_google_id");
		ensure.notNullOrEmpty(this.googleSecret, "env.auth_google_secret");

		ensure.notNullOrEmpty(this.facebookId, "env.auth_fb_id");
		ensure.notNullOrEmpty(this.facebookSecret, "env.auth_fb_secret");

		ensure.notNullOrEmpty(this.disqusId, "env.auth_disqus_id");
		ensure.notNullOrEmpty(this.disqusSecret, "env.auth_disqus_secret");
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

	public get $googleId(): string {
		return this.googleId;
	}

	public get $googleSecret(): string {
		return this.googleSecret;
	}

	public get $googleScopes(): [string] {
		return this.googleScopes;
	}

	public get $googleCallbackUrl(): string {
		return this.googleCallbackUrl;
	}

	public get $facebookId(): string {
		return this.facebookId;
	}

	public get $facebookSecret(): string {
		return this.facebookSecret;
	}

	public get $facebookCallbackUrl(): string {
		return this.facebookCallbackUrl;
	}

	public get $facebookScopes(): [string] {
		return this.facebookScopes;
	}

	public get $disqusId(): string {
		return this.disqusId;
	}

	public get $disqusSecret(): string {
		return this.disqusSecret;
	}
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let setting = new Setting();
export { setting };