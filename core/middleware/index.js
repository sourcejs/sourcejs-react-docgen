var reactDocs = require('react-docgen');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var specUtils = require(path.join(global.pathToApp,'core/lib/specUtils'));
var currentDir = path.dirname(__filename);

// Module configuration
var globalConfig = global.opts.plugins && global.opts.plugins.reactDocgen ? global.opts.plugins.reactDocgen : {};
var config = {
    enabled: true,

    // Public object is exposed to Front-end via options API.
    public: {}
};

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
        var specPath = specUtils.getFullPathToSpec(req.path);
        var componentPath = path.join(specPath, 'src/index.jsx');
        var componentPathAlt = path.join(specPath, 'index.jsx');
        var componentPathExists = fs.existsSync(componentPath);
        var componentPathAltExists = fs.existsSync(componentPathAlt);

        if (!(componentPathExists || componentPathAltExists)) {
            next();
            return;
        }

        var componentPathToUse = componentPath ? componentPath : componentPathAlt;
        var componentContent = fs.readFileSync(componentPathToUse, 'utf-8');
        var propsTpl = fs.readFileSync(path.join(currentDir, '../templates/props.ejs'), 'utf-8');

        var componentInfo = reactDocs.parse(componentContent);

        req.specData.info.__docGenRaw = componentInfo;

        try {
            req.specData.info.__docGenHTML = ejs.render(propsTpl, componentInfo);
        } catch(e) {
            console.log('error rendering docgen props', e);
        }

        next();
    } else {
        next();
    }
};

exports.process = processRequest;