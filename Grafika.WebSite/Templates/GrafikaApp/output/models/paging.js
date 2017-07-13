var GrafikaApp;
(function (GrafikaApp) {
    var Paging = (function () {
        function Paging(paging) {
            this.skip = 0;
            this.limit = 10;
            this.sort = 'views';
            if (!paging)
                return;
            this.isPublic = paging.isPublic;
            this.skip = paging.skip;
            this.limit = paging.limit;
            this.userId = paging.userId;
            this.category = paging.category;
            this.sort = paging.sort;
            this.term = paging.term;
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
            if (this.term)
                query += "&term=" + this.term;
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
//# sourceMappingURL=C:/Users/rtobings/GrafikaProject/grafika.server/Grafika.WebSite/Tempaltes/GrafikaApp/output/models/paging.js.map