const puppeteer = require("puppeteer");
const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawlWebsite(baseURL, url, visited = new Set(), fileNumber = 1) {
  const normalizedURL = new URL(url, baseURL).href;
  if (visited.has(normalizedURL)) return;
  visited.add(normalizedURL);

  console.log(`Crawling ${normalizedURL}...`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(normalizedURL);
  } catch (error) {
    console.error(`Error navigating to ${normalizedURL}: ${error.message}`);
    await browser.close();
    return;
  }

  // Get all the buttons in the side menu
  const buttons = await page.$$(".SideMenu-module--code--292ff button");

  // Iterate through the buttons and click each one
  for (const button of buttons) {
    // Click the button
    await button.click();

    // Wait for the content to load
    sleep(1000);

    // Extract the text content of the page
    const pageText = await page.evaluate(() => {
      function convertToMarkdown(element) {
        if (element.tagName.startsWith("H")) {
          const level = parseInt(element.tagName.substr(1));
          return "#".repeat(level) + " " + element.textContent;
        } else if (element.className.includes("CodeArea-module--wrapper")) {
          const codeLines = Array.from(element.querySelectorAll(".token-line"))
            .map((line) => line.textContent)
            .join("\n");
          return "```javascript\n" + codeLines + "\n```";
        }
        return element.textContent;
      }

      return Array.from(
        document.body.querySelectorAll(
          "h1, h2, h3, h4, h5, h6, p, .CodeArea-module--wrapper"
        )
      )
        .map(convertToMarkdown)
        .join("\n");
    });

    // Append to file logic
    const contentToAppend = `\n\nPage URL: ${normalizedURL}\n\n${pageText}\n\n`;
    fs.appendFileSync(`./texts/${fileNumber}.md`, contentToAppend);
  }

  await browser.close();
}

(async () => {
  if (!fs.existsSync("./texts")) fs.mkdirSync("./texts");

  const startUrl = "https://www.react-hook-form.com/get-started/"; // Hardcoded starting URL
  await crawlWebsite(startUrl, startUrl);

  console.log("Done!");
})();
