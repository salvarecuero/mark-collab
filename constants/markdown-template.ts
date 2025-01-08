const MARKDOWN_TEMPLATE = `
# Markdown Example Template

## Headings
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Paragraphs
This is a simple paragraph with some **bold text**, *italic text*, and ***bold italic text***.

## Blockquotes
> This is a blockquote.
>
> It can span multiple lines.

## Lists
### Unordered List
- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2
- Item 3

### Ordered List
1. Item 1
2. Item 2
   1. Subitem 2.1
   2. Subitem 2.2
3. Item 3

## Code
### Inline Code
Here is an example of \`inline code\`.

### Code Block
<codeblock>
function helloWorld() {
    console.log("Hello, World!");
}
<codeblock>

## Horizontal Rule
---

## Links
[This is a link](https://www.example.com)

### Link with Title
[This is a link with a title](https://www.example.com "Example Title")

## Images
![Alt Text](https://via.placeholder.com/150 "Placeholder Image")

## Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |

## Task Lists
- [x] Task 1
- [ ] Task 2
- [ ] Task 3

## Footnotes
This is a sentence with a footnote.[^1]

[^1]: This is the footnote text.

## Strikethrough
~~This is strikethrough text.~~

## Special Characters
Escape special characters using a backslash (\): \* \_ \` \[ \] \( \) \# \+ \- \.

## Advanced Features
### Definition List
Term 1
: Definition 1

Term 2
: Definition 2
`.replaceAll("<codeblock>", "```");

export default MARKDOWN_TEMPLATE;
