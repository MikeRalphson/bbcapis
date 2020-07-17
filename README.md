### bbcapis - Nodejs-based utilities to document and consume BBC APIs, including Nitro

[![Join the chat at https://gitter.im/Mermade/bbcparse](https://badges.gitter.im/Mermade/bbcparse.svg)](https://gitter.im/Mermade/bbcparse?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Share on Twitter][twitter-image]][twitter-link]
[![Follow on Twitter][twitterFollow-image]][twitterFollow-link]

### Example of using nitroSdk.js

```javascript
const nitro = require('bbcparse/nitroSdk');
const api = require('bbcparse/nitroApi/api');

const host = 'programmes.api.bbc.com';
const path = api.nitroMasterbrands;
const api_key = 'INSERT_YOUR_NITRO_API_KEY_HERE';

let query = nitro.newQuery();
query.add(api.fMasterbrandsPartnerPid,'*',true);

let options = {};

nitro.make_request(host,path,api_key,query,options,function(obj){
  // process the response object
});
```

#### Utilities to:
* fetch API definitions (`fetchApis.js`)
* create an OpenAPI 3.0 definition from the Nitro API feed (`parseNitroApi.js`)
* create an OpenAPI 3.0 definition from the iBL API schema (`parseIblApi.js`)
* show programme, brand or series information by category or searching (`nitro.js`)
* show TV/radio category (genre/format) information (`nitroCategories.js`)
* show channel (masterbrand) information (`nitroChannels.js`)
* show partner (non-BBC services) information (`nitroPartners.js`)
* show linear service IDs (`nitroServices.js`)
* query the configured nitro host and return the response time (`nitroPing.js`)
* show download information for a version PID (`dlInfo.js`)
* find images by keyword (`imageFinder.js`)
* show information for an image PID (`imageInfo.js`)
* show TV iPlayer programme, category or channels information (`ibl.js`)
* query the searchSuggest API (`searchSuggest.js`)
* ignore programmes, brands or series by adding PIDs to a download_history file (`ignore.js`)
* populate a download_history from existing files (`populate_download_history.js`)
* populate a tv cache file (`gip_ibl`)
* populate a radio cache file (`gip_aod`)

Generated [JSDoc](https://doclets.io/Mermade/bbcparse/master) courtesy of [doclets.io](http://doclets.io)

[twitter-image]: https://img.shields.io/twitter/url/http/PermittedSoc.svg?style=social
[twitter-link]: https://twitter.com/share?source=tweetbutton&text=BBC%20Nitro%20API%20parser%20Via%20%40PermittedSoc&url=https%3A%2F%2Fgithub.com%2FMermade%2Fbbcparse
[twitterFollow-image]: https://img.shields.io/twitter/follow/PermittedSoc.svg?style=social
[twitterFollow-link]: https://twitter.com/intent/follow?screen_name=PermittedSoc
