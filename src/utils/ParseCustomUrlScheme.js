export default class ParseCustomUrlScheme {
  url = ''
  protocol = '';
  host = '';
  hostname = '';
  port = '';
  pathname = '';
  search = '';
  hash = '';

  constructor(url) {
    this.url = url;
    const match = url.match(/^(.*?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);

    this.protocol = match[1];
    this.host = match[2];
    this.hostname = match[3];
    this.port = match[4];
    this.pathname = match[5];
    this.search = match[6];
    this.hash = match[7];
  }

  getSearchParameters() {
    const params = new URLSearchParams(this.search);
    let result = [];
    params.forEach((value, key) => result.push({key, value}));
    return result;
  }

  getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(this.url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
