const express = require("express");
const fs = require("fs");
const xlsx = require("xlsx");
const router = express.Router();
const path = require("path");

const excelFilePath = path.join(__dirname, "AI_Models.xlsx");

router.post("/api/models", (req, res) => {
  const { name, price, link, description } = req.body;

  // Load or create workbook
  let workbook;
  if (fs.existsSync(excelFilePath)) {
    workbook = xlsx.readFile(excelFilePath);
  } else {
    workbook = xlsx.utils.book_new();
  }

  const sheetName = "Models";
  let worksheet = workbook.Sheets[sheetName];

  let data = [];

  if (worksheet) {
    data = xlsx.utils.sheet_to_json(worksheet);
  }

  data.push({ Name: name, Price: price, Link: link, Description: description });

  const newWorksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, newWorksheet, sheetName, true);

  xlsx.writeFile(workbook, excelFilePath);

  res.json({ msg: "Model saved to Excel!" });
});
