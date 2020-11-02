let regions_list = [
  "# %%", // Jupyter
  "# <codecell>", // Jupyter
  "# region", // Python
  "#%%", // Jupyter
  "#Region", // Visual Basic
  "#pragma region", // C / C++
  "#region", // C#, Coffeescript, Perl5, PHP, PowerShell, Python
  "(#_region)", // F#
  "/*#region*/", // CSS
  "// #region", // JavaScript
  "//#region", // Java
  "//<editor-fold>", // Java
  "::#region", // Bat
  "=pod", // Perl5
  "REM #region", // Bat
];

let comments_list = [
  "!", // FORTRAN
  "#", // Bash, TCL, mySQL, Perl
  "%", // Prolog
  "'", // VB.NET
  "--", // Ada, mySQL
  "//", // C++, Java, JavaScript
  ";", // ALGOL 60, Assembly
  "<!--", // HTML
];

let dividers_list = [
  "<",
  ">",
  "-",
  "=",
  "_",
  "*",
  "#",
  "/",
  "~",
  ":",
  ";",
  "+",
  "&",
  "%",
  "$",
  "!",
  '"',
  " ",
];

function escapeRegExp(string: String) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

let dividers = dividers_list.map((x) => escapeRegExp(x)).join("|");
let regions = regions_list.map((x) => escapeRegExp(x)).join("|");
let comments = comments_list.map((x) => escapeRegExp(x)).join("|");

// Regions
let pattern1 = new RegExp(`(?:${regions}) *(.*)`);

//  Inline Sections
//  A comment with at least 3 divider symbols wrapped around text
let pattern2 = new RegExp(
  String.raw` *(?:${comments}).*?(?:${dividers}){3,} (.*) (?:${dividers}){3,}.*`
);

// Multiline Sections
// A comment with only divider symbols followed by a comment with text
let pattern3 = new RegExp(
  String.raw` *(?:${comments}) *(?:${dividers}){5,}\n *(?:${comments}) ?(.*)`
);

let patterns = [
  {
    description: "Regions",
    match: pattern1,
  },
  {
    description: "Inline Sections",
    match: pattern2,
  },
  {
    description: "Multiline Sections",
    match: pattern3,
  },
];

export default patterns;
