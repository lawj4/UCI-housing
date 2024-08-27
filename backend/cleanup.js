

// async function checkImgurRedirect(url) {
//     // Launch a headless browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     try {
//         // Navigate to the URL and wait for all network activity to finish
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Get the final URL after all redirects and JavaScript execution
//         const finalUrl = page.url();

//         // Check if the final URL is the Imgur home page
//         if (finalUrl === 'https://imgur.com/') {
//             console.log('The link redirects to the Imgur home page.');
//         } else {
//             console.log('The link does not redirect to the Imgur home page.');
//         }
//     } catch (error) {
//         console.error('An error occurred:', error);
//     } finally {
//         // Close the browser
//         await browser.close();
//     }
// }


// // Example usage
// const url = 'https://imgur.com/a/7Ecn4R';  // Replace with the link you want to check
// checkImgurRedirect(url);


const puppeteer = require('puppeteer');

async function checkWordsInPage(url) {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const wordsToCheck = ["This content isn't available right now", 'Go to News Feed', 'Go back',"Visit Help Center"];

  try {
    // Navigate to the page and wait for the content to be fully loaded
    await page.goto(url, { waitUntil: 'networkidle0' }); // Wait until there are no more than 0 network connections for at least 500ms

    // Optionally, you can wait for a specific selector to ensure the page is fully rendered
    // await page.waitForSelector('#specificElement');

    // Get the page content
    const pageContent = await page.evaluate(() => document.body.innerText);

    // Check each word and log the result
    var isBroken = false;
    for (const word of wordsToCheck) {
        if (pageContent.includes(word)) {
          // If condition is true, exit the loop
          isBroken = true;
          break;
        }
      }
      if (isBroken) {
        console.log(`**IS GONE** "${url}"`);
      }
      


  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Example usage
const url = 'https://www.facebook.com/groups/ucirvinehousing24/permalink/123019417506349';

checkWordsInPage(url);

