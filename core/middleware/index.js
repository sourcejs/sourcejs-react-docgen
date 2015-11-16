var reactDocgen = require('react-docgen');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var glob = require("glob");
var specUtils = require(path.join(global.pathToApp,'core/lib/specUtils'));
var currentDir = path.dirname(__filename);
var sourceJSUtils = require(path.join(global.pathToApp, 'core/lib/utils'));

// Module configuration
var globalConfig = global.opts.plugins && global.opts.plugins.reactDocgen ? global.opts.plugins.reactDocgen : {};
var config = {
    enabled: true,
    componentPath: '*.jsx',

    // Public object is exposed to Front-end via options API.
    public: {}
};
sourceJSUtils.extendOptions(config, globalConfig);

/*
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - The callback function
 * */
var processRequest = function (req, res, next) {
    if (!config.enabled) {
        next();
        return;
    }

    // Check if request is targeting Spec
    if (req.specData && req.specData.renderedHtml) {
        var componentDocs = {};
        var error = false;
        var specPath = specUtils.getFullPathToSpec(req.path);
        var componentPathToUse = req.specData.info.main || config.componentPath;

        var componentFilePath = glob.sync(componentPathToUse, {
            cwd: specPath,
            realpath: true
        })[0];

        if (!fs.existsSync(componentFilePath)) {
            next();
            return;
        }

        var componentContent = fs.readFileSync(componentFilePath, 'utf-8');
        var propsTpl = fs.readFileSync(path.join(currentDir, '../templates/props.ejs'), 'utf-8');

        try {
            componentDocs = reactDocgen.parse(componentContent);
        } catch(e) {
            error = true;
            console.warn('sourcejs-react-docgen: error generating component doc', e);
        }

        req.specData.info.__docGenRaw = componentDocs;

        if (!error) {
            try {
                req.specData.info.__docGenHTML = ejs.render(propsTpl, componentDocs);
            } catch(e) {
                console.warn('sourcejs-react-docgen: error rendering docgen props', e);
            }
        } else {
            req.specData.info.__docGenHTML = 'Error preparing react-docgen.'
        }

        next();
    } else {
        next();
    }
};

exports.process = processRequest;