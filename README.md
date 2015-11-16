# SourceJS Auto React Doc Builder Middleware

[react-docgen](https://github.com/reactjs/react-docgen) integration plugin, renders React components information into [SourceJS](http://sourcejs.com) Spec page.

Compatible with [SourceJS](http://sourcejs.com) 0.6.0+.

## Install

To install middleware, run npm command in `sourcejs/user` folder:

```
npm install sourcejs-react-docgen --save
```

After restarting your app, middleware will be loaded automatically. To disable it, remove npm module and restart the app.

## Usage

After installing the middleware, during SourceJS Spec load plugin will try to find first `<specPath>/*.jsx` file, analyze it and expose raw and rendered into HTML data objects. Data will be then available within [EJS Spec pre-rendering](http://sourcejs.com/docs/spec-helpers/#native-templating).

Insert these code snippets anywhere you want in your Spec file:

```html
<h1>My Spec</h1>

<section class="source_section">
    <h2>Default Example</h2>

    <p><%- info.__docGenRaw.description %></p>

    <%- info.__docGenHTML %>

    <div class="source_example"></div>
</section>
```

    # My Spec

    ## Default Example

    <%- info.__docGenRaw.description %>

    <%- info.__docGenHTML %>

    ```example
    code
    ```

Other custom Spec file syntax options like [sourcejs-react](https://github.com/szarouski/sourcejs-react) and [sourcejs-md-react](https://github.com/mik01aj/sourcejs-md-react) plugins are also supported.

Check usage examples in [react-styleguide-example](https://github.com/sourcejs/react-styleguide-example) and [react-styleguidist-example](https://github.com/sourcejs/react-styleguidist-example).

### EJS exposed data

* **info.__docGenRaw** - raw JSON from react-docgen
* **info.__docGenHTML** - rendered table with properties

## Configuration

Using Spec's `info.json` file, it's possible to define custom path to React component:

```
{
  "title": "React Spec",
  "main": "custom-relative-path/index.jsx"
}
```

Or overriding global plugin configuration:

```javascript
module.exports = {
	plugins: {
		reactDocgen: {
			componentPath: 'custom/path/index.jsx',
		}
	}
};
```

See other configuration options below.

### enabled

Default: true
Type: _boolean_


Set `false` to disable middleware.

### componentPath

Default: '*.jsx'
Type: _string_

Define custom path to component entry file. Accepts [glob](https://github.com/isaacs/node-glob) string, which will be resolved relatively to spec path (takes only first found file).

## TODO:

* Add auto-append option

Pull request highly welcome!

## Other SourceJS Middlewares

* https://github.com/sourcejs/sourcejs-jade
* https://github.com/sourcejs/sourcejs-smiles

To create own SourceJS Middleware, we recommend using the official generator - https://github.com/sourcejs/generator-sourcejs.