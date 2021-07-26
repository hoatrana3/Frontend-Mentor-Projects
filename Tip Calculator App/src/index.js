import "./styles.scss";

const calculatorForm = document.getElementById("calculatorForm");
const {
  bill: billInput,
  tipAmt: tipAmtRadioGroup,
  tipAmtAlt: tipAmtAltInput,
  peopleNum: peopleNumInput
} = calculatorForm.elements;
const tipAmtRadios = Array.from(
  document.querySelectorAll(".calculator__tip-list input[type='radio']")
);
const resTipAmt = document.getElementById("resTipAmt");
const resTotal = document.getElementById("resTotal");
const btnReset = document.getElementById("btnReset");
let prevVal = { bill: "", tipAmt: "", tipAmtAlt: "", peopleNum: "" };

const addError = (el, useMessage = true) => {
  el.classList.remove("is-valid");
  el.classList.add("has-error");
  if (useMessage) el.parentNode.setAttribute("data-error", "Can't be zero");
};
const addValid = (el) => {
  el.classList.remove("has-error");
  el.classList.add("is-valid");
  el.parentNode.removeAttribute("data-error");
};
const resetValidate = (el) => {
  el.classList.remove("has-error");
  el.classList.remove("is-valid");
  el.parentNode.removeAttribute("data-error");
};

const validateForm = ({ bill, tipAmtAlt, peopleNum }) => {
  let isGood = true;
  const intBill = parseInt(bill);
  const intPeopleNum = parseInt(peopleNum);
  const intTipAmtAlt = parseInt(tipAmtAlt);

  if (prevVal.bill !== bill) {
    if (isNaN(intBill) || intBill <= 0) {
      addError(billInput);
      isGood = false;
    } else {
      addValid(billInput);
    }
  }

  if (prevVal.tipAmtAlt !== tipAmtAlt) {
    if (isNaN(intTipAmtAlt) || intTipAmtAlt <= 0) {
      addError(tipAmtAltInput, false);
      isGood = false;
    } else {
      addValid(tipAmtAltInput);
    }
  }

  if (prevVal.peopleNum !== peopleNum) {
    if (isNaN(intPeopleNum) || intPeopleNum <= 0) {
      addError(peopleNumInput);
      isGood = false;
    } else {
      addValid(peopleNumInput);
    }
  }

  return isGood;
};

const toggleTipAmtField = ({ tipAmt, tipAmtAlt }) => {
  if (prevVal.tipAmtAlt !== tipAmtAlt && tipAmtAlt?.length) {
    tipAmtRadioGroup.value = "";
    tipAmtRadios.forEach((r) => (r.checked = false));
  }

  if (prevVal.tipAmt !== tipAmt && tipAmt?.length) {
    tipAmtAltInput.value = "";
  }
};

const calculateResult = ({ bill, tipAmt, tipAmtAlt, peopleNum }) => {
  const financial = (x) => {
    const formated = Number.parseFloat(x).toFixed(2);
    return isNaN(formated) ? "$0.00" : `${formated}`;
  };
  const intBill = parseInt(bill);
  const intTipAmt = parseInt(tipAmt);
  const intTipAmtAlt = parseInt(tipAmtAlt);
  const intFinalTipAmt = isNaN(intTipAmtAlt) ? intTipAmt : intTipAmtAlt;
  const intPeopleNum = parseInt(peopleNum);
  const calcTipAmtPer = financial(
    (intBill * (intFinalTipAmt / 100)) / intPeopleNum
  );
  const calcTotalPer = financial(intBill / intPeopleNum);

  resTipAmt.innerHTML = calcTipAmtPer;
  resTotal.innerHTML = calcTotalPer;
};

calculatorForm.addEventListener("input", () => {
  const formData = new FormData(calculatorForm);
  const formVal = Object.fromEntries(formData);

  if (validateForm(formVal)) {
    toggleTipAmtField(formVal);
    calculateResult(formVal);
  }

  prevVal = formVal;
});

btnReset.addEventListener("click", () => {
  calculatorForm.reset();
  resetValidate(billInput);
  resetValidate(tipAmtAltInput);
  resetValidate(peopleNumInput);
});
