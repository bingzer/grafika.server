var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GrafikaApp;
(function (GrafikaApp) {
    var Paging = (function () {
        function Paging(paging) {
            this.skip = 0;
            this.limit = 25;
            this.sort = 'views';
            if (!paging)
                return;
            this.isPublic = paging.isPublic;
            this.skip = paging.skip;
            this.limit = paging.limit;
            this.userId = paging.userId;
            this.category = paging.category;
            this.sort = paging.sort;
            this.query = paging.query;
            this.type = paging.type;
        }
        Paging.prototype.toQueryString = function () {
            var query = '?uid=' + (("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4));
            if (this.userId)
                query += '&userId=' + this.userId;
            if (typeof this.isPublic != 'undefined') {
                if (this.isPublic)
                    query += '&isPublic=true';
                else
                    query += '&isPublic=false';
            }
            if (this.category)
                query += '&category=' + this.category;
            if (this.sort)
                query += '&sort=' + this.sort;
            if (this.limit)
                query += '&limit=' + this.limit;
            if (this.skip)
                query += '&skip=' + this.skip;
            if (this.type)
                query += "&type=" + this.type;
            if (this.query)
                query += this.createSearchTerm(this.query);
            return query;
        };
        Paging.prototype.next = function () {
            this.skip += this.limit;
            return new Paging(this);
        };
        Paging.prototype.previous = function () {
            if (this.skip - this.limit <= 0)
                this.skip = 0;
            else
                this.skip -= this.limit;
            return new Paging(this);
        };
        Paging.prototype.createSearchTerm = function (query) {
            return "&name__regex=/" + this.query + "/g";
        };
        return Paging;
    }());
    GrafikaApp.Paging = Paging;
    var QueryablePaging = (function (_super) {
        __extends(QueryablePaging, _super);
        function QueryablePaging() {
            _super.apply(this, arguments);
        }
        QueryablePaging.prototype.createSearchTerm = function (query) {
            return '&term=' + query;
        };
        return QueryablePaging;
    }(Paging));
    GrafikaApp.QueryablePaging = QueryablePaging;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=paging.js.map