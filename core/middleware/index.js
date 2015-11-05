var reactDocgen = require('react-docgen');
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
        var componentInfo = {};
        var error = false;
        var specPath = specUtils.getFullPathToSpec(req.path);
        var componentPath = path.join(specPath, 'src/index.jsx');
        var componentPathAlt = path.join(specPath, 'index.jsx');
        var componentPathExists = fs.existsSync(componentPath);
        var componentPathAltExists = fs.existsSync(componentPathAlt);
        var componentPathToUse;

        if (!(componentPathExists || componentPathAltExists)) {
            next();
            return;
        }

        if (req.specData.info.main && fs.existsSync(path.join(specPath, req.specData.info.main))) {
            componentPathToUse = path.join(specPath, req.specData.info.main);
        } else {
            componentPathToUse = fs.existsSync(componentPath) ? componentPath : componentPathAlt;
        }

        var componentContent = fs.readFileSync(componentPathToUse, 'utf-8');
        var propsTpl = fs.readFileSync(path.join(currentDir, '../templates/props.ejs'), 'utf-8');

        try {
            componentInfo = reactDocgen.parse(componentContent);
        } catch(e) {
            error = true;
            console.warn('sourcejs-react-docgen: error generating component doc', e);
        }

        req.specData.info.__docGenRaw = componentInfo;

        if (!error) {
            try {
                req.specData.info.__docGenHTML = ejs.render(propsTpl, componentInfo);
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