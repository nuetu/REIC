function main() {
  var table = document.getElementById("table");
  var cost_table = document.getElementById("cost_table");
  while (table.childNodes.length > 2) {
    table.removeChild(table.lastChild);
    cost_table.removeChild(cost_table.lastChild);
  }
  let property_value = document.getElementById("property_value").value;
  let mortgage_years = document.getElementById("mortgage_years").value;
  document.getElementById("year").innerHTML = mortgage_years + " Year Splits";
  let property_tax = document.getElementById("property_tax").value;
  let hoa_fees = document.getElementById("hoa_fees").value;
  let utility_cost = calcUtil();
  let interest_rate = document.getElementById("interest_rate").value;
  let pmi_rate = document.getElementById("pmi_rate").value;
  let dp = document.getElementById("dp_values").value.split(",");

  for (let i = 0; i < dp.length; i++) {
    //each iteration = 1 row
    let percent = dp[i] / 100;

    //values stored in object
    let values = {
      downpayment_value: Math.round(percent * property_value),
    };
    values.mortgage_value = Math.round(
      property_value - values.downpayment_value
    );
    values.yearly_splits = Math.round(values.mortgage_value / mortgage_years);
    values.monthly_splits = Math.round(values.yearly_splits / 12);
    values.monthly_interest = Math.round(
      (interest_rate / 100) * values.monthly_splits
    );
    if (dp[i] < 20) {
      values.pmi = Math.round(((pmi_rate / 100) * values.mortgage_value) / 12);
    } else {
      values.pmi = 0;
    }
    values.mortgage_total =
      values.monthly_splits + values.monthly_interest + values.pmi;

    //construct row's columns
    let table_row = "<tr><td>" + dp[i] + "%</td>";
    table_row +=
      "<td>$" + values.downpayment_value.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + values.mortgage_value.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + values.yearly_splits.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + values.monthly_splits.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + values.monthly_interest.toLocaleString("en-US") + "</td>";
    table_row += "<td>$" + values.pmi.toLocaleString("en-US") + "</td>";
    table_row +=
      "<td>$" + values.mortgage_total.toLocaleString("en-US") + "</td></tr>";
    table.innerHTML += table_row;

    //values for cost table
    values.yearly_mortgage_total = values.mortgage_total * 12;
    values.yearly_hoa_fees = parseInt(hoa_fees) * 12;
    values.yearly_utility_cost = utility_cost * 12;
    values.yearly_total_cost =
      values.yearly_mortgage_total +
      parseInt(property_tax) +
      values.yearly_utility_cost +
      values.yearly_hoa_fees;
    values.monthly_total_cost = Math.round(
      parseInt(values.yearly_total_cost) / 12
    );

    //construct cost Table row's columns
    let cost_table_row = "<tr><td>" + dp[i] + "%</td>";
    cost_table_row +=
      "<td>$" + values.mortgage_total.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + values.yearly_mortgage_total.toLocaleString("en-US") + "</td>";
    cost_table_row += "<td>$" + property_tax.toLocaleString("en-US") + "</td>";
    cost_table_row += "<td>$" + utility_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + values.yearly_utility_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + values.yearly_hoa_fees.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" + values.yearly_total_cost.toLocaleString("en-US") + "</td>";
    cost_table_row +=
      "<td>$" +
      values.monthly_total_cost.toLocaleString("en-US") +
      "</td></tr>";
    cost_table.innerHTML += cost_table_row;
  }
}

var utilities = {
  gas: 0,
  electricity: 0,
  water: 0,
  sewer: 0,
  trash: 0,
  internet: 0,
  hoi: 0,
};
var options = document.getElementById("options");

function showUtil() {
  let input = document.getElementById("util_chk");
  let table = document.getElementById("utility_table");
  while (table.childNodes.length > 2) {
    table.removeChild(table.lastChild);
  }
  if (input.checked) {
    document.getElementById("utility_options").style.display = "block";
    for (let i = 0; i < options.childNodes.length; i++) {
      if (options.childNodes[i].checked) {
        let table_row = "<tr><td>" + options.childNodes[i].value + "</td>";
        table_row +=
          '<td>$<input type="number" id="val' +
          options.childNodes[i].id +
          '" onchange="calcUtil()" value="' +
          utilities[options.childNodes[i].id] +
          '"/></td></tr>';
        table.innerHTML += table_row;
      }
    }
    table.innerHTML += "<tr><th>Total:</th><td id='util_total'>$0</td></tr>";
    calcUtil();
  } else {
    document.getElementById("utility_options").style.display = "none";
  }
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
    document.getElementById("rental_options").style.display = "block";
  } else {
    document.getElementById("rental_options").style.display = "none";
  }
}

function showDp() {
  let input = document.getElementById("add_dp");
  if (input.checked) {
    document.getElementById("dp_options").style.display = "block";
  } else {
    document.getElementById("dp_options").style.display = "none";
  }
}