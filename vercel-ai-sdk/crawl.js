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
        return "#".repeat(level) + " " + element.textContent.trim();
      } else if (element.classList.contains("code-block_wrapper__H___a")) {
        const codeLanguage = element.querySelector("pre").className.split(" ")[1].replace("language-", "");
        const codeContent = element.querySelector("pre code").innerText.trim(); // Use innerText to preserve line breaks
        return `\`\`\`${codeLanguage}\n${codeContent}\n\`\`\``;
      } else if (element.tagName === "P" || element.tagName === "DIV") {
        return element.textContent.trim();
      }
      return element.textContent.trim();
    }

    return Array.from(
      document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, div.code-block_wrapper__H___a, div.prose p, div.prose article"
      )
    )
      .map(convertToMarkdown)
      .filter(text => text.length > 0)
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

  // Corrected Next Page Link Selection
  const nextLinkElement = await page.$("a.pagination_item__C4Vam.pagination_align-right__fIL10");
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

  const startUrl = "https://sdk.vercel.ai/docs/foundations/overview"; // Hardcoded starting URL for Vercel SDK docs
  await crawlWebsite(startUrl, startUrl);

  console.log("Done!");
})();
