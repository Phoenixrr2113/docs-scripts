const puppeteer = require("puppeteer");
const fs = require("fs");
const urlModule = require("url");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawlWebsite(baseURL, url, visited = new Set(), fileNumber = 1) {
  const normalizedURL = new URL(url, baseURL).href;

  // Remove hash fragments and query parameters if needed
  const cleanedURL = normalizedURL.split("#")[0].split("?")[0];

  if (visited.has(cleanedURL)) return;
  visited.add(cleanedURL);

  console.log(`Crawling ${cleanedURL}...`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(cleanedURL);

  // Extract the text content of the page
  const pageText = await page.evaluate(() => {
    // Function to convert HTML elements to Markdown
    function convertToMarkdown(element) {
      if (element.tagName.startsWith("H")) {
        const level = parseInt(element.tagName.substr(1));
        return "#".repeat(level) + " " + element.textContent;
      } else if (element.className.includes("codeBlockContainer_oyYg")) {
        const codeLines = Array.from(element.querySelectorAll(".token-line"))
          .map((line) => line.textContent)
          .join("\n");
        return "```sh\n" + codeLines + "\n```"; // Wrap code in Markdown code block
      }
      return element.textContent;
    }

    return Array.from(
      document.body.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, .codeBlockContainer_oyYg"
      )
    )
      .map(convertToMarkdown)
      .join("\n");
  });

  // Check the current file size
  const textFilePath = `./texts/${fileNumber}.md`;
  const currentSize = fs.existsSync(textFilePath)
    ? fs.statSync(textFilePath).size
    : 0;

  // If the current file size plus the new content exceeds 5MB, increment the file number
  if (currentSize + Buffer.from(pageText).length > 5 * 1024 * 1024) {
    fileNumber += 1;
  }

  // Append the page URL and text content to the file, with spacing between each appended text
  const contentToAppend = `\n\nPage URL: ${cleanedURL}\n\n${pageText}\n\n`;
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
  if (!fs.existsSync("./texts")) fs.mkdirSync("./texts"); // Create texts directory

  const startUrl = "https://docs.convex.dev"; // Hardcoded starting URL
  await crawlWebsite(startUrl, startUrl); // Pass startUrl as both baseURL and url

  console.log("Done!");
})();
