var Generator = require('yeoman-generator');
var fs = require('fs');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
    }

    writing() {
        var data = this.options.data
        var project = data.com_name

        var destination = this.destinationRoot()
        this.log(`destination : ${destination}`)

        this._copyStaticTemplates(project);

    }
    
    _copyStaticTemplates(project) {
        
        this.fs.copyTpl(
            this.templatePath("public"),
            this.destinationPath("public")
        )

        this.fs.copyTpl(
            this.templatePath("src"),
            this.destinationPath("src"),
            { project:project }
        )

        this.fs.copyTpl(
            this.templatePath(".babelrc.js"),
            this.destinationPath(".babelrc.js")
        )
        
        this.fs.copyTpl(
            this.templatePath(".env"),
            this.destinationPath(".env")
        )
        this.fs.copyTpl(
            this.templatePath(".gitignore"),
            this.destinationPath(".gitignore")
        )
        this.fs.copyTpl(
            this.templatePath("config-overrides.js"),
            this.destinationPath("config-overrides.js")
        )
        this.fs.copyTpl(
            this.templatePath("jsconfig.json"),
            this.destinationPath("jsconfig.json")
        )
        this.fs.copyTpl(
            this.templatePath("LICENSE"),
            this.destinationPath("LICENSE")
        )
        this.fs.copyTpl(
            this.templatePath("LICENSE"),
            this.destinationPath("LICENSE")
        )

        this.fs.copyTpl(
            this.templatePath("package.json"),
            this.destinationPath("package.json"),
            { project: project }
        )

        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md")
        )
        this.fs.copyTpl(
            this.templatePath("Dockerfile.build"),
            this.destinationPath("Dockerfile.build")
        )
        this.fs.copyTpl(
            this.templatePath("Dockerfile.publish"),
            this.destinationPath("Dockerfile.publish")
        )
        this.fs.copyTpl(
            this.templatePath("nginx.conf"),
            this.destinationPath("nginx.conf")
        )
        this.fs.copyTpl(
            this.templatePath("catalog-info.yaml"),
            this.destinationPath("catalog-info.yaml")
        )
    }
}
