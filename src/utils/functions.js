import moment from "moment";

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function getMonthNumberToText(month = "") {
  switch (month.toString()) {
    case "00":
    case "0":
      return "Enero";
    case "01":
    case "1":
      return "Febrero";
    case "02":
    case "2":
      return "Marzo";
    case "03":
    case "3":
      return "Abril";
    case "04":
    case "4":
      return "Mayo";
    case "05":
    case "5":
      return "Junio";
    case "06":
    case "6":
      return "Julio";
    case "07":
    case "7":
      return "Agosto";
    case "08":
    case "8":
      return "Septiembre";
    case "09":
    case "9":
      return "Octubre";
    case "10":
      return "Noviembre";
    case "11":
      return "Diciembre";
    default:
      return "";
  }
}

export function getNumberFormatedText(number) {
  if (number < 10) return `00${number}`;
  if (number < 100) return `0${number}`;
  return `${number}`;
}

export const setTimeOutLocal = ({
  timeout = 20000,
  callback = () => {
    console.log("CALLBACK_TIMEOUT");
  },
}) => {
  setTimeout(() => {
    callback();
  }, timeout);
};

export const sumTotalProfit = (
  purchases,
  percentageProfit,
  contract = true,
  contractEmp = {}
) => {
  let total = 0;
  let totalProduct = 0;

  purchases.forEach((purchase) => {
    purchase.PurchaseProduct.forEach((product) => {
      totalProduct += parseInt(product.ContractProduct.priceOffert);
    });
  });
  total = parseFloat(totalProduct * (percentageProfit / 100));

  if (contract) return parseFloat(total.toFixed(2));

  return parseFloat(
    (total * (contractEmp.ContractEmployee.percentageProfit / 100)).toFixed(2)
  );
};

export const getRandomArbitrary = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

export const cleanUpBlanks = (str) => {
  return str.replace(/\s/g, "");
};

export function sortList(list, field, order = "ASC") {
  let sorted = list;

  if (order === "ASC") {
    sorted = list.sort((objA, objB) => (objA[field] > objB[field] ? 1 : -1));
  } else {
    sorted = list.sort((objA, objB) => (objB[field] > objA[field] ? 1 : -1));
  }

  return sorted;
}

export const isDateOlderThan24Hours = (dateIso) => {
  const date = moment(dateIso);

  const date24HoursAgo = moment().subtract(24, "hours");

  return date.isBefore(date24HoursAgo);
};
