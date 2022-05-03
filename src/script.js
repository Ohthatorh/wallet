import "regenerator-runtime/runtime";
import Navigo from "navigo";
import { cabinet, cabinetFunctions } from "./components/cabinet/cabinet";
import { login, loginFunctions } from "./components/login/login";
const router = new Navigo("/");

// router.on("/", function () {
//   loginFunctions();
// });
// router.on("/cabinet.html", function () {
//   document.querySelector(".main").innerHTML = cabinet();
//   cabinetFunctions();
// });
