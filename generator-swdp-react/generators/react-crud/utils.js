var esprima = require("esprima");
const escodegenJsx = require("escodegen-wallaby");
const walk = require("esprima-walk");


const capitalizeFirstLetter = (word) => word.replace(/\w/, c => c.toUpperCase())

function toAst(code) {
  try {
    var res = esprima.parseModule(code.toString(), { jsx: true });
    return res
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

function toCode(filePath, tree) {
  try {
    const options = {
      comment: true,
      format: {
        indent: { style: "  " },
        compact: false,
      },
    };
    const modifiedCode = escodegenJsx.generate(tree, options) + "\n";
    return modifiedCode
  } catch (error) {
    console.error(`Got an error trying to write the file: ${error.message}`);
  }
}


function updateStoreAstTree(tree, entityName) {
  const addImport = (name, path) => ({
    type: "ImportDeclaration",
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        local: {
          type: "Identifier",
          name,
        },
      },
    ],
    source: {
      type: "Literal",
      value: path,
    },
  });
  let importTree = addImport(
    entityName + "Reducer",
    `../views/${entityName}/store/${entityName}Slice`
  );
  const reducer = (name) => ({
    type: "Property",
    key: {
      type: "Identifier",
      name,
    },
    computed: false,
    value: {
      type: "Identifier",
      name: name + "Reducer",
    },
    kind: "init",
    method: false,
    shorthand: false,
  });

  let reducerTree = reducer(entityName);
  let position = 0;

  walk(tree, (node) => {
    if (node.type === "Program") {
      for (const item of node.body) {
        position += 1;
        if (
          item.type !== "ImportSpecifier" ||
          item.type !== "ImportDeclaration"
        ) {
          break;
        }
      }
    }

    if (
      node.type === "ExportDefaultDeclaration" &&
      node.declaration.arguments[0].properties[0].key.name === "reducer"
    ) {
      node.declaration.arguments[0].properties[0].value.properties.push(
        reducerTree
      );
    }
  });
  tree.body.splice(position, 0, importTree);
  return tree;
}


function updateNavigationAstTree(tree, entityName) {
  const naviChildren = {
    "type": "ObjectExpression",
    "properties": [
      {
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "name"
        },
        "computed": false,
        "value": {
          "type": "Literal",
          "value": entityName,
        },
        "kind": "init",
        "method": false,
        "shorthand": false
      },
      {
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "path"
        },
        "computed": false,
        "value": {
          "type": "Literal",
          "value": "/" + entityName,
        },
        "kind": "init",
        "method": false,
        "shorthand": false
      },
      {
        "type": "Property",
        "key": {
          "type": "Identifier",
          "name": "iconText"
        },
        "computed": false,
        "value": {
          "type": "Literal",
          "value": "A",
        },
        "kind": "init",
        "method": false,
        "shorthand": false
      }
    ]
  };

  walk(tree, (node) => {

    if (node.type === "ExportNamedDeclaration" && node.declaration.declarations[0].init.elements[0].properties[3].key.name === "children") {
      node.declaration.declarations[0].init.elements[0].properties[3].value.elements.push(naviChildren);
    }
  });
  return tree;
};

function updateRoutesAstTree(tree, entityName) {
  const importTree = {
    "type": "ImportDeclaration",
    "specifiers": [
      {
        "type": "ImportDefaultSpecifier",
        "local": {
          "type": "Identifier",
          "name": entityName + "Routes"
        }
      }
    ],
    "source": {
      "type": "Literal",
      "value": `views/${entityName}/${capitalizeFirstLetter(entityName)}Routes`,
    }
  }

  const routesChildrenArrayTree = {
    "type": "SpreadElement",
    "argument": {
      "type": "Identifier",
      "name": entityName + "Routes"
    }
  }


  let position = 0;
  walk(tree, (node) => {
    if (node.type === "Program") {
      for (const item of node.body) {
        position += 1;
        if (
          item.type !== "ImportSpecifier" ||
          item.type !== "ImportDeclaration"
        ) {
          break;
        }
      }
    }

    if (node.type === "ExportNamedDeclaration" && node.declaration.declarations[0].init.body.body[0].declarations[0].init.elements[0].properties[1].key.name === "children") {
      node.declaration.declarations[0].init.body.body[0].declarations[0].init.elements[0].properties[1].value.elements.push(routesChildrenArrayTree);
    }
  });
  (tree.body).splice(position, 0, importTree);
  return tree;
}

module.exports = {
  toAst: toAst,
  toCode: toCode,
  updateStoreAstTree: updateStoreAstTree,
  updateNavigationAstTree: updateNavigationAstTree,
  updateRoutesAstTree: updateRoutesAstTree
};
