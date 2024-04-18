/**
 * Web Element Comparison Tool
 * 
 * This script allows for comparing web elements against snapshot values to detect changes.
 * Different comparison types are supported to cover various aspects of web elements:
 * 
 * - 'text': Compares the text content of an element.
 *   Example: Comparing the text of a <p> tag to see if it has been updated.
 * 
 * - 'attribute': Compares one or more attributes of an element.
 *   Example: Checking if the 'src' attribute of an <img> tag has changed to a different URL.
 * 
 * - 'style': Compares the computed style of an element.
 *   Example: Detecting changes in the 'color' or 'font-size' CSS properties of an element.
 * 
 * - 'children': Compares the child elements of a parent element, looking at the structure and content.
 *   Example: Checking if new <li> items have been added to or removed from a <ul> list.
 * 
 * - 'custom': Allows for custom comparison logic, suitable for complex or specific needs.
 *   Example: Custom logic to compare data-bound attributes or JavaScript-generated content.
 * 
 * Each comparison type provides a targeted approach to detecting changes, offering flexibility
 * and precision for monitoring web content modifications.
 * 
 * Copyright (c) Asgeir Albretsen, 2023
 */

/**
 * Represents a monitor with its comparison details.
 * 
 * @typedef {Object} Monitor
 * @property {number} MonitorID - The ID of the monitor.
 * @property {string} Selector - The CSS selector for the element.
 * @property {string} Type - The type of comparison ('text', 'attribute', 'style', 'children', 'custom').
 * @property {Array<string>} Attributes - The list of attributes to compare, relevant if Type is 'attribute'.
 * @property {*} Value - The expected value for the comparison.
 */

const puppeteer = require('puppeteer-core');

/**
 * Launches a Puppeteer browser and navigates to the specified URL.
 * @param {string} url - The URL to navigate to.
 * @returns {Promise<object>} - The Puppeteer page instance.
 */
async function navigateToPage(url) {
    const browser = await puppeteer.launch({headless: true, executablePath: "./chrome-linux/chrome", args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    return { page, browser };
}

/**
 * Fetches details of a web element based on the provided comparison details.
 * @param {object} page - The Puppeteer page instance.
 * @param {object} comparisonDetails - Detailed information for the comparison.
 * @returns {Promise<object>} - An object containing the fetched element details.
 */
async function getElementDetails(page, comparisonDetails) {
    const { Selector, Type, Attributes } = comparisonDetails;
    return page.evaluate(({ Selector, Type, Attributes }) => {
        const evaluateElement = ({ element, Type, Attributes }) => {
            switch (Type) {
                case 'text':
                    return element.textContent || null;
                case 'attribute':
                    const attributesDetails = {};
                    Attributes.forEach(attr => {
                        attributesDetails[attr] = element.getAttribute(attr);
                    });
                    return attributesDetails;
                case 'style':
                    const computedStyle = window.getComputedStyle(element);
                    return {
                        style: Array.from(computedStyle).reduce((acc, propName) => {
                            acc[propName] = computedStyle[propName];
                            return acc;
                        }, {})
                    };
                case 'children':
                    return {
                        children: Array.from(element.children).map(child => child.outerHTML).join('')
                    };
                case 'custom':
                    // Placeholder for custom comparison logic
                    return {
                        custom: {}
                    };
                default:
                    return {};
            }
        };

        const element = document.querySelector(Selector);
        if (!element) {
            return {};
        }
        return evaluateElement({ element, Type, Attributes });
    }, { Selector, Type, Attributes });
}

/**
 * Compares web content against provided snapshot values using specified comparison details.
 * @param {string} url - The URL of the web page to check.
 * @param {Array<object>} comparisons - An array of objects for comparison.
 * @returns {Promise<Array>} - An array of objects detailing detected changes.
 */
async function compareWebContent(url, comparisons) {
    const { page, browser } = await navigateToPage(url);

    const results = await Promise.all(comparisons.map(async (comparison) => {
        const currentDetails = await getElementDetails(page, comparison);

        if (JSON.stringify(currentDetails) !== JSON.stringify(comparison.Value)) {
            return {
                ...comparison,
                Selector: comparison.Selector,
                Type: comparison.Type,
                Attributes: comparison.Attributes,
                ExpectedValue: comparison.Value,
                CurrentValue: currentDetails,
            };
        }
    }));

    await browser.close();
    return results.filter(result => result !== undefined);
}

module.exports = compareWebContent;