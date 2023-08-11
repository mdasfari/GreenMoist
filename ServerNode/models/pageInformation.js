module.exports = {
    route: null
    , page: null
    , brand: null
    , title: function() {
        return `${this.route}${this.page ? ' - ' : ''}${this.page ? this.page : ''}`;
    }
}