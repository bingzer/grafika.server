"use strict";
var ensure = require('../libs/ensure');
var winston = require('winston');
var pkg = require('../../package.json');
var env = process.env;
var Setting = (function () {
    function Setting() {
        this.name = 'Grafika Web Server';
        this.version = pkg.version;
        this.server = new Server();
        this.client = new Client();
    }
    Setting.prototype.validate = function () {
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
    };
    Object.defineProperty(Setting.prototype, "$name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "$version", {
        get: function () {
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "$server", {
        get: function () {
            return this.server;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "$client", {
        get: function () {
            return this.client;
        },
        enumerable: true,
        configurable: true
    });
    return Setting;
}());
var Server = (function () {
    function Server() {
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
    Server.prototype.validate = function () {
        ensure.notNullOrEmpty(this.version, "version");
        ensure.notNullOrEmpty(this.url, "server_url");
        ensure.notNullOrEmpty(this.databaseUrl, "server_database_url");
        ensure.notNullOrEmpty(this.superSecret, "server_superSecret");
        ensure.notNullOrEmpty(this.mailService, "server_mailer_service");
        ensure.notNullOrEmpty(this.mailSmtp, "server_mailer_smtp");
        ensure.notNullOrEmpty(this.mailPort, "server_mailer_port");
        ensure.notNullOrEmpty(this.mailUser, "server_mailer_username");
        ensure.notNullOrEmpty(this.mailPassword, "server_mailer_from");
    };
    Object.defineProperty(Server.prototype, "$version", {
        get: function () {
            return this.version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$url", {
        get: function () {
            return this.url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$databaseUrl", {
        get: function () {
            return this.databaseUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$superSecret", {
        get: function () {
            return this.superSecret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailService", {
        get: function () {
            return this.mailService;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailSmtp", {
        get: function () {
            return this.mailSmtp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailPort", {
        get: function () {
            return this.mailPort;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailUser", {
        get: function () {
            return this.mailUser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailPassword", {
        get: function () {
            return this.mailPassword;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Server.prototype, "$mailFrom", {
        get: function () {
            return this.mailFrom;
        },
        enumerable: true,
        configurable: true
    });
    return Server;
}());
var Client = (function () {
    function Client() {
        this.sessionSecret = env.client_sessionSecret;
    }
    Client.prototype.validate = function () {
        ensure.notNullOrEmpty(this.sessionSecret, "client_sessionSecret");
    };
    Object.defineProperty(Client.prototype, "$sessionSecret", {
        get: function () {
            return this.sessionSecret;
        },
        enumerable: true,
        configurable: true
    });
    return Client;
}());
var setting = new Setting();
exports.setting = setting;
//# sourceMappingURL=config.js.map