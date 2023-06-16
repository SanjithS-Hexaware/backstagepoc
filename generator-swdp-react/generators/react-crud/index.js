var Generator = require("yeoman-generator");
const utils = require("./utils");
const prettier = require('gulp-prettier');
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    // to beautify the generated code from yeoman
    this.queueTransformStream(prettier());
  }

  _pascalCase = (word) => word.replace(/\w/, c => c.toUpperCase());
  _readAst = (path) => {
    let rawJsxCode = this.fs.read(path);
    let astTree = utils.toAst(rawJsxCode);
    return astTree
  }

  _writeAstToFile = (path, modifiedAstTree) => {
    let modifiedCode = utils.toCode(path, modifiedAstTree);
    const options = {
      comment: true,
      format: {
        indent: { style: "  " },
        compact: false,
      },
    };
    this.fs.write(path, modifiedCode, options);
  }
  _addEntity(project, entities) {
    for (let i = 0; i < entities.length; i++) {
      var entityName = entities[i]["name"];
      var fields = entities[i]["fields"];
      this.fs.copyTpl(
        this.templatePath("components/store/reduxSlice.ejs"),
        this.destinationPath(
          `src/views/${entityName}/store/${entityName}Slice.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/store/reduxAction.ejs"),
        this.destinationPath(
          `src/views/${entityName}/store/${entityName}.action.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/AddComponent.ejs"),
        this.destinationPath(
          `src/views/${entityName}/Add${this._pascalCase(entityName)}.jsx`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/EditComponent.ejs"),
        this.destinationPath(
          `src/views/${entityName}/Edit${this._pascalCase(entityName)}.jsx`
        ),
        { entityName: entityName, fields: fields }
      );  

      this.fs.copyTpl(
        this.templatePath("components/ComponentList.ejs"),
        this.destinationPath(
          `src/views/${entityName}/${this._pascalCase(entityName)}List.jsx`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/ComponentRoutes.ejs"),
        this.destinationPath(
          `src/views/${entityName}/${this._pascalCase(entityName)}Routes.js`
        ),
        { entityName: entityName, fields: fields }
      );
      
      // unit test
      
      this.fs.copyTpl(
        this.templatePath("components/store/__tests__/reduxSlice.test.ejs"),
        this.destinationPath(
          `src/views/${entityName}/store/__tests__/${entityName}Slice.test.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/store/__tests__/reduxAction.test.ejs"),
        this.destinationPath(
          `src/views/${entityName}/store/__tests__/${entityName}.action.test.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/__tests__/Add.test.ejs"),
        this.destinationPath(
          `src/views/${entityName}/__tests__/Add${this._pascalCase(entityName)}.test.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/__tests__/Edit.test.ejs"),
        this.destinationPath(
          `src/views/${entityName}/__tests__/Edit${this._pascalCase(entityName)}.test.js`
        ),
        { entityName: entityName, fields: fields }
      );

      this.fs.copyTpl(
        this.templatePath("components/__tests__/List.test.ejs"),
        this.destinationPath(
          `src/views/${entityName}/__tests__/${this._pascalCase(entityName)}List.test.js`
        ),
        { entityName: entityName, fields: fields }
      );

      // ast actions 
      this._updateReducersInStore(entityName);
      this._updateNavigationChildren(entityName);
      this._updateRoutesChildren(entityName);
    }
  }

  _updateReducersInStore(entityName) {
    const storePath = this.destinationPath("src/store/store.js");
    let originalJsxAstTree = this._readAst(storePath)

    let modifiedJsxAstTree = utils.updateStoreAstTree(
      originalJsxAstTree,
      entityName
    );
    this._writeAstToFile(storePath, modifiedJsxAstTree)
  }
   
  _updateNavigationChildren(entityName) {
    const navigationPath = this.destinationPath("src/navigations.js");
    let originalJsxAstTree = this._readAst(navigationPath)

    let modifiedJsxAstTree = utils.updateNavigationAstTree(
      originalJsxAstTree,
      entityName
    );
    this._writeAstToFile(navigationPath, modifiedJsxAstTree)
  }

  _updateRoutesChildren(entityName) {
    const routesPath = this.destinationPath("src/routes/routes.jsx");
    let originalJsxAstTree = this._readAst(routesPath)

    let modifiedJsxAstTree = utils.updateRoutesAstTree(
      originalJsxAstTree,
      entityName
    );
    this._writeAstToFile(routesPath, modifiedJsxAstTree)
  }

  writing() {
    var data = this.options.data
    var project = data.com_name;
    this.log(data.entities);
    var entities = data.entities;

    var destination = this.destinationRoot();
    this.log(`destination : ${destination}`);

    this._addEntity(project, entities);
  }
};
