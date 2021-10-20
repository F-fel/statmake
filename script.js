function main() {
  pullfiles();
}

function pullfiles() {
  var fileInput = document.querySelector("#myfiles");
  var files = [...fileInput.files]
  for (let i = 0; i < files.length; i++) {
    parse(files[i]);
  }
}
function parse(csvFile) {
    var fr = new FileReader();
    fr.onload = function () {
      document.querySelector("#filecontent").textContent = fr.result;
      var temp = document.querySelector("#filecontent").textContent;
      transform(temp)
    }
    fr.readAsText(csvFile);
}
function transform(content) {
  var lines = content.split('\n');
  var cells = [];
  for (var line = 0; line < lines.length; line++) {
    cells.push(lines[line].split(','));
  }
  generate(cells);
}
let metrics = [];
function addMetric(metric_name, val, month) {
  myMetric = new Metric(metric_name);
  for (let i = 0; i < metrics.length; i++) {
    if (myMetric.isEqual(metrics[i])) {
      metrics[i].add(val, month)
      return;
    }
  }
  myMetric.add(val, month)
  metrics.push(myMetric)
}
class Metric {
  constructor(name, values = []) {
    this.name = name
    this.values = [];
  };
  contains(month) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].month == month) {
        return true;
      }
    }
    return false;
  }
  add(val, month) {
    if (this.contains(month))
      return
    let score = parseFloat(val);
    let elem = { "score": score, "month": month };
    this.values.push(elem);
  }
  isEqual(metric) {
    return this.name == metric.name;
  }
  print() {
    let report = `\n${this.name} `
    for (let i = 0; i < this.values.length; i++) {
      report += `\n ${this.values[i].month} :: ${this.values[i].score}`
    }
    report += `\naverage : ${this.average()}\n`
    return report;
  }
  average() {
    let total = 0;
    for (let i = 0; i < this.values.length; i++) {
      total += this.values[i].score;
    }
    let avg = total / this.values.length;
    return Number(avg).toFixed(2);
  }
}
function generate(cells) {
  let month = monthToString(cells[1][0].replace(/[{()}]/g, ''));
  for (let i = 4; i <= 13; i++) {
    addMetric(cells[i][1], cells[i][2], month);
  }
  let fullReport = "";
  for (let j = 0; j < metrics.length; j++) {
    fullReport += metrics[j].print();
  }
  const output = document.querySelector("#output");
  document.querySelector("#textCopy").style.display = "inline";
  output.value = fullReport;
  return fullReport
}

function monthToString(date) {
  let month = parseInt(date.replace(" ", "").split("/")[0])
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[month - 1];
}
function monthToInt(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months.findIndex(month) + 1;
}