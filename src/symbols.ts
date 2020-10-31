export const getCommentSymbols = (lang: string) => {
  switch (lang) {
    case "asciidoc":
    case "apex":
    case "javascript":
    case "javascriptreact":
    case "terraform":
    case "typescript":
    case "typescriptreact":
    case "al":
    case "c":
    case "cpp":
    case "csharp":
    case "dart":
    case "flax":
    case "fsharp":
    case "go":
    case "groovy":
    case "haxe":
    case "java":
    case "jsonc":
    case "kotlin":
    case "less":
    case "pascal":
    case "objectpascal":
    case "php":
    case "rust":
    case "scala":
    case "sass":
    case "scss":
    case "shaderlab":
    case "stylus":
    case "swift":
    case "verilog":
    case "vue":
      return { left: "//", right: "//" };

    case "coffeescript":
    case "dockerfile":
    case "elixir":
    case "gdscript":
    case "graphql":
    case "julia":
    case "makefile":
    case "nim":
    case "perl":
    case "perl6":
    case "powershell":
    case "puppet":
    case "python":
    case "r":
    case "ruby":
    case "shellscript":
    case "tcl":
    case "yaml":
      return { left: "#", right: "#" };

    case "css":
      return { left: "/*", right: "*/" };

    case "ada":
    case "elm":
    case "haskell":
    case "hive-sql":
    case "lua":
    case "pig":
    case "plsql":
    case "sql":
      return { left: "--", right: "--" };

    case "brightscript":
    case "diagram":
    case "vb":
      return { left: "'", right: "'" };

    case "bibtex":
    case "erlang":
    case "latex":
    case "matlab":
      return { left: "%", right: "%" };

    case "clojure":
    case "racket":
    case "lisp":
      return { left: ";", right: ";" };

    case "COBOL":
      return { left: "*>", right: "*<" };

    case "fortran-modern":
      return { left: "c", right: "c" };

    case "SAS":
    case "stata":
      return { left: "*", right: "*" };

    case "html":
    case "markdown":
    case "xml":
      return { left: "<!--", right: "-->" };

    case "twig":
      return { left: "{#", right: "#}" };

    case "cfml":
      return { left: "<!---", right: "--->" };

    default:
      return { left: "#", right: "#" };
  }
};
