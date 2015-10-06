# SourceJS auto React doc builder middleware.

[react-docgen](https://github.com/reactjs/react-docgen) integration plugin, renders React components information into [SourceJS](http://sourcejs.com) Spec page. 

Compatible with [SourceJS](http://sourcejs.com) 0.6.0+.

## Install

To install middleware, run npm command in `sourcejs/user` folder:

```
npm install sourcejs-react-docgen --save
```

After restarting your app, middleware will be loaded automatically. To disable it, remove npm module and restart the app.

## Usage

After installing the middleware, during spec load, plugin will try to find `<specPath>/index.jsx` or `<specPath>/src/index.jsx` file, analyze it and expose raw and rendered data objects. Data will be then available within [EJS Spec pre-rendering](http://sourcejs.com/docs/spec-helpers/#native-templating) (enabled by default).

Insert these code snippets anywhere you want in your Spec file

```html
<h1>My Spec</h1>

<section class="source_section">
    <h2>Default Example</h2>
    
    <p><%- info.__docGenRaw.description %></p>

    <%- info.__docGenHTML %>

    <div class="source_example"></div>
</section>
```

Other custom Spec file syntax with [sourcejs-react](https://github.com/szarouski/sourcejs-react) and [sourcejs-md-react](https://github.com/mik01aj/sourcejs-md-react) plugins is also supported. 

Check usage examples in [react-styleguide-example](https://github.com/sourcejs/react-styleguide-example).

### Exposed Data

* **info.__docGenRaw** - raw JSON from react-docgen
* **info.__docGenHTML** - rendered table with properties

## TODO

* Add more configuration options

## Other SourceJS Middlewares

* https://github.com/sourcejs/sourcejs-jade
* https://github.com/sourcejs/sourcejs-smiles

To create own SourceJS Middleware, we recommend using the official generator - https://github.com/sourcejs/generator-sourcejs.