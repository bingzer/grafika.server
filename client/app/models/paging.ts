module GrafikaApp {
    export class Paging {
        isPublic: boolean;
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
            let query: string = '?uid=' + (("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4));
            if (this.userId) query+= '&userId=' + this.userId;

            if (typeof this.isPublic != 'undefined') {
                if (this.isPublic) query += '&isPublic=true';
                else query += '&isPublic=false';
            }
            if (this.category) query += '&category=' + this.category;
            if (this.sort) query += '&sort=' + this.sort;
            if (this.limit) query += '&limit=' + this.limit;
            if (this.skip) query += '&skip=' + this.skip;
            if (this.type) query += "&type=" + this.type;
            if (this.query) query += this.createSearchTerm(this.query);

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

        protected createSearchTerm(query: string): string{
            return "&name__regex=/" + this.query + "/g";
        }
    }
}