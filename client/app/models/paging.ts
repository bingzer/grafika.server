module GrafikaApp {
    export class Paging {
        isPublic: boolean = true;
        skip: number = 0;
        limit: number = 25;

        userId: string;
        category: string;
        sort: string = 'views';
        query: string;
        type: string;

        constructor(paging?: Paging | any) {
            if (!paging) return;
            this.isPublic = paging.isPublic;
            this.skip = paging.skip;
            this.limit = paging.limit;
            this.userId = paging.userId;
            this.category = paging.category;
            this.sort = paging.sort;
            this.query = paging.query;
            this.type = paging.type;
        }

        toQueryString(): string {
            var query: string = '?';
            if (this.userId) query+= '&userId=' + this.userId;
            else query += '&isPublic=true';

            if (this.category) query += '&category=' + this.category;
            if (this.sort) query += '&sort=' + this.sort;
            if (this.limit) query += '&limit=' + this.limit;
            if (this.skip) query += '&skip=' + this.skip;
            if (this.query) query += "&query=" + this.query;
            if (this.type) query += "&type=" + this.type;

            return query;
        }

        next(): Paging {
            this.skip += this.limit;
            return new Paging(this);
        }

        previous(): Paging {
            if (this.skip - this.limit <= 0)
                this.skip = 0;
            else this.skip -= this.limit;
            
            return new Paging(this);
        }
    }
}