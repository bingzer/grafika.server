var GrafikaApp;
(function (GrafikaApp) {
    var Paging = (function () {
        function Paging(paging) {
            this.isPublic = true;
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
            var query = '?';
            if (this.userId)
                query += '&userId=' + this.userId;
            else
                query += '&isPublic=true';
            if (this.category)
                query += '&category=' + this.category;
            if (this.sort)
                query += '&sort=' + this.sort;
            if (this.limit)
                query += '&limit=' + this.limit;
            if (this.skip)
                query += '&skip=' + this.skip;
            if (this.query)
                query += "&query=" + this.query;
            if (this.type)
                query += "&type=" + this.type;
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
        return Paging;
    }());
    GrafikaApp.Paging = Paging;
})(GrafikaApp || (GrafikaApp = {}));
//# sourceMappingURL=paging.js.map