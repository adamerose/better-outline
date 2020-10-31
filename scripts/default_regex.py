"""
Take a list of regex expressions and combine them into 1 and escape special characters
"""
import re
from collections import OrderedDict

regions = [
    '# %%',
    '# <codecell>',
    '# region',
    '#%%',
    '#Region',
    '#pragma region',
    '#region',
    '(#_region)',
    '/*#region*/',
    '// #region',
    '//#region',
    '//<editor-fold>',
    '::#region',
    '=pod',
    'REM #region',
]

comments = [
    '!',
    '#',
    '%',
    "'",
    '--',
    '//',
    ';',
    '<!--',
]

dividers = [
    '<',
    '>',
    '-',
    '=',
    '_',
    '*',
    '#',
    '/',
    '~',
    ':',
    ';',
    '+',
    '&',
    '%',
    '$',
    '!',
    '"',
    ' ']


def escape(string):
    result = re.escape(string)
    # Escape forward slashes for JavaScript
    result = result.replace('/', '\\/')

    return result


def json_output(pattern, name):
    pattern = pattern.replace('\\', '\\\\').replace(
        '"', '\\"')  # Escape backslash and quotes for JSON
    return f"""
{"{"}
    "description": "{name}",
    "match": "{pattern}"
{"}"}
    """.strip()


if __name__ == "__main__":

    dividers = "|".join([escape(pat) for pat in dividers])
    regions = "|".join([escape(pat) for pat in regions])
    comments = "|".join([escape(pat) for pat in comments])

    # ==========================================================================
    # Regions

    pattern1 = rf"(?:{regions}) *(.*)"

    # ==========================================================================
    # Multiline Sections
    # A comment with only divider symbols followed by a comment with text
    pattern2 = rf" *(?:{comments}) *(?:{dividers}){{5,}}\n *(?:{comments}).*?(\w+)"

    # ==========================================================================
    # Inline Sections
    # A comment with at least 3 divider symbols wrapped around text
    pattern3 = rf" *(?:{comments}).*?(?:{dividers}){{3,}} *(\w+) *(?:{dividers}){{3,}}.*"

    print(json_output(pattern1, 'Regions') + ',')
    print(json_output(pattern2, 'Multiline Sections') + ',')
    print(json_output(pattern3, 'Inline Sections'))
    print('------------')
    print(pattern1)
    print(pattern2)
    print(pattern3)

    print('------------')
    print(f"{pattern1}|{pattern2}|{pattern3}")
