// Original from: http://killzonekid.com/worlds-smallest-fastest-xml-to-json-javascript-converter/
// Thanks to  Loamhoof for helping get this working!  
// http://stackoverflow.com/questions/15675352/regex-convert-xml-to-json/15680000
//Load XML into XML variable

module.exports = {

convert : function(xml) {      
  var regex = /(<\w+[^<]*?)\s+([\w-]+)="([^"]+)">/;
  while (xml.match(regex)) xml = xml.replace(regex, '<$2>$3</$2>$1>');  
  xml = xml.replace(/\s/g, ' ').  
  replace(/< *\?[^>]*?\? *>/g, '').  
  replace(/< *!--[^>]*?-- *>/g, '').  
  replace(/< *(\/?) *(\w[\w-]+\b):(\w[\w-]+\b)/g, '<$1$2_$3').
  replace(/< *(\w[\w-]+\b)([^>]*?)\/ *>/g, '< $1$2>').
  replace(/(\w[\w-]+\b):(\w[\w-]+\b) *= *"([^>]*?)"/g, '$1_$2="$3"').
  replace(/< *(\w[\w-]+\b)((?: *\w[\w-]+ *= *" *[^"]*?")+ *)>( *[^< ]*?\b.*?)< *\/ *\1 *>/g, '< $1$2 value="$3">').
  replace(/< *(\w[\w-]+\b) *</g, '<$1>< ').
  replace(/> *>/g, '>').
  replace(/"/g, '\\"').
  replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":"$2",').
  replace(/< *(\w[\w-]+\b) *>([^<>]*?)< *\/ *\1 *>/g, '"$1":[{$2}],').
  replace(/< *(\w[\w-]+\b) *>(?=("\w[\w-]+\b)":\{.*?\},\2)(.*?)< *\/ *\1 *>/, '"$1":{}$3},').
  replace(/],\s*?".*?": *\[/g, ',').
  replace(/< \/(\w[\w-]+\b)\},\{\1>/g, '},{').
  replace(/< *(\w[\w-]+\b)[^>]*?>/g, '"$1":{').
  replace(/< *\/ *\w[\w-]+ *>/g, '},').
  replace(/\} *,(?= *(\}|\]))/g, '}').
  replace(/] *,(?= *(\}|\]))/g, ']').
  replace(/" *,(?= *(\}|\]))/g, '"').
  replace(/ *, *$/g, '');
  xml = '{' + xml + '}';
  return JSON.parse(xml);
}

}