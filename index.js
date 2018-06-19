var url = require('url');
var sm = require('sitemap');

var urls = [];

module.exports = {
    hooks: {
        // Index page
        "page": function(page) {
            if (this.output.name != 'website') return page;

            var lang = this.isLanguageBook()? this.language : '';
            if (lang) lang = lang + '/';

            urls.push({
                url: this.output.toURL(lang + page.path)
            });

            return page;
        },

        // Write sitemap.xml
        "finish": function() {
            var hostname = url.resolve(this.config.get('pluginsConfig.sitemap.hostname'), '/');
            var path = this.config.get('pluginsConfig.sitemap.path') || '';
            var sitemap = sm.createSitemap({
                cacheTime: 600000,
                hostname: hostname + path,
                urls: [{ url: '/' }].concat(urls.slice(1))
            });

            var xml = sitemap.toString();

            return this.output.writeFile('sitemap.xml', xml);
        }
    }
};
