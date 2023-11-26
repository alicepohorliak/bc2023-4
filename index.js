const http = require("http");
const fs = require('fs');
const xml = require("fast-xml-parser");

const host = 'localhost';
const port = 8000;

const requestListener = function (req, res) {
    const parser = new xml.XMLParser();
    const builder = new xml.XMLBuilder();

    const handleError = (statusCode, errorMessage) => {
        res.writeHead(statusCode);
        res.end(errorMessage);
    };

    fs.readFile("data.xml", (err, data) => {
        if (err) {
            handleError(400, "Error reading data.xml");
        } else {
            res.setHeader('Content-Type', 'text/xml');
            res.writeHead(200);

            const xmlData = data.toString();
            const parsedData = parser.parse(xmlData)['indicators']['inflation'];

            const filteredData = parsedData.filter(entry => entry.ku == 13 && entry.value > 5);
            const filteredValues = filteredData.map(entry => entry.value);

            const newObj = builder.build({'data': {'value': filteredValues}});
            res.end(newObj);
        }
    });
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
