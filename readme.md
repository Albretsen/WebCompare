# WebCompare

**WebCompare** is an advanced Node.js package designed for developers to automate the process of comparing live websites with their archived snapshots. It is particularly useful for detecting text changes, attribute modifications, style updates, or structural changes in the DOM. WebCompare offers flexible solutions to accommodate a variety of web monitoring needs.

## Features

- **Text Comparison**: Identifies updates in the text content of web elements.
- **Attribute Comparison**: Monitors changes in attributes of elements, such as `src` in `<img>` tags.
- **Style Comparison**: Observes adjustments in the computed style of elements, including properties like `color` and `font-size`.
- **Children Comparison**: Tracks structural alterations within the child elements of any parent node.
- **Custom Comparison**: Allows for the implementation of bespoke logic to address complex or specific comparison demands.

## Installation

To install **WebCompare**, execute the following command using npm:

```
npm install @asgeiralbretsen/webcompare
```

## Usage

Begin by requiring the package in your Node.js script:

```
const compareWebContent = require('@asgeiralbretsen/webcompare');
```

## Example: Comparing Text Content

```
(async () => {
    const url = "https://example.com";
    const comparisons = [{
        Selector: "p.intro",
        Type: "text",
        Value: "Expected intro text"
    }];

    const changes = await compareWebContent(url, comparisons);
    console.log(changes);
})();
```

## Example: Comparing Attributes

```
(async () => {
    const url = "https://example.com";
    const comparisons = [{
        Selector: "p.intro",
        Type: "attribute",
        Attributes: ["src"]
    }];

    const changes = await compareWebContent(url, comparisons);
    console.log(changes);
})();
```

## API Reference

**compareWebContent(url, comparisons)**: This function compares web content against provided snapshot values using the specified comparison details.

## Licence

**WebCompare** is licensed under the ISC License.