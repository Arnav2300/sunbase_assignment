var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const axios = require("axios");
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static("public"));
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});
app.get("/tables.html", function (req, res) {
  res.sendFile(__dirname + "/" + "tables.html");
});
app.get("/details.html", function (req, res) {
  res.sendFile(__dirname + "/" + "details.html");
});
app.get("/update.html", function (req, res) {
  res.sendFile(__dirname + "/" + "update.html");
});

let apiRes = null;
app.post("/login", urlencodedParser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const apiUrl =
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";
    apiRes = await axios.post(apiUrl, {
      login_id: email,
      password: password,
    });
    //localStorage.setItem("access_token", apiRes.data.access_token);
    console.log(apiRes);
    res.redirect("/tables.html");
  } catch (error) {
    console.error(error.message);
    res.json(error);
  }
});

app.post("/new", urlencodedParser, async (req, res) => {
  //console.log(apiRes);
  try {
    const headerList = { Authorization: `Bearer ${apiRes.data.access_token}` };
    const apiUrl =
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
    const parameters = "?cmd=create";
    const { first, last, street, add, city, state, email, phone } = req.body;
    const userData = JSON.stringify({
      first_name: first,
      last_name: last,
      street: street,
      address: add,
      city: city,
      state: state,
      email: email,
      phone: phone,
    });
    const reqOptions = {
      url: apiUrl + parameters,
      method: "POST",
      headers: headerList,
      data: userData,
    };
    const response = await axios.request(reqOptions);
    console.log(response.data);
    res.redirect("/tables.html");
  } catch (error) {
    console.log(error.message);
    res.json(error);
  }
});

app.get("/list", urlencodedParser, async (req, res) => {
  try {
    const headerList = { Authorization: `Bearer ${apiRes.data.access_token}` };
    const apiUrl =
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
    const parameters = "?cmd=get_customer_list";
    const reqOptions = {
      url: apiUrl + parameters,
      method: "GET",
      headers: headerList,
    };
    const response = await axios.request(reqOptions);
    res.json(response.data);
  } catch (error) {
    console.log(error.message);
    res.json(error);
  }
});

app.post("/edit", urlencodedParser, async (req, res) => {
  try {
    const { uuid } = req.query;
    //console.log(uuid);
    const headerList = { Authorization: `Bearer ${apiRes.data.access_token}` };
    const apiUrl =
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
    const parameters = "?cmd=update" + "&" + "uuid=" + uuid;
    const { first, last, street, add, city, state, email, phone } = req.body;
    const userData = JSON.stringify({
      first_name: first,
      last_name: last,
      street: street,
      address: add,
      city: city,
      state: state,
      email: email,
      phone: phone,
    });
    const reqOptions = {
      url: apiUrl + parameters,
      method: "POST",
      headers: headerList,
      data: userData,
    };
    const response = await axios.request(reqOptions);
    console.log(response.data);
    res.redirect("/tables.html");
  } catch (error) {
    console.log(error.message);
    res.json(error);
  }
});
app.post("/delete", urlencodedParser, async (req, res) => {
  try {
    const { uuid } = req.query;
    //console.log(uuid)
    const headerList = { Authorization: `Bearer ${apiRes.data.access_token}` };
    const apiUrl =
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
    const parameters = "?cmd=delete" + "&" + "uuid=" + uuid;
    const reqOptions = {
      url: apiUrl + parameters,
      method: "POST",
      headers: headerList,
    };
    const response = await axios.request(reqOptions);
    res.json(response);
  } catch (error) {
    console.log(error.message);
    res.json(error);
  }
});
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
