"use strict";
var winston = require('winston');
var q = require('q');
var ensure = require('../libs/ensure');
var pkg = require('../../package.json');
var env = process.env;
var Setting = (function () {
    function Setting() {
        this.name = 'Grafika Web Server';
        this.version = pkg.version;
        this.debug = process.env.NODE_ENV !== 'production';
        this.server = new Server();
        this.client = new Client();
        this.auth = new Auth();
        this.content = new Content();
    }
    Setting.prototype.initialize = function (app) {
        var _this = this;
        var defer = q.defer();
        setTimeout(function () {
            try {
                _this.validate();
                winston.info('Settings [OK]');
                defer.resolve();
            }
            catch (e) {
                winston.error('Settings [FAILED]');
                defer.reject(e);
            }
        }, 100);
        return defer.promise;
    };
    Setting.prototype.validate = function () {
        ensure.notNullOrEmpty(this.name);
        ensure.notNullOrEmpty(this.version);
        this.server.validate();
        this.client.validate();
        this.auth.validate();
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
    Object.defineProperty(Setting.prototype, "$debug", {
        get: function () {
            return this.debug;
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
    Object.defineProperty(Setting.prototype, "$auth", {
        get: function () {
            return this.auth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Setting.prototype, "$content", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    return Setting;
}());
var Content = (function () {
    function Content() {
        this.url = env.content_url;
    }
    Content.prototype.validate = function () {
        ensure.notNullOrEmpty(this.url, "content_url");
    };
    Object.defineProperty(Content.prototype, "$url", {
        get: function () {
            return this.url;
        },
        enumerable: true,
        configurable: true
    });
    return Content;
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
var Auth = (function () {
    function Auth() {
        this.awsUrl = 'https://s3.amazonaws.com/';
        this.awsBucket = env.auth_aws_bucket;
        this.awsId = env.auth_aws_id;
        this.awsSecret = env.auth_aws_secret;
        this.googleId = env.auth_google_id;
        this.googleSecret = env.auth_google_secret;
        this.googleCallbackUrl = env.server_url + 'accounts/google/callback';
        this.googleScopes = ['email'];
        this.facebookId = env.auth_fb_id;
        this.facebookSecret = env.auth_fb_secret;
        this.facebookCallbackUrl = env.server_url + 'accounts/facebook/callback';
        this.facebookScopes = ['email'];
        this.disqusId = env.auth_disqus_id;
        this.disqusSecret = env.auth_disqus_secret;
    }
    Auth.prototype.validate = function () {
        ensure.notNullOrEmpty(this.awsBucket, "auth_aws_bucket");
        ensure.notNullOrEmpty(this.awsFolder, "auth_aws_folder");
        ensure.notNullOrEmpty(this.awsId, "auth_aws_id");
        ensure.notNullOrEmpty(this.awsSecret, "auth_aws_secret");
        ensure.notNullOrEmpty(this.googleId, "env.auth_google_id");
        ensure.notNullOrEmpty(this.googleSecret, "env.auth_google_secret");
        ensure.notNullOrEmpty(this.facebookId, "env.auth_fb_id");
        ensure.notNullOrEmpty(this.facebookSecret, "env.auth_fb_secret");
        ensure.notNullOrEmpty(this.disqusId, "env.auth_disqus_id");
        ensure.notNullOrEmpty(this.disqusSecret, "env.auth_disqus_secret");
    };
    Object.defineProperty(Auth.prototype, "$awsUrl", {
        get: function () {
            return this.awsUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$awsBucket", {
        get: function () {
            return this.awsBucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$awsFolder", {
        get: function () {
            return this.awsFolder;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$awsId", {
        get: function () {
            return this.awsId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$awsSecret", {
        get: function () {
            return this.awsSecret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$googleId", {
        get: function () {
            return this.googleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$googleSecret", {
        get: function () {
            return this.googleSecret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$googleScopes", {
        get: function () {
            return this.googleScopes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$googleCallbackUrl", {
        get: function () {
            return this.googleCallbackUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$facebookId", {
        get: function () {
            return this.facebookId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$facebookSecret", {
        get: function () {
            return this.facebookSecret;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$facebookCallbackUrl", {
        get: function () {
            return this.facebookCallbackUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$facebookScopes", {
        get: function () {
            return this.facebookScopes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$disqusId", {
        get: function () {
            return this.disqusId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Auth.prototype, "$disqusSecret", {
        get: function () {
            return this.disqusSecret;
        },
        enumerable: true,
        configurable: true
    });
    return Auth;
}());
var setting = new Setting();
exports.setting = setting;
//# sourceMappingURL=config.js.map