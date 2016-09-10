# Falcon

Flexible full text browsing history search in Chrome. Press `f` in the omnibar to start searching!

![Example Usage](Falcon.gif "Example Usage")

## Examples

`before: "yesterday at 5pm" after: "three weeks ago" emscripten blog "anish athalye"` 
- Searches for websites that you browsed between yesterday at 5pm and 3 weeks ago containing the keywords "emscripten" and "blog" and "anish athalye"

`-'cat food' just 'a dog'`
- Searches for websites you visited containing the keywords "just" and "a dog", and without the phrase "cat food".

`ethereum medium` 
- Searches for websites you visited in the last 2 weeks containing the keywords "ethereum" and "medium"

`ethereum medium after:11/29/2015 before:3/26/2016` 
- Searches for websites you visited between 11/29/2015 and 3/26/2016 containing the keywords "ethereum" and "medium"

## Secure Installation
If you don't feel comfortable installing a Chrome extension that can read and modify all data on the websites you visit from the webstore (we wouldn't either!), you can clone it on your local machine, read through our code to verify that it is not malicious, and then install it as an unpacked local extension through the menu in `chrome://extensions/`. This way you also won't receive any automatic updates, as well. 

## Preferences Page
To manage which URLs Falcon can index, delete websites from the index, and more, go to the preferences page.

!["Extension Bar"](http://i.imgur.com/w6cdWsc.png "Extension Bar")

## More Details
- Use `before:date` and `after:date` to search your history in a certain time range
  - In particular you can use natural language (if multiple words, surrounded by quotes to specify dates), e.g. `before:"yesterday at 5pm"`
- Use quotations to look for exact matches of strings containing whitespace
- Only documents containing all words will be searched
- Keywords shorter than 3 characters are ignored
