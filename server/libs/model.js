var mongoose = require('mongoose'), _ = require('underscore'), Model = mongoose.Model, handlers = require('./handlers');
exports = module.exports = model;
var methods = ['get', 'post', 'put', 'delete'], endpoints = ['get', 'post', 'put', 'delete', 'getDetail'], defaultroutes = ['schema'], lookup = {
    'get': 'index',
    'getDetail': 'show',
    'put': 'updated',
    'post': 'created',
    'delete': 'deleted'
}, valid_alterables = filterable({
    'populate': query('populate'),
}, {}), valid_filters = filterable({
    'limit': query('limit'),
    'skip': query('skip'),
    'offset': query('offset'),
    'select': query('select'),
    'sort': query('sort'),
}, {
    'equals': query('equals'),
    'gte': query('gte'),
    'gt': query('gt'),
    'lt': query('lt'),
    'lte': query('lte'),
    'ne': query('ne'),
    'regex': function (val, query) {
        var regParts = val.match(/^\/(.*?)\/([gim]*)$/);
        if (regParts) {
            val = new RegExp(regParts[1], regParts[2]);
        }
        else {
            val = new RegExp(val);
        }
        return query.regex(val);
    },
    'in': query('in'),
    'nin': query('nin'),
}), defaults = function () {
    return {
        routes: {},
        allowed_methods: {
            get: { detail: false }
        },
        update_options: {},
        remove_options: {},
        templateRoot: '',
        shouldIncludeSchema: true,
        shouldUseAtomicUpdate: false
    };
};
function model() {
    var result = mongoose.model.apply(mongoose, arguments), default_properties = defaults();
    if (1 === arguments.length)
        return result;
    for (var key in default_properties) {
        result[key] = default_properties[key];
    }
    return result;
}
Model.includeSchema = function (shouldIncludeSchema) {
    this.shouldIncludeSchema = shouldIncludeSchema;
    return this;
};
Model.methods = function (newmethods) {
    var self = this, get = contains(newmethods, 'get');
    methods.forEach(function (method) {
        delete self.routes[method];
    });
    this.allowed_methods = [];
    if (!Array.isArray(newmethods)) {
        newmethods = [newmethods];
    }
    if (get && !contains(newmethods, 'getDetail')) {
        newmethods.push({
            method: 'getDetail',
            before: (typeof get !== 'string') ? get.before : null,
            after: (typeof get !== 'string') ? get.after : null
        });
    }
    newmethods.forEach(function (meth) {
        var method = meth.method;
        if ('string' === typeof meth) {
            method = meth;
            meth = {};
        }
        if (!method)
            throw new Error("Method object must have a method property");
        self.allowed_methods.push(method);
        meth.handler = handlers[method];
        meth.detail = (method !== 'get' && method !== 'post');
        self.route(method, meth);
    });
    return this;
};
Model.updateOptions = function (options) {
    this['update_options'] = options;
    return this;
};
Model.removeOptions = function (options) {
    this['remove_options'] = options;
    return this;
};
Model.template = function (templatePath) {
    if (templatePath.substr(-1) == '/') {
        templatePath = templatePath.substr(0, templatePath.length - 1);
    }
    this.templateRoot = templatePath;
    return this;
};
Model.addDefaultRoutes = function () {
    if (this.shouldIncludeSchema) {
        this.route('schema', handlers.schema);
    }
    this.addSchemaRoutes();
};
Model.addSchemaRoutes = function () {
    var self = this;
    this.schema.eachPath(function (pathName, schemaType) {
        if (pathName.indexOf('_id') === -1 && schemaType.instance === 'ObjectID') {
            ['get'].forEach(function (method) {
                self.route(pathName, method, {
                    handler: handlers[method + 'Path'].call(self, pathName),
                    detail: true
                });
            });
        }
    });
};
Model.route = function (path, method, fn) {
    var route = getRoute(this.routes, path), meths = methods, lastPath = path.substr(path.lastIndexOf('.') + 1);
    if (2 === arguments.length) {
        fn = method;
        if (!fn.methods && endpoints.indexOf(lastPath) > -1) {
            meths = [lastPath];
        }
        else if (fn.methods) {
            meths = fn.methods;
        }
    }
    else {
        meths = [method];
    }
    if (fn) {
        fn = normalizeHandler(fn);
        meths.forEach(function (meth) {
            route[meth] = merge(route[meth], fn);
        });
    }
    return this;
};
Model.before = function (path, method, fn) {
    if (2 == arguments.length) {
        arguments[1] = { before: arguments[1] };
    }
    return this.route.apply(this, arguments);
};
Model.after = function (path, method, fn) {
    if (2 == arguments.length) {
        arguments[1] = { after: arguments[1] };
    }
    return this.route.apply(this, arguments);
};
Model.registerRoutes = function (app, prefix, path, routeObj) {
    var self = this;
    for (var key in routeObj) {
        if (isEndpoint(routeObj, key)) {
            var route = routeObj[key];
            var routehandlers = _.isArray(route.handler) ? route.handler : [route.handler];
            routehandlers = _.map(routehandlers, function (handler) { return handler.bind(self); });
            var detailGet = !route.detail && !path && key === 'get', handlerlist = route.before.concat([preprocess.bind(self)], routehandlers, route.after, [handlers.last]);
            if (route.detail) {
                app[key](prefix + '/:id([0-9a-fA-F]{0,24})' + path, handlerlist);
            }
            else if (detailGet) {
                app[key](prefix + '/:id([0-9a-fA-F]{0,24}$)?', handlerlist);
            }
            else {
                app[key](prefix + path, handlerlist);
            }
        }
        else {
            this.registerRoutes(app, prefix, path + '/' + key, routeObj[key]);
        }
    }
};
Model.register = function (app, url) {
    this.addDefaultRoutes();
    app.getDetail = app.get;
    this.registerRoutes(app, url, '', this.routes);
};
Model.filter = function (req, quer) {
    var detail = false;
    if (req.params.id) {
        quer = this.findById(req.params.id);
        detail = true;
    }
    [req.body, req.query, req.headers].forEach(function (alterableResponse) {
        Object.keys(alterableResponse).filter(function (potential) {
            return valid_alterables.contains(potential, quer);
        }).forEach(function (valid_key) {
            quer = valid_alterables.filter(valid_key, alterableResponse[valid_key], quer);
        });
    });
    if (!detail) {
        [req.body, req.query, req.headers].forEach(function (filterableData) {
            Object.keys(filterableData).filter(function (potential_filter) {
                return valid_filters.contains(potential_filter, quer);
            }).forEach(function (valid_key) {
                quer = valid_filters.filter(valid_key, filterableData[valid_key], quer);
            });
        });
    }
    return quer;
};
function preprocess(req, res, next) {
    req.body = req.body || {};
    req.query = req.query || {};
    req.quer = this.filter(req, this.find({}));
    if (!('locals' in res)) {
        res.locals = {};
    }
    res.locals.bundle = {};
    req.templatePath = resolveTemplate(req);
    next();
}
function query(key) {
    return function (val, query) {
        return query[key](val);
    };
}
function haveOneModel(req) {
    return !!req.params.id;
}
function resolveTemplate(req) {
    var method = req.method.toLowerCase(), tmplName;
    if (methods.indexOf(method) > -1) {
        if (haveOneModel(req) && method === 'get') {
            method += 'Detail';
        }
        tmplName = lookup[method];
    }
    return tmplName;
}
function merge(route, fn) {
    if (!route)
        return fn;
    route.before = route.before.concat(fn.before);
    route.handler = fn.handler || route.handler;
    route.after = fn.after.concat(route.after);
    return route;
}
function getRoute(routes, path) {
    path = path.replace(/\//g, /\./).split(/\./);
    if (1 === path.length && '' === path[0]) {
        path = [];
    }
    if (endpoints.indexOf(path[path.length - 1]) > -1) {
        path.splice(path.length - 1, 1);
    }
    path.forEach(function (sub, i) {
        if (!routes[sub])
            routes[sub] = {};
        routes = routes[sub];
    });
    return routes;
}
function normalizeHandler(fn) {
    var result = {};
    result.handler = fn.handler;
    result.detail = fn.detail;
    if ({}.toString.call(fn) == '[object Function]') {
        result = {
            handler: fn
        };
    }
    ['before', 'after'].forEach(function (hook) {
        result[hook] = fn[hook] || [];
        if (!Array.isArray(result[hook])) {
            result[hook] = [result[hook]];
        }
    });
    return result;
}
function isEndpoint(route, method) {
    return endpoints.indexOf(method) > -1 && route[method].handler;
}
function contains(arr, key) {
    if (arr.indexOf(key) > -1)
        return true;
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        if (obj.method === key)
            return true;
    }
    return false;
}
;
function coerceData(filter_func, data) {
    if (data && data.toLowerCase && data.toLowerCase() === 'true') {
        return true;
    }
    else if (data && data.toLowerCase && data.toLowerCase() === 'false') {
        return false;
    }
    else if (filter_func === 'limit' || filter_func === 'skip') {
        return parseInt(data);
    }
    return data;
}
;
function filterable(props, subfilters) {
    return {
        filter: function (key, val, quer) {
            if (props[key]) {
                return props[key](coerceData(key, val), quer);
            }
            var field = key.split('__'), filter_func = field[1] || 'equals', data = coerceData(filter_func, val);
            if (filter_func === 'in' || filter_func === 'nin') {
                data = data.split(',');
            }
            return subfilters[filter_func](data, quer.where(field[0]));
        },
        contains: function (key, quer) {
            if (key in props)
                return true;
            var field = key.split('__');
            var filter_func = field[1] || 'equals';
            return field[0] in quer.model.schema.paths && filter_func in subfilters;
        }
    };
}
//# sourceMappingURL=model.js.map