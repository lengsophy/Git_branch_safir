Meteor.methods({
    proSiteMap: function() {
        var html = '';
        var pro = products.find({});
        pro.forEach(function(pr) {
            var title = pr.title;
            title = title.replace(/\-/g, "(minus)");
            title = title.replace(/\s/g, "-");
            title = title.replace(/\%/g, "(percentag)");
            title = title.replace(/\+/g, "(plush)");
            title = title.replace(/\ô/g, "(ocir)");
            title = title.replace(/\®/g, "(copyright)");
            title = title.replace(/\°/g, "(number)");
            title = title.replace(/\Ô/g, "(bigocir)");
            title = title.replace(/\²/g, "(square)");
            title = title.replace(/\`/g, "(accentaigu)");
            title = title.replace(/\é/g, "(eaccentaigu)");
            title = title.replace(/\É/g, "(bigeaccentaigu)");
            title = title.replace(/\&/g, "(and)");
            title = title.replace(/\//g, "(slash)");
            title = title.replace(/\’/g, "(apostrophe)");
            title = title.replace(/\'/g, "(quote)");
            title = title.replace(/\!/g, "(warning)");
            title = title.replace(/\?/g, "(question)");
            title = title.replace(/\$/g, "(dolla)");
            title = title.replace(/\è/g, "(eaccentgrave)");
            title = title.replace(/\–/g, "(hyphen)");
            // title = title.toLowerCase();
            var url = 'details/' + title;
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + url + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n' + '</url>' + '\n';
        });
        var strhtml = '';
        strhtml += '<?xml version="1.0" encoding="UTF-8"?>' + '\n';
        strhtml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"  xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + '\n';
        strhtml += html;
        strhtml += '</urlset>';
        // console.log(Meteor.absoluteUrl());
        fs = Npm.require('fs');
        fullpath = "public";
        if (Meteor.isServer) {
            fullpath = process.env.PWD;
            if (typeof fullpath == 'undefined') {
                base_path = Meteor.npmRequire('fs').realpathSync(process.cwd() + '../../../../../../');
            } else {
                base_path = fullpath;
            }
        } else {
            base_path = "/";
        }
        fs.writeFile(base_path + "/public/sitemap-products.xml", strhtml,
            function(err) {}
        );
    },
    catSiteMap: function() {
        var html = '';
        var catSiteMap = categories.find({});
        catSiteMap.forEach(function(sm) {
            var title = sm.title;
            title = title.replace(/\s/g, "-");
            var url = 'category/' + title;
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + url + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n' + '</url>' + '\n';
        });
        var arrTuto = [];
        var tutoListSiteMap = categories.find({ "parent": " " });
        tutoListSiteMap.forEach(function(ttsm) {
            arrTuto.push(ttsm._id);
            var title = ttsm.title;
            title = title.replace(/\s/g, "-");
            var url = 'tutolisting/' + title;
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + url + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n' + '</url>' + '\n';
        });
        var content = contents.find({ category: { $in: arrTuto } });
        content.forEach(function(csm) {
            var title = csm.title;
            title = title.replace(/\s/g, "-");
            var url = 'tutodetails/' + title;
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + url + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n' + '</url>' + '\n';
        });
        var arrWebz = [];
        var type = contents_type.find({ "type": "Webzine" });
        type.forEach(function(ct) {
            arrWebz.push(ct._id);
        });
        var arrWebContent = [];
        var webContent = contents.find({ "typeid": { $in: arrWebz } });
        webContent.forEach(function(wc) {
            var title = wc.title;
            title = title.replace(/\s/g, "-");
            var url = 'webzinedetails/' + title;
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + url + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + url+'"/>'+'\n' + '</url>' + '\n';
        });

        var arrSM = [
            { page: 'login' },
            { page: 'tuto' },
            { page: 'member' },
            { page: 'favorite' },
            { page: 'checkout' },
            { page: 'quiz' },
            { page: 'editprofile' },
            { page: 'webzinelisting' },
            { page: 'reward' },
            { page: 'profile' },
            { page: 'linkselling' },
            { page: 'ResetPassword' },
            { page: 'ForgotPassword' },
            // https://support.google.com/webmasters/answer/178636?hl=en
            { page: '' }
        ];
        for (var i = 0; i < arrSM.length; i++) {
            html += '<url>' + '\n\t' + '<loc>' + Meteor.absoluteUrl() + arrSM[i].page + '</loc>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="en" href="'+Meteor.absoluteUrl() + arrSM[i].page +'"/>'+'\n\t' +'<xhtml:link rel="alternate" hreflang="fr-IR" href="'+Meteor.absoluteUrl() + arrSM[i].page +'"/>'+'\n' + '</url>' + '\n';
        };

        var strhtml = '';
        strhtml += '<?xml version="1.0" encoding="UTF-8"?>' + '\n';
        strhtml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' + '\n';
        strhtml += html;
        strhtml += '</urlset>';

        // console.log(Meteor.absoluteUrl());
        fs = Npm.require('fs');
        fullpath = "public";
        if (Meteor.isServer) {
            fullpath = process.env.PWD;
            if (typeof fullpath == 'undefined') {
                base_path = Meteor.npmRequire('fs').realpathSync(process.cwd() + '../../../../../../');
            } else {
                base_path = fullpath;
            }
        } else {
            base_path = "/";
        }
        fs.writeFile(base_path + "/public/sitemap-contents.xml", strhtml,
            function(err) {}
        );
        var robot = 'User-agent: *' + '\n';
        robot += 'Disallow:' + '\n';
        robot += 'Sitemap:' + Meteor.absoluteUrl() + 'sitemap.xml';
        fs.writeFile(base_path + "/public/robots.txt", robot,
            function(err) {
                if (err) throw err;
            }
        );
    }
});
