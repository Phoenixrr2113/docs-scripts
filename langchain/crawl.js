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
    return; // Skip this URL and return from the function
  }

  // Extract the text content of the page
  const pageText = await page.evaluate(() => {
    // Function to convert HTML elements to Markdown
    function convertToMarkdown(element) {
      if (element.tagName.startsWith("H")) {
        const level = parseInt(element.tagName.substr(1));
        return "#".repeat(level) + " " + element.textContent;
      } else if (element.className.includes("codeBlockContainer_Ckt0")) {
        const codeLines = Array.from(element.querySelectorAll(".token-line"))
          .map((line) => line.textContent)
          .join("\n");
        return "```typescript\n" + codeLines + "\n```"; // Wrap code in Markdown code block
      }
      return element.textContent;
    }

    return Array.from(
      document.body.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, .codeBlockContainer_Ckt0"
      )
    )
      .map(convertToMarkdown)
      .join("\n");
  });

  // Append to file logic
  const contentToAppend = `\n\nPage URL: ${normalizedURL}\n\n${pageText}\n\n`;
  fs.appendFileSync(`./texts/${fileNumber}.md`, contentToAppend);

  // Check for the "Next" link element
  const nextLinkElement = await page.$("a.pagination-nav__link--next");
  if (nextLinkElement) {
    const nextLink = await page.evaluate((el) => el.href, nextLinkElement);
    await browser.close();

    if (nextLink) {
      await sleep(2000); // 2-second delay
      await crawlWebsite(baseURL, nextLink, visited, fileNumber);
    }
  } else {
    await browser.close();
  }
}

(async () => {
  if (!fs.existsSync("./texts")) fs.mkdirSync("./texts");

  const startUrl ="https://js.langchain.com/docs/modules/agents/tools/integrations/aiplugin-tool"; // Hardcoded starting URL
  await crawlWebsite(startUrl, startUrl);

  console.log("Done!");
})();
