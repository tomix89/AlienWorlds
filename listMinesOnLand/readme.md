# Miner and land statistics at the reach of a click

Download both files, place them in the same repository.  
Double click on 'getMinesOnLand.html' it will open the page in your default browser.

Fill in the fields you need, leave blank the ones you don't need.
For example if you fill out only miner name it will show all the miner's mines across all lands.
If you fill in only land owner or land id, you will get a list of mines on the land set.
If you would like to see your mines on a chosen land, fill in miner name and land owner / land id

**You can't fill in both land ID and land owner at the same time. The Alien worlds API cant handle it.**


Press the button and wait for result. Depending on the result size (max 5000 items) and the connection you have it might take up to 10s to process
After pressing the button the javascript makes a request to alienworlds API -> https://github.com/Alien-Worlds/alienworlds-api  
The javascript reads the response and filters out the relevant data:
  1. the number of the result
  2. time of the mine (in server time, not your local time!)  
  3. miner name
  4. land id
  5. land owner name
  6. the mined amount in TLM   

**BEWARE!** There is also a line which calculates the total amount of TLM of your request. Because the API has a limit of 5000 items in the response it might happen that not all your activity is processed, therefore the number will be less than in reality. If you have less than 5000 results then the number is correct.

Last but not least, if you find this tool useful consider a small tip to os2ro.wam
