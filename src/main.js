import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function cardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    riot: ["#33C4CD", "#CB1111"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])

  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
//cardType("visa")
globalThis.cardType = cardType
//deixar o acesso da function de forma global no window
// podendo ser acessada diretamente pelo console

//uso do IMAsk
const cvcEl = document.querySelector("#security-code") //el com o cód de segurança
const securityPattern = {
  // objeto com o padrão que será usado, 3 números/dígitos no caso
  mask: "000",
}
const maskedCode = IMask(cvcEl, securityPattern) // aplicação da mask passando "em quem" e "como"

const expirationDateEl = document.querySelector("#expiration-date") // elemento da date de expiração
const expirationPattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationMasked = IMask(expirationDateEl, expirationPattern)

// criação da mask para o número do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, //começa com o número 4 seguido por 15 dígitos
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^10\d{0,15}/,
      cardtype: "riot",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//manipulação de DOM
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {})
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
const userName = document.querySelector("#card-holder")
userName.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    userName.value.length === 0 ? "Fulano Da Silva" : userName.value
})
//Manipulação de eventos do IMask
maskedCode.on("accept", () => {
  updateSecurityCode(maskedCode.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const typeCard = cardNumberMasked.masked.currentMask.cardtype
  cardType(typeCard)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationMasked.on("accept", () => {
  updateExpirationDate(expirationMasked)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
