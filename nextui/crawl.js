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
  await page.goto(normalizedURL);

  const pageText = await page.evaluate(() => {
    function convertToMarkdown(element) {
      if (element.tagName.startsWith("H")) {
        const level = parseInt(element.tagName.substr(1));
        return "#".repeat(level) + " " + element.textContent;
      } else if (element.className.includes("language-typescript")) {
        const codeLines = Array.from(element.querySelectorAll('.token-line'))
          .map(line => line.textContent.trim())
          .join('\n');
        return "```typescript\n" + codeLines + "\n```";
      }
      return element.textContent;
    }

    return Array.from(
      document.body.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, pre.language-ts"
      )
    )
      .map(convertToMarkdown)
      .join("\n\n");
  });

  const textFilePath = `./texts/${fileNumber}.md`;
  const currentSize = fs.existsSync(textFilePath)
    ? fs.statSync(textFilePath).size
    : 0;

  if (currentSize + Buffer.from(pageText).length > 5 * 1024 * 1024) {
    fileNumber += 1;
  }

  const contentToAppend = `\n\nPage URL: ${normalizedURL}\n\n${pageText}\n\n`;
  fs.appendFileSync(`./texts/${fileNumber}.md`, contentToAppend);
  
  const nextLinkElement = await page.$('a[role="link"]:has(svg[class*="rotate-180"])');
  if (nextLinkElement) {
    const nextLink = await page.evaluate((el) => el.textContent.split(" ").join("-").toLowerCase(), nextLinkElement);
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

  const startUrl = "https://nextui.org/docs/customization/theme"; // Hardcoded starting URL for nextjs docs
  await crawlWebsite(startUrl, startUrl);

  console.log("Done!");
})();
