module.exports = {
    route: null
    , page: null
    , brand: null
    , title: function(routeTitle, pageTitle) {
        return `${routeTitle}${this.page ? ' - ' : ''}${this.page ? this.page : ''}`;
    }
    , lowerRoute: function() {
        if(this.route)
            return this.route.toLowerCase();
        else
            return "";
    }
}