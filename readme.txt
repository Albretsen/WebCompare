# @asgeiralbretsen/webcompare

**WebCompare** is a powerful Node.js package designed to help developers automate the process of comparing live websites with their stored snapshots. Whether you're interested in detecting text changes, attribute modifications, style updates, or structural changes in the DOM, **WebCompare** offers flexible solutions tailored to meet a variety of web monitoring needs.

## Features

- **Text Comparison**: Detect updates in the text content of web elements.
- **Attribute Comparison**: Track changes in attributes of elements, such as `src` in `<img>` tags.
- **Style Comparison**: Monitor modifications in the computed style of elements, including properties like `color` and `font-size`.
- **Children Comparison**: Observe structural changes in the child elements of a parent node.
- **Custom Comparison**: Implement custom logic for complex or specific comparison needs.

## Installation

Install **WebCompare** using npm:

`
npm install @asgeiralbretsen/webcompare
`

## Usage

First, require the package in your Node.js script:

`
const compareWebContent = require('@asgeiralbretsen/webcompare');
`

## Example: Comparing Text Content

`
(async () => {
    const url = "https://example.com";
    const comparisons = [{
        MonitorID: 1,
        Selector: "p.intro",
        Type: "text",
        Value: "Expected intro text"
    }];

    const changes = await compareWebContent(url, comparisons);
    console.log(changes);
})();
`

## API Reference

**compareWebContent(url, comparisons)**: Compares web content against provided snapshot values using specified comparison details.

## Licence

**WebCompare** is licensed under the ISC License. 