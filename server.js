const http = require("http");
const host = "localhost";
const port = 8000;

const xml2js = require("xml2js");
const fs = require("fs");

const requestListener = function (req, res) {
  res.writeHead(200);

  function minvalue(xmldata) {
    let min = 10000;
    for (let list of xmldata.indicators.res) {
      if (list.value < min) {
        min = list.value;
      }
    }
    return min;
  }

  const data = fs.readFileSync("data.xml", "utf-8");

  xml2js.parseString(data, (err, result) => {
    if (err) {
      console.error(err);
      res.end("Error parsing XML");
    } else {
      const mindata = minvalue(result);

      const xmlBuilder = new xml2js.Builder();
      const xmlres = xmlBuilder.buildObject({
        data: { min_value: mindata.toString() },
      });

      fs.writeFileSync("res.xml", xmlres);
      res.end(xmlres);
    }
  });
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
