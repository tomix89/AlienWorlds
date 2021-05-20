# Updated UI, no more need to use editor, everithing can be set from the page!

Download both files, place them in the same repository.  
Double click on 'getMinesOnLand.html' it will open the page in your default browser.

Fill in the fields you need, leave blank the ones you dont need.
For example if you fill out only miner name it will show all your mines on all lands.
If you fill in only land owner or land id, you will get a list of mines on the land set.
If you would like to see your mines on a chesen land, fill in miner name and land owner / land id

You can't fill in both land ID and land owner at the same time. The Alien worlds API cant handle it.


Press the button and wait for result. Depending on the result size (max 5000 items) and the connection you have it might take up to 10s to prosess
After pressing the button the javascript makes a request to aleienworlds API -> https://github.com/Alien-Worlds/alienworlds-api  
The javascript reads the response and filters out the relavant data:
  1. the number of the result
  2. time of the mine (in server time, not your local time!)  
  3. miner name
  4. land id
  5. land owner name
  6. the mined amount in TLM   

BEWARE! there is also a line which calculates the total amount of TLM of your request. Becouse the API has a limit of 5000 items in teh response it might happen that not all your activiti is processed, therefore the number will be less than in reality. If you have less than 5000 results then the number is correct.

Last but not least, if you find this tool usefuul consider a small tip to os2ro.wam
