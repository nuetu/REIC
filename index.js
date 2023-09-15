function main() {
  var table = document.getElementById("table");
  var cost_table = document.getElementById("cost_table");
  while (table.childNodes.length > 2) {
    table.removeChild(table.lastChild);
    cost_table.removeChild(cost_table.lastChild);
  }
  data = {
    property_value: document.getElementById("property_value").value,
    mortgage_years: document.getElementById("mortgage_years").value,
    property_tax: parseInt(document.getElementById("property_tax").value),
    hoa_fees: parseInt(document.getElementById("hoa_fees").value),
    utility_cost: calcUtil(),
    interest_rate: document.getElementById("interest_rate").value,
    pmi_rate: document.getElementById("pmi_rate").value,
    rental_value: parseInt(document.getElementById("rental_value").value),
  };

  //Change table header for mortgage years.
  document.getElementById("year").innerHTML =
    data.mortgage_years + " Year Splits";

  //create array of down-payment options
  let dp = document.getElementById("dp_values").value.split(",");

  //Each iteration is a down-payment option
  for (let i = 0; i < dp.length; i++) {
    let percent = dp[i] / 100;

    //values stored in object
    data.downpayment_value = Math.round(percent * data.property_value);
    data.mortgage_value = Math.round(
      data.property_value - data.downpayment_value
    );
    data.yearly_splits = Math.round(data.mortgage_value / data.mortgage_years);
    data.monthly_splits = Math.round(data.yearly_splits / 12);
    data.monthly_interest = Math.round(
      (data.interest_rate / 100) * data.monthly_splits
    );
    if (dp[i] < 20) {
      data.pmi = Math.round(((data.pmi_rate / 100) * data.mortgage_value) / 12);
    } else {
      data.pmi = 0;
    }
    data.mortgage_total =
      data.monthly_splits + data.monthly_interest + data.pmi;

    //construct row's columns
    let table_row = "<tr><td>" + dp[i] + "%</td>";
    table_row +=
      "<td>$" + data.downpayment_value.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + data.mortgage_value.toLocaleString("en-US") + "</td>";
    table_row += "<td>$" + data.yearly_splits.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + data.monthly_splits.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + data.monthly_interest.toLocaleString("en-US") + "</td>";
    table_row += "<td>$" + data.pmi.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + data.mortgage_total.toLocaleString("en-US") + "</td>";
    table_row += "</tr>";
    table.innerHTML += table_row;

    //values for cost table
    data.yearly_mortgage_total = data.mortgage_total * 12;
    data.yearly_utility_cost = data.utility_cost * 12;
    data.yearly_hoa_fees = data.hoa_fees * 12;
    if (!showRental()) {
      data.rental_value = 0;
    }
    data.yearly_total_cost =
      data.yearly_mortgage_total +
      data.property_tax +
      data.yearly_utility_cost -
      data.rental_value * 12 +
      data.yearly_hoa_fees;
    data.monthly_total_cost = Math.round(parseInt(data.yearly_total_cost) / 12);

    //construct cost Table row's columns
    let cost_table_row = "<tr><td>" + dp[i] + "%</td>";
    cost_table_row +=
      "<td>$" + data.mortgage_total.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.yearly_mortgage_total.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.property_tax.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.utility_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.yearly_utility_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.yearly_hoa_fees.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.rental_value.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.yearly_total_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + data.monthly_total_cost.toLocaleString("en-US") + "</td>";
    cost_table_row += "</tr>";
    cost_table.innerHTML += cost_table_row;
  }
}

var utilities = {
  gas: 65,
  electricity: 115,
  water: 75,
  sewer: 150,
  trash: 40,
  internet: 50,
  hoi: 125,
};
var options = document.getElementsByClassName("utility_option");

function showUtil() {
  let input = document.getElementById("util_chk");
  let table = document.getElementById("utility_table");
  while (table.childNodes.length > 4) {
    table.removeChild(table.lastChild);
  }
  if (input.checked) {
    document.getElementById("utility_options").style.display = "flex";
    for (let i = 0; i < options.length - 1; i++) {
      if (
        options[i].firstElementChild.checked &&
        options[i].firstElementChild.id != "all"
      ) {
        let table_row = "<div>" + options[i].firstElementChild.value + "</div>";
        table_row +=
          '<div>$<input type="number" id="val' +
          options[i].firstElementChild.id +
          '" onchange="calcUtil()" value="' +
          utilities[options[i].firstElementChild.id] +
          '"/></div>';
        table.innerHTML += table_row;
      }
    }
    table.innerHTML += "<div>Total:</div><div id='util_total'>$0</div>";
    calcUtil();
  } else {
    document.getElementById("utility_options").style.display = "none";
  }
}

function selectAll() {
  if (options[options.length - 1].firstElementChild.checked) {
    for (let i = 0; i < options.length - 1; i++) {
      options[i].firstElementChild.checked = true;
      document.getElementById("labelForAll").innerHTML = "Disselect All";
    }
  } else {
    for (let i = 0; i < options.length - 1; i++) {
      options[i].firstElementChild.checked = false;
      document.getElementById("labelForAll").innerHTML = "Select All";
    }
  }

  showUtil();
}

function calcUtil() {
  let total = 0;
  for (util in utilities) {
    let str = "val" + util;
    let val = document.getElementById(str);
    if (val) {
      utilities[util] = val.value;
      total += parseInt(val.value);
    }
  }
  let tot = document.getElementById("util_total");
  if (tot) {
    tot.innerHTML = "$" + total;
  }
  return total;
}

function showRental() {
  let input = document.getElementById("add_rental");
  if (input.checked) {
    document.getElementById("rental_options").style.display = "flex";
    return true;
  } else {
    document.getElementById("rental_options").style.display = "none";
    return false;
  }
}

function showDp() {
  let input = document.getElementById("add_dp");
  if (input.checked) {
    document.getElementById("dp_options").style.display = "flex";
  } else {
    document.getElementById("dp_options").style.display = "none";
  }
}
